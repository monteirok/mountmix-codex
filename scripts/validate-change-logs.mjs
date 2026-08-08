import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const changeLogPath = "CHANGES.md";
const legacyChangeLogPath = "CHANGE.md";
const securityLogPath = "SECURITY_AUDITS.md";
const excludedLogs = new Set([changeLogPath, legacyChangeLogPath, securityLogPath]);
const cached = process.argv.includes("--cached");
const printRanges = process.argv.includes("--print-ranges");

function git(args, options = {}) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    if (options.allowFailure) return "";
    throw error;
  }
}

function lineRange(start, count) {
  if (count <= 0) return [];
  return [{ start, end: start + count - 1 }];
}

function mergeRanges(ranges) {
  const ordered = [...ranges].sort((left, right) => left.start - right.start || left.end - right.end);
  const merged = [];

  for (const range of ordered) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end + 1) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  return merged;
}

function emptyChange(path) {
  return { path, added: [], modified: [], deleted: [], binary: false };
}

function parseDiff(diff) {
  const changes = new Map();
  let current = null;
  let oldPath = null;
  let headerPath = null;

  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git ")) {
      current = null;
      oldPath = null;
      const header = line.match(/^diff --git a\/(.+) b\/(.+)$/);
      headerPath = header?.[2] ?? null;
      continue;
    }

    if (line.startsWith("--- a/")) {
      oldPath = line.slice(6);
      continue;
    }

    if (line.startsWith("+++ b/")) {
      const path = line.slice(6);
      if (!excludedLogs.has(path)) {
        current = changes.get(path) ?? emptyChange(path);
        changes.set(path, current);
      }
      continue;
    }

    if (line === "+++ /dev/null" && oldPath && !excludedLogs.has(oldPath)) {
      current = changes.get(oldPath) ?? emptyChange(oldPath);
      changes.set(oldPath, current);
      continue;
    }
    if (line.startsWith("Binary files ") && headerPath && !excludedLogs.has(headerPath)) {
      current = changes.get(headerPath) ?? emptyChange(headerPath);
      changes.set(headerPath, current);
      current.binary = true;
      continue;
    }

    if (!current || !line.startsWith("@@ ")) continue;
    const match = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if (!match) throw new Error(`Unable to parse diff hunk: ${line}`);

    const oldStart = Number(match[1]);
    const oldCount = match[2] === undefined ? 1 : Number(match[2]);
    const newStart = Number(match[3]);
    const newCount = match[4] === undefined ? 1 : Number(match[4]);

    if (oldCount === 0) {
      current.added.push(...lineRange(newStart, newCount));
      continue;
    }
    if (newCount === 0) {
      current.deleted.push(...lineRange(oldStart, oldCount));
      continue;
    }

    const sharedCount = Math.min(oldCount, newCount);
    current.modified.push(...lineRange(newStart, sharedCount));
    current.added.push(...lineRange(newStart + sharedCount, newCount - sharedCount));
    current.deleted.push(...lineRange(oldStart + sharedCount, oldCount - sharedCount));
  }

  for (const change of changes.values()) {
    change.added = mergeRanges(change.added);
    change.modified = mergeRanges(change.modified);
    change.deleted = mergeRanges(change.deleted);
  }

  return changes;
}

function inspectFile(path) {
  const buffer = readFileSync(path);
  if (buffer.includes(0)) return { binary: true, lines: 0 };
  const content = buffer.toString("utf8");
  if (!content) return { binary: false, lines: 0 };
  const lines = content.endsWith("\n") ? content.split(/\r?\n/).length - 1 : content.split(/\r?\n/).length;
  return { binary: false, lines };
}

function collectChanges() {
  const diffArgs = ["diff"];
  if (cached) diffArgs.push("--cached");
  else diffArgs.push("HEAD");
  diffArgs.push("--unified=0", "--no-color", "--no-renames", "--", ".");

  const changes = parseDiff(git(diffArgs));
  if (!cached) {
    const untracked = git(["ls-files", "--others", "--exclude-standard", "-z"])
      .split("\0")
      .filter((path) => path && !excludedLogs.has(path));

    for (const path of untracked) {
      const change = emptyChange(path);
      const file = inspectFile(path);
      change.binary = file.binary;
      change.added = lineRange(1, file.lines);
      changes.set(path, change);
    }
  }

  return changes;
}

