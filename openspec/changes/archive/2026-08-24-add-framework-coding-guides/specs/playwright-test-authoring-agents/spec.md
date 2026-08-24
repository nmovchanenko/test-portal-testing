## ADDED Requirements

### Requirement: Authoring agents follow the coding guide
The generator and healer subagents SHALL read and follow `playwright-ts/coding-guide.md` before writing a new spec file or editing an existing one, since subagents run on their own system prompt and do not automatically inherit `playwright-ts/CLAUDE.md`.

#### Scenario: Generator writes a new spec file
- **WHEN** the `playwright-test-generator` agent writes a spec file from a test-plan scenario
- **THEN** the generated file follows `coding-guide.md`'s conventions (page-object reuse, locator preferences, `test.step` usage, assertion style, and spec-body conventions)

#### Scenario: Healer edits a failing spec file
- **WHEN** the `playwright-test-healer` agent edits an existing spec file to fix a failing test
- **THEN** its edits keep the file consistent with `coding-guide.md`'s conventions rather than introducing patterns the guide discourages
