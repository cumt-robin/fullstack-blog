---
name: changeset-cz-push
description: Create an `issue/<number>` branch from `main`, generate a changeset, write a Conventional Commit that matches the repository's Commitizen/commitlint rules, and push the branch. Use when Codex is asked to standardize or execute an issue-driven submission flow where the user provides an issue number and expects Codex to infer affected packages, write the changeset summary, generate a non-interactive Conventional Commit message, add `fix #<issue>`, and push the branch on Windows or macOS.
---

# Changeset CZ Push

## Overview

Use this skill when the user wants a single issue-driven submission flow:

1. Create or switch to `issue/<number>` from `main`.
2. Inspect the current worktree and infer the affected packages.
3. Generate a changeset summary and release entries.
4. Summarize the change into a valid Conventional Commit.
5. Push `issue/<number>` to the remote.

The agent is responsible for understanding the diff and producing the semantic inputs. The bundled Node.js scripts are responsible for performing the branch, changeset, commit, and push steps reliably across Windows and macOS.

## Default Workflow

### 1. Create the issue branch first

When the user gives only issue number `x`, create or switch to `issue/x` from `main` before generating any metadata.

Use the unified script after inferring the rest of the fields:

```bash
node ./skills/changeset-cz-push/scripts/run-issue-flow.mjs \
  --issue 123 \
  --entry vite-vue3:patch \
  --changeset-summary "fix article detail page empty state" \
  --type fix \
  --scope vite-vue3 \
  --subject "handle empty tag list state"
```

Branch behavior:

- If `issue/x` does not exist, the script runs `git switch -c issue/x main`.
- If `issue/x` already exists, the script switches to it.
- Keep the user on that branch for the rest of the flow.

### 2. Infer changeset contents from the diff

Before calling the script, inspect the current worktree and infer:

- Which workspace packages are affected.
- The correct release bump for each package.
- A short user-facing changeset summary sentence.

Use these rules:

- `fix`, `refactor`, `perf`, `style`, and test-only behavioral corrections usually map to `patch`.
- User-visible capabilities usually map to `minor`.
- Breaking changes map to `major`.
- If no package should release, use `--empty-changeset`.

Prefer package names from each workspace `package.json` when available. In this repo, common scopes usually map cleanly to folder names such as `vite-vue3`, `nest-server`, or workspace package names under `packages/`.

### 3. Generate the changeset through the helper

The helper intentionally runs the official CLI first:

```bash
node ./skills/changeset-cz-push/scripts/new-changeset.mjs \
  --entry vite-vue3:patch \
  --summary "fix article detail page empty state"
```

What it does:

- Runs `pnpm changeset add --empty` to create an official changeset file.
- Rewrites that file with the inferred frontmatter and summary.
- Renames the file to a readable timestamp-based name.

This is more stable than driving the TUI key-by-key across platforms, while still keeping the flow anchored to the repo's `pnpm changeset` command.

### 4. Auto-generate a Conventional Commit message

Inspect the diff and generate these fields before calling the commit helper:

- `type`: choose from `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.
- `scope`: prefer the main app/package name when it adds clarity.
- `subject`: imperative, concise, and behavior-focused.
- `body`: optional, but include it when the change needs context.

Good commit subjects:

- `fix(vite-vue3): handle empty tag list state`
- `feat(nest-server): validate article publish payload`
- `refactor(utils): simplify date formatting helper`

Avoid implementation-heavy subjects like `update code`, `fix bug`, or raw file-name lists.

### 5. Commit and push with issue linkage

Use the helper directly when needed:

```bash
node ./skills/changeset-cz-push/scripts/invoke-conventional-commit.mjs \
  --type fix \
  --scope vite-vue3 \
  --subject "handle empty tag list state" \
  --body "show a stable empty state instead of rendering a broken panel" \
  --branch issue/123 \
  --stage-all \
  --push
```

What it does:

- Derives `fix #123` from `issue/123`.
- Builds a non-interactive Conventional Commit message that matches the repo's Commitizen-style format.
- Wraps the body to stay within commitlint line-length rules.
- Runs `git commit` directly.
- Pushes the branch after the commit succeeds.

## What To Infer Automatically

When the user provides only the issue number, do all of the following without asking for more input unless the diff is genuinely ambiguous:

- Read the changed files.
- Infer affected packages.
- Infer release bump types.
- Write the changeset summary.
- Write the commit type, scope, subject, and optional body.

Escalate only when one of these is unclear enough to risk a wrong release or misleading commit history.

## Conventional Commit Rules

Match the repo's Commitizen and commitlint behavior:

- Use `type(scope): subject` when a scope helps.
- Omit the scope when it adds no value.
- Keep the subject imperative and concise.
- Wrap body lines so they do not exceed the repo's commitlint body length limit.
- Always append `fix #<issue>` as the final trailer unless the user asks for a different issue relationship.

## Safety Checks

Before running the unified script:

- Ensure the worktree only contains intended changes.
- Ensure the diff is understood well enough to produce a trustworthy changeset and commit summary.
- Prefer `--empty-changeset` only when no released package should change.

After the script finishes:

- Report the created or switched branch.
- Report the changeset path.
- Report the final commit header.
- Report whether the branch was pushed.

## Resources

### `scripts/new-changeset.mjs`

Run `pnpm changeset add --empty`, then rewrite the generated file with inferred release entries and summary.

### `scripts/invoke-conventional-commit.mjs`

Derive `fix #<issue>` from the branch, build a non-interactive Conventional Commit message, optionally stage all files, and push the branch.

### `scripts/run-issue-flow.mjs`

Create or switch the issue branch, create the changeset, run the Conventional Commit helper, and push in one cross-platform command.
