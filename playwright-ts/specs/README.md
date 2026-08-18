# Specs

Test plans for `playwright-ts`, produced by the `playwright-test-planner` agent — distinct from `../tests/`, which holds the actual runnable Playwright spec files.

## What lives here

Markdown documents describing what to test: numbered groups of scenarios, each with steps and expected outcomes, discovered by the planner agent exploring the running application in a real browser. A plan also names the seed file (under `../tests/`) its group's generated tests should start from.

## How it's populated

1. Run the `playwright-test-planner` agent against a running TestPortal instance. It explores the app via browser tools and saves a plan here as a markdown file (e.g. `plan.md`).
2. Run the `playwright-test-generator` agent against one scenario from that plan, pointing it at the relevant seed file. It writes the corresponding spec file under `../tests/`.
3. Run the `playwright-test-healer` agent to run the suite and fix any generated test that fails.

## Relationship to `tests/`

| Here (`specs/`) | `../tests/` |
|---|---|
| What to test (prose plan) | The test code itself |
| Written by the planner agent | Written by the generator agent |
| One plan can cover many scenarios | Each scenario becomes its own spec file |

See `playwright-ts/README.md` for how to invoke the agents.
