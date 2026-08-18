# Component tests (reserved)

This folder is reserved for component tests but is **not yet wired** to a runnable test command.

Playwright's component-testing runner (`@playwright/experimental-ct-react` for TestPortal-client's React components) is experimental and needs its own `playwright-ct.config.ts` plus a Vite-based dev-server setup, distinct from the `api`/`ui`/`mocking` projects in `playwright.config.ts`. Wiring it now, with no real component to test against, would risk locking in config that has to be redone once a concrete component test exists.

When the first component test is ready to be written:
1. Add `@playwright/experimental-ct-react` (or the equivalent package for the target framework) as a dev dependency.
2. Add a `playwright-ct.config.ts` alongside `playwright.config.ts`.
3. Add a `test:component` script to `package.json`.
4. Replace this README with real test files.
