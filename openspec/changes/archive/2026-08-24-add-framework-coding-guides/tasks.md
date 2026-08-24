## 1. playwright-ts: load the guide for direct edits

- [x] 1.1 Create `playwright-ts/CLAUDE.md` that imports `coding-guide.md` (e.g. `@coding-guide.md`) with a short line telling Claude Code to follow it for any test code in this directory.
- [x] 1.2 Add a line/section to `playwright-ts/README.md` pointing contributors at `coding-guide.md`.

## 2. playwright-ts: wire the guide into the authoring agents

- [x] 2.1 Update `playwright-ts/.claude/agents/playwright-test-generator.md` to instruct it to read `playwright-ts/coding-guide.md` and follow its conventions before calling `generator_write_test`.
- [x] 2.2 Update `playwright-ts/.claude/agents/playwright-test-healer.md` to instruct it to read `playwright-ts/coding-guide.md` and keep edits consistent with it when fixing a failing test.

## 3. Repo-wide convention

- [x] 3.1 Add a bullet to the root `README.md` Conventions section documenting that a framework directory's coding guide (if any) is owned by that directory only, and other framework directories must not inherit it.

## 4. Verify

- [x] 4.1 Confirm `playwright-ts/coding-guide.md` is reachable from `playwright-ts/CLAUDE.md`, both agent files, and `playwright-ts/README.md` (no dangling references, correct relative paths).