function formatRanges(ranges, binary) {
  if (binary) return "N/A (binary file has no line ranges)";
  if (ranges.length === 0) return "None";
  return ranges.map(({ start, end }) => (start === end ? `${start}` : `${start}-${end}`)).join(", ");
}

function formatChange(change) {
  return [
    `- \`${change.path}\``,
    `  - Added: ${formatRanges(change.added, change.binary)}`,
    `  - Modified: ${formatRanges(change.modified, change.binary)}`,
    `  - Deleted: ${formatRanges(change.deleted, change.binary)}`,
  ].join("\n");
}

function readCurrent(path) {
  if (cached) return git(["show", `:${path}`], { allowFailure: true });
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function readBase(path) {
  return git(["show", `HEAD:${path}`], { allowFailure: true });
}

function entryType(path) {
  return path === changeLogPath
    ? { marker: "CHANGE", prefix: "C" }
    : { marker: "SECURITY AUDIT", prefix: "S" };
}

function parseEntries(content, path) {
  const { marker, prefix } = entryType(path);
  const markers = [...content.matchAll(new RegExp(`^<!--!  ${marker} #(\\d+) -->$`, "gm"))];

  return markers.map((entryMarker, index) => {
    const bodyStart = entryMarker.index ?? 0;
    const bodyEnd = markers[index + 1]?.index ?? content.length;
    const body = content.slice(bodyStart, bodyEnd);
    const number = Number(entryMarker[1]);
    const title = body.match(new RegExp(`^  \\[${prefix}\\.${number}\\] (.+)$`, "m"))?.[1]?.trim() ?? "";
    return { title, body, number };
  });
}

function isFormatMigration(path, base, current) {
  if (path === changeLogPath) {
    return base.startsWith("# Change Log") && current.startsWith("<!--! ~=~=~=~=~=~ -->");
  }
  return base.startsWith("# Security Audit Log") && current.startsWith("<!--! ~=~=~=~=~=~ -->");
}

function appendedEntries(path) {
  const current = readCurrent(path);
  if (!current) throw new Error(`${path} is missing or empty.`);

  const base = readBase(path);
  const formatMigration = base && isFormatMigration(path, base, current);
  if (base && !current.startsWith(base) && !formatMigration) {
    throw new Error(`${path} is append-only; existing content was modified or removed.`);
  }

  if (path === changeLogPath && !base && readBase(legacyChangeLogPath)) {
    const migratedEntries = parseEntries(current, path);
    if (migratedEntries.length === 0) throw new Error(`${path} does not contain a change entry.`);
    return migratedEntries.slice(-1);
  }

  if (formatMigration) {
    const migratedEntries = parseEntries(current, path);
    if (migratedEntries.length === 0) throw new Error(`${path} does not contain a migrated entry.`);
    return migratedEntries.slice(-1);
  }

  const entries = parseEntries(current.slice(base.length), path);

  if (entries.length === 0) throw new Error(`${path} must append at least one level-two entry for this change.`);
  return entries;
}

function parseRangeValue(value) {
  const normalized = value.trim();
  if (normalized === "None") return [];
  if (normalized === "N/A (binary file has no line ranges)") return "binary";

  return normalized.split(",").map((part) => {
    const match = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`Invalid line range: ${value}`);
    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);
    if (start < 1 || end < start) throw new Error(`Invalid line range: ${value}`);
    return { start, end };
  });
}

