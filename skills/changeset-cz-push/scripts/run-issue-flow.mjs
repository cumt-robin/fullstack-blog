#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";

function parseArgs(argv) {
  const result = {
    base: "main",
    remote: "origin",
    scope: "",
    body: "",
    stageAll: true,
    push: true,
    dryRun: false,
    entry: [],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--issue") {
      result.issue = argv[++i];
      continue;
    }
    if (arg === "--base") {
      result.base = argv[++i] ?? "main";
      continue;
    }
    if (arg === "--remote") {
      result.remote = argv[++i] ?? "origin";
      continue;
    }
    if (arg === "--entry") {
      result.entry.push(argv[++i]);
      continue;
    }
    if (arg === "--changeset-summary") {
      result.changesetSummary = argv[++i];
      continue;
    }
    if (arg === "--empty-changeset") {
      result.emptyChangeset = true;
      continue;
    }
    if (arg === "--type") {
      result.type = argv[++i];
      continue;
    }
    if (arg === "--scope") {
      result.scope = argv[++i] ?? "";
      continue;
    }
    if (arg === "--subject") {
      result.subject = argv[++i];
      continue;
    }
    if (arg === "--body") {
      result.body = argv[++i] ?? "";
      continue;
    }
    if (arg === "--no-stage-all") {
      result.stageAll = false;
      continue;
    }
    if (arg === "--no-push") {
      result.push = false;
      continue;
    }
    if (arg === "--dry-run") {
      result.dryRun = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return result;
}

function run(command, args, options = {}) {
  const completed = spawnSync(command, args, {
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    shell: false,
    ...options,
  });

  if (completed.error) {
    throw completed.error;
  }

  if (completed.status !== 0) {
    const stderr = completed.stderr?.toString("utf8")?.trim();
    throw new Error(stderr || `${command} ${args.join(" ")} failed with exit code ${completed.status}.`);
  }

  return completed.stdout?.toString("utf8")?.trim() ?? "";
}

function runNodeScript(scriptName, scriptArgs, capture = false) {
  return run(process.execPath, [path.join("skills", "changeset-cz-push", "scripts", scriptName), ...scriptArgs], { capture });
}

function ensureBranch(branchName, baseBranch) {
  const existing = run("git", ["branch", "--list", branchName], { capture: true });
  if (existing) {
    run("git", ["switch", branchName]);
    return "switched";
  }
  run("git", ["switch", "-c", branchName, baseBranch]);
  return "created";
}

const args = parseArgs(process.argv.slice(2));
if (!args.issue?.trim()) {
  throw new Error("--issue is required.");
}
if (!args.type?.trim()) {
  throw new Error("--type is required.");
}
if (!args.subject?.trim()) {
  throw new Error("--subject is required.");
}
if (!args.emptyChangeset) {
  if (!args.entry.length) {
    throw new Error("At least one --entry is required unless --empty-changeset is used.");
  }
  if (!args.changesetSummary?.trim()) {
    throw new Error("--changeset-summary is required unless --empty-changeset is used.");
  }
}

const branchName = `issue/${args.issue}`;
const changesetArgs = args.emptyChangeset
  ? ["--empty"]
  : args.entry.flatMap((entry) => ["--entry", entry]).concat(["--summary", args.changesetSummary]);
const commitArgs = [
  "--type", args.type,
  "--scope", args.scope,
  "--subject", args.subject,
  "--body", args.body,
  "--branch", branchName,
  "--remote", args.remote,
];
if (args.stageAll) {
  commitArgs.push("--stage-all");
}
if (args.push) {
  commitArgs.push("--push");
}

if (args.dryRun) {
  process.stdout.write(`${JSON.stringify({
    base: args.base,
    branchName,
    branchAction: "create-or-switch",
    changesetArgs,
    commitArgs,
  }, null, 2)}\n`);
  process.exit(0);
}

const branchAction = ensureBranch(branchName, args.base);
const changesetPath = runNodeScript("new-changeset.mjs", changesetArgs, true);
const commitResult = runNodeScript("invoke-conventional-commit.mjs", commitArgs, true);

process.stdout.write(`${JSON.stringify({
  base: args.base,
  branchName,
  branchAction,
  changesetPath,
  commit: JSON.parse(commitResult),
}, null, 2)}\n`);
