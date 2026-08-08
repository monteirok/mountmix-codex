import { spawnSync } from "node:child_process";

const repository = spawnSync("git", ["rev-parse", "--git-dir"], {
  encoding: "utf8",
  stdio: "ignore",
});

if (repository.status === 0) {
  const configured = spawnSync("git", ["config", "core.hooksPath", ".githooks"], {
    encoding: "utf8",
    stdio: "inherit",
  });

  if (configured.status !== 0) process.exitCode = configured.status ?? 1;
}
