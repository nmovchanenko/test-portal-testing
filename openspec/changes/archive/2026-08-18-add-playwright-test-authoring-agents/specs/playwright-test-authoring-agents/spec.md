## Purpose

Defines the agent-assisted test planning, generation, and healing workflow available in `playwright-ts`, so a team member can go from exploring the app to a committed, passing test file with Claude Code driving a real browser via Playwright's MCP test server.

## ADDED Requirements

### Requirement: MCP server exposes browser and authoring tools
`playwright-ts/.mcp.json` SHALL register a `playwright-test` MCP server, launched via Playwright's bundled test-MCP command, exposing browser-automation tools and dedicated planner/generator/healer tools to Claude Code.

#### Scenario: MCP server available to Claude Code
- **WHEN** Claude Code is run from within `playwright-ts/`
- **THEN** the `playwright-test` MCP server starts and its browser and planner/generator/healer tools are available for the authoring subagents to call

### Requirement: Planner agent produces a test plan from live exploration
A dedicated planner subagent SHALL explore the running application in a real browser and produce a structured test plan covering happy paths, edge cases, and error handling, saved as a markdown document.

#### Scenario: Generating a test plan
- **WHEN** the planner agent is invoked against a running application
- **THEN** it explores the interface via browser tools and saves a test plan with numbered scenarios, each with steps and expected outcomes

### Requirement: Generator agent turns a plan item into a runnable test
A dedicated generator subagent SHALL take a single test-plan scenario plus a seed file, execute the scenario's steps live in a browser, and write the result as a single runnable Playwright spec file.

#### Scenario: Generating a test from a plan item
- **WHEN** the generator agent is given a test-plan scenario, its seed file, and a target test file path
- **THEN** it executes each step live via browser tools and writes a spec file containing exactly one test, placed in a `describe` block matching the plan item's group and titled with the scenario name

### Requirement: Healer agent repairs failing tests
A dedicated healer subagent SHALL run the test suite, debug any failing test using browser/network inspection tools, and edit the test to fix it, repeating until the suite passes or the test is explicitly marked as a known failure.

#### Scenario: Healing a failing test
- **WHEN** the healer agent is invoked and a test is failing
- **THEN** it debugs the failure, edits the test to address the root cause, and reruns it until it passes, or marks it as a known failure with an explanatory comment if it cannot be fixed with confidence

### Requirement: Test plans and seed files have dedicated, documented locations
Test-plan documents produced by the planner SHALL live under `playwright-ts/specs/`, separate from the Playwright spec files under `playwright-ts/tests/`. A seed file SHALL exist per test-plan group to establish the shared starting page state the generator uses for that group's generated tests.

#### Scenario: Locating a test plan versus its generated tests
- **WHEN** a team member wants to find the test plan behind a generated test, or the seed file it started from
- **THEN** the test plan is under `playwright-ts/specs/` and the seed file is referenced by path from the plan, distinct from the generated spec file itself
