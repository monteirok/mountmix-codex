# Repository Instructions

## Change And Security Audit Logs

Every task that changes code, configuration, documentation, dependencies, or assets must update both `CHANGES.md` and `SECURITY_AUDITS.md` before completion.

1. Run `npm run audit:logs:ranges` after the implementation is final to derive line ranges from the actual Git diff.
2. Append one `CHANGES.md` entry per logical change using its existing numbered comment header, styled title and metadata blocks, file list, section dividers, description, and spacer format. Never rewrite or remove an existing entry unless correcting a demonstrable factual error.
3. Perform a security review for every task and append one `SECURITY_AUDITS.md` entry, including when no vulnerabilities are found. Use the same visual structure as `CHANGES.md`, with sequential `[S.n]` identifiers and the required security sections.
4. Obtain the timestamp from `date '+%Y-%m-%d %H:%M:%S %z'`. Use the repository timezone when configured; otherwise use the system timezone or UTC.
5. Record the exact model name only when the runtime exposes it. Otherwise record `Unavailable`.
6. Do not include secrets, credentials, tokens, personal data, exploit payloads, or unnecessary sensitive vulnerability details in either log.
7. Run `npm run audit:logs` before declaring the task complete. The pre-commit hook runs the same validator against staged changes.

Changes made only to append the two logs do not need separate log entries.
