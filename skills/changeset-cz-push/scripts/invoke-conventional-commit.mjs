#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const VALID_TYPES = new Set(["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]);
const BODY_MAX_LINE_LENGTH = 100;

function parseArgs(argv) {
  const result = {
    scope: "",
    body: "",
    remote: "origin",
    stageAll: false,
    push: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
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
    if (arg === "--branch") {
      result.branch = argv[++i];
      continue;
    }
    if (arg === "--issue") {
      result.issue = argv[++i];
      continue;
    }
    if (arg === "--remote") {
      result.remote = argv[++i] ?? "origin";
      continue;
    }
    if (arg === "--stage-all") {
      result.stageAll = true;
      continue;
    }
    if (arg === "--push") {
      result.push = true;
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

function getCurrentBranch(explicitBranch) {
  if (explicitBranch) {
    return explicitBranch;
  }

  const branch = run("git", ["branch", "--show-current"], { capture: true });
  if (!branch) {
    throw new Error("Unable to determine the current branch.");
  }

  return branch;
}

function getIssueNumber(branch, explicitIssue) {
  if (explicitIssue) {
    return explicitIssue;
  }

  const match = /(?:^|\/)issue\/(\d+)(?:$|[-_/].*)/.exec(branch);
  if (!match) {
    throw new Error(`Branch '${branch}' does not match issue/<number>. Rename the branch or pass --issue.`);
  }

  return match[1];
}

function pushBranch(branch, remote) {
  const upstream = spawnSync("git", ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"], {
    stdio: "ignore",
    shell: false,
  });

  if (upstream.status === 0) {
    run("git", ["push"]);
    return;
  }

  run("git", ["push", "--set-upstream", remote, branch]);
}

function buildCommitHeader(type, scope, subject) {
  return scope ? `${type}(${scope}): ${subject}` : `${type}: ${subject}`;
}

function wrapText(text, width) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const wrapped = [];
  for (const line of lines) {
    const words = line.split(/\s+/);
    let current = "";
    for (const word of words) {
      if (!current) {
        current = word;
        continue;
      }
      if (`${current} ${word}`.length <= width) {
        current = `${current} ${word}`;
        continue;
      }
      wrapped.push(current);
      current = word;
    }
    if (current) {
      wrapped.push(current);
    }
  }
  return wrapped;
}

function buildCommitMessage(type, scope, subject, body, issuesRef) {
  const header = buildCommitHeader(type, scope, subject.trim());
  const parts = [header];

  const wrappedBody = wrapText(body, BODY_MAX_LINE_LENGTH);
  if (wrappedBody.length > 0) {
    parts.push(wrappedBody.join("\n"));
  }

  parts.push(issuesRef);
  return parts.join("\n\n");
}

const args = parseArgs(process.argv.slice(2));
if (!VALID_TYPES.has(args.type)) {
  throw new Error(`--type must be one of: ${Array.from(VALID_TYPES).join(", ")}`);
}
if (!args.subject?.trim()) {
  throw new Error("--subject is required.");
}

const branch = getCurrentBranch(args.branch);
const issue = getIssueNumber(branch, args.issue);
const issuesRef = `fix #${issue}`;
const commitMessage = buildCommitMessage(args.type, args.scope, args.subject, args.body, issuesRef);
const commitHeader = buildCommitHeader(args.type, args.scope, args.subject.trim());

if (args.dryRun) {
  process.stdout.write(`${JSON.stringify({
    branch,
    commitHeader,
    commitMessage,
    issues: issuesRef,
    push: args.push,
    stageAll: args.stageAll,
  }, null, 2)}\n`);
  process.exit(0);
}

if (args.stageAll) {
  run("git", ["add", "-A"]);
}

run("git", ["commit", "-m", commitHeader, ...(args.body.trim() ? ["-m", wrapText(args.body, BODY_MAX_LINE_LENGTH).join("\n")] : []), "-m", issuesRef]);

if (args.push) {
  pushBranch(branch, args.remote);
}

process.stdout.write(`${JSON.stringify({
  branch,
  commitHeader,
  issues: issuesRef,
  pushed: args.push,
}, null, 2)}\n`);