function entryFiles(entry) {
  const files = new Map();
  const pattern = /^- `([^`]+)`\n  - Added: ([^\n]+)\n  - Modified: ([^\n]+)\n  - Deleted: ([^\n]+)/gm;

  for (const match of entry.body.matchAll(pattern)) {
    files.set(match[1], {
      added: parseRangeValue(match[2]),
      modified: parseRangeValue(match[3]),
      deleted: parseRangeValue(match[4]),
    });
  }

  return files;
}

function validateMetadata(entry, path) {
  const { prefix } = entryType(path);
  if (!entry.title) {
    throw new Error(`${path} entry ${entry.number} has an invalid [${prefix}.n] title.`);
  }
  if (!/^<div style="[^"]+">\n  \[[CS]\.\d+\] .+\n<\/div>$/m.test(entry.body)) {
    throw new Error(`${path} entry "${entry.title}" has an invalid styled title block.`);
  }
  if (!/^<p style="[^"]+">\n  📅 \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (?:Z|[+-]\d{4}) 🤖 \S.*\n<\/p>$/m.test(entry.body)) {
    throw new Error(`${path} entry "${entry.title}" has an invalid date, timezone, or model block.`);
  }
  if (!/^#### Files changed:\s*$/m.test(entry.body)) {
    throw new Error(`${path} entry "${entry.title}" is missing Files changed.`);
  }
  if (!/^#### Description\s*$/m.test(entry.body)) {
    throw new Error(`${path} entry "${entry.title}" is missing Description.`);
  }
}

function normalizedRanges(value) {
  if (value === "binary") return "binary";
  return formatRanges(mergeRanges(value), false);
}

function validateCoverage(entries, changes, path) {
  const logged = new Map();
  for (const entry of entries) {
    validateMetadata(entry, path);
    for (const [file, ranges] of entryFiles(entry)) {
      if (logged.has(file)) throw new Error(`${path} logs ${file} more than once for the current diff.`);
      logged.set(file, ranges);
    }
  }

  for (const [file, change] of changes) {
    const ranges = logged.get(file);
    if (!ranges) throw new Error(`${path} does not log changed file ${file}.`);

    for (const kind of ["added", "modified", "deleted"]) {
      const expected = change.binary ? "binary" : formatRanges(change[kind], false);
      const actual = normalizedRanges(ranges[kind]);
      if (actual !== expected) {
        throw new Error(`${path} has incorrect ${kind} ranges for ${file}: expected ${expected}, received ${actual}.`);
      }
    }
  }

  for (const file of logged.keys()) {
    if (!changes.has(file)) throw new Error(`${path} logs ${file}, but it is not in the current diff.`);
  }
}

function validateLogStructure(path) {
  const content = readCurrent(path);
  if (!content.startsWith("<!--! ~=~=~=~=~=~ -->")) {
    throw new Error(`${path} must start with the standard numbered entry header.`);
  }
  if (readCurrent(legacyChangeLogPath)) {
    throw new Error(`${legacyChangeLogPath} must not remain after migration to ${changeLogPath}.`);
  }

  const entries = parseEntries(content, path);
  if (entries.length === 0) throw new Error(`${path} does not contain any entries.`);
  entries.forEach((entry, index) => {
    if (entry.number !== index + 1) throw new Error(`${path} entry numbers must be sequential.`);
    validateMetadata(entry, path);
  });
}

function validateSecurityFields(entries) {
  const required = [
    "Audit scope",
    "Threats and attack surfaces reviewed",
    "Findings and severity",
    "Evidence",
    "Remediation performed or recommended",
    "Residual risk",
    "Verification performed",
  ];

  for (const entry of entries) {
    for (const field of required) {
      if (!new RegExp(`^#### ${field}\\n- \\S`, "m").test(entry.body)) {
        throw new Error(`${securityLogPath} entry "${entry.title}" is missing ${field}.`);
      }
    }
  }
}

function rejectSensitiveLogContent(path) {
  const content = readCurrent(path);
  const sensitivePatterns = [
    /\bBearer\s+[A-Za-z0-9._~-]+/i,
    /[?&](?:token|key|secret)=[^\s)`]+/i,
    /\b(?:RESEND_API_KEY|OPENAI_API_KEY)\s*=\s*\S+/i,
    /\bre_[A-Za-z0-9_-]{20,}\b/,
  ];

  if (sensitivePatterns.some((pattern) => pattern.test(content))) {
    throw new Error(`${path} appears to contain sensitive credential material.`);
  }
}

const changes = collectChanges();
if (printRanges) {
  if (changes.size === 0) console.log("No non-log changes detected.");
  else console.log([...changes.values()].sort((a, b) => a.path.localeCompare(b.path)).map(formatChange).join("\n"));
  process.exit(0);
}

try {
  validateLogStructure(changeLogPath);
  validateLogStructure(securityLogPath);
  rejectSensitiveLogContent(changeLogPath);
  rejectSensitiveLogContent(securityLogPath);

  if (changes.size === 0) {
    console.log("Change and security audit logs are valid; no non-log changes require a new entry.");
    process.exit(0);
  }

  const changeEntries = appendedEntries(changeLogPath);
  const securityEntries = appendedEntries(securityLogPath);
  validateCoverage(changeEntries, changes, changeLogPath);
  validateCoverage(securityEntries, changes, securityLogPath);
  validateSecurityFields(securityEntries);
  console.log(`Validated ${changes.size} changed file(s) against append-only change and security audit logs.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
