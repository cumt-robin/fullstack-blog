#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const result = { entry: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--entry") {
      result.entry.push(argv[++i]);
      continue;
    }
    if (arg === "--summary") {
      result.summary = argv[++i];
      continue;
    }
    if (arg === "--changeset-dir") {
      result.changesetDir = argv[++i];
      continue;
    }
    if (arg === "--name") {
      result.name = argv[++i];
      continue;
    }
    if (arg === "--empty") {
      result.empty = true;
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

function slugify(value) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "changeset";
}

function formatTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function getPnpmCommand() {
  return process.platform === "win32" ? "pnpm.exe" : "pnpm";
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

function listMarkdownFiles(changesetDir) {
  return new Set(
    fs.readdirSync(changesetDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name),
  );
}

const args = parseArgs(process.argv.slice(2));
if (!args.empty && !args.entry.length) {
  throw new Error("At least one --entry package:patch|minor|major is required unless --empty is used.");
}
if (!args.empty && !args.summary?.trim()) {
  throw new Error("--summary is required unless --empty is used.");
}

const changesetDir = path.resolve(process.cwd(), args.changesetDir ?? ".changeset");
if (!fs.existsSync(changesetDir)) {
  throw new Error(`Changeset directory not found: ${changesetDir}`);
}

const parsedEntries = args.empty ? [] : args.entry.map((entry) => {
  const match = /^(?<pkg>[^:]+):(?<release>patch|minor|major)$/.exec(entry);
  if (!match?.groups) {
    throw new Error(`Invalid entry '${entry}'. Use package-name:patch|minor|major`);
  }
  return match.groups;
});

const expectedName = `${formatTimestamp(new Date())}-${slugify(args.name ?? args.summary ?? "empty")}.md`;

if (args.dryRun) {
  process.stdout.write(`${JSON.stringify({
    entries: parsedEntries,
    summary: args.summary ?? "",
    empty: Boolean(args.empty),
    expectedName,
  }, null, 2)}\n`);
  process.exit(0);
}

const beforeFiles = listMarkdownFiles(changesetDir);
run(getPnpmCommand(), ["changeset", "add", "--empty"]);
const afterFiles = listMarkdownFiles(changesetDir);
const newFiles = [...afterFiles].filter((name) => !beforeFiles.has(name));

if (newFiles.length !== 1) {
  throw new Error(`Expected one new changeset file, found ${newFiles.length}.`);
}

const createdPath = path.join(changesetDir, newFiles[0]);
let content = "---\n---\n";
if (!args.empty) {
  const frontmatter = parsedEntries
    .map(({ pkg, release }) => `"${pkg}": ${release}`)
    .join("\n");
  content = `---\n${frontmatter}\n---\n\n${args.summary.trim()}\n`;
}
fs.writeFileSync(createdPath, content, "utf8");

const finalPath = path.join(changesetDir, expectedName);
if (path.basename(createdPath) !== expectedName) {
  fs.renameSync(createdPath, finalPath);
  process.stdout.write(`${path.relative(process.cwd(), finalPath)}\n`);
} else {
  process.stdout.write(`${path.relative(process.cwd(), createdPath)}\n`);
}
