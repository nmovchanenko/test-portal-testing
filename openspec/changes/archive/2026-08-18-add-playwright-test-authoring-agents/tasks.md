## 1. Verify existing scaffolding matches the design

- [x] 1.1 Confirm `playwright-ts/.mcp.json` registers the `playwright-test` MCP server via `npx playwright run-test-mcp-server`
- [x] 1.2 Confirm `playwright-ts/.claude/agents/` contains `playwright-test-planner.md`, `playwright-test-generator.md`, `playwright-test-healer.md`, unmodified from `npx playwright init-agents --loop claude` output
- [x] 1.3 Confirm `playwright-ts/tests/api/seed.spec.ts` exists as the seed file for the `api` project

## 2. Fill documentation gaps

- [x] 2.1 Replace `playwright-ts/specs/README.md`'s placeholder with real content: what the directory is for, how the planner agent populates it, how plans relate to files under `tests/`
- [x] 2.2 Update `playwright-ts/README.md`'s "what this covers today" section to mention the agent-assisted authoring workflow (planner → generator → healer) and where to find test plans vs. generated tests

## 3. Verification

- [x] 3.1 Run `npm test` in `playwright-ts/` and confirm the `api` project's seed test passes while `ui` and `mocking` still report zero tests found
- [x] 3.2 Confirm `.mcp.json` and `.claude/agents/*.md` are tracked in git (not accidentally covered by an existing `.gitignore` rule)
- [x] 3.3 Re-read `playwright-ts/specs/README.md` and `playwright-ts/README.md` against the `playwright-test-authoring-agents` and modified `playwright-ts` spec requirements to confirm every scenario is covered
