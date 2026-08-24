## Why

`playwright-ts/coding-guide.md` exists but isn't wired into anything: it isn't loaded automatically when Claude Code (or a human) edits code in `playwright-ts/`, and the three test-authoring subagents that actually write and heal most of the spec files (`playwright-test-generator`, `playwright-test-healer`) never read it, since subagents run on their own frontmatter system prompt and don't inherit nested `CLAUDE.md` context. Without explicit wiring, "follow the coding guide" is a convention that exists only on disk, not one that's actually enforced for new tests. The repo also has no documented rule about whether a coding guide is shared across framework directories or owned per-directory, which matters as more framework directories (`cypress-ts`, `playwright-java`, etc.) get added later.

## What Changes

- Add `playwright-ts/CLAUDE.md` that references `coding-guide.md` (via Claude Code's `@` import), so it's automatically in context for any direct human/main-agent edits inside `playwright-ts/`.
- Update `playwright-test-generator.md` and `playwright-test-healer.md` (the subagents that write/edit spec files) to explicitly read and follow `playwright-ts/coding-guide.md` before writing or editing a test file.
- Document, at the repo-scaffolding level, that a framework directory's coding guide (when it has one) is owned by that directory only — other framework directories do not inherit it and must write their own if/when they need one.
- Reference the coding guide from `playwright-ts/README.md` for discoverability by human contributors.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `repo-scaffolding`: adds a requirement that a per-framework coding guide, where present, is owned exclusively by its own directory — not shared or inherited across framework directories.
- `playwright-ts`: adds a requirement that the workspace's coding guide is actually loaded/enforced for new test code, not just present on disk.
- `playwright-test-authoring-agents`: adds a requirement that the generator and healer subagents read and follow the coding guide before writing or editing a test file.

## Impact

- Affected files: `playwright-ts/CLAUDE.md` (new), `playwright-ts/.claude/agents/playwright-test-generator.md`, `playwright-ts/.claude/agents/playwright-test-healer.md`, `playwright-ts/README.md`, root `README.md` (Conventions section).
- No changes to test code, application code, or CI.
