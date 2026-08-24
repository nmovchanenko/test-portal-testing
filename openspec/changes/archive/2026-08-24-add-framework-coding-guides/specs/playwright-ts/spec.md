## ADDED Requirements

### Requirement: Coding guide is loaded automatically for direct edits
`playwright-ts/` SHALL maintain a `CLAUDE.md` that pulls `coding-guide.md` into context, so the guide is present automatically whenever Claude Code operates directly within `playwright-ts/`, without a contributor needing to reference it manually.

#### Scenario: Editing a spec file directly inside playwright-ts
- **WHEN** Claude Code is used to create or edit a test file directly within `playwright-ts/` (not via a subagent)
- **THEN** `playwright-ts/coding-guide.md`'s conventions are already in context, without the user needing to paste or reference it

### Requirement: Coding guide is discoverable by human contributors
`playwright-ts/README.md` SHALL reference `coding-guide.md` so a human contributor opening the workspace can find it without searching the directory tree.

#### Scenario: New contributor looks for test-writing conventions
- **WHEN** a team member opens `playwright-ts/README.md` looking for how tests in this workspace should be written
- **THEN** the README points them to `coding-guide.md`
