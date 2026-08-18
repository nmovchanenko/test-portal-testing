## 1. Root-level scaffolding (repo-scaffolding)

- [x] 1.1 Write root `README.md`: repo purpose (hands-on practice with testing frameworks/approaches against TestPortal), naming convention (`<framework>-<language>`, kebab-case), and the list of existing framework directories (currently `playwright-ts`)
- [x] 1.2 Add the "adding a new framework directory" checklist to root `README.md`: create the directory, add its dependency manifest/config, add its README with the required sections, keep it self-contained (no shared root-level tooling beyond documented conventions)
- [x] 1.3 Add a root `.gitignore` covering common per-framework build/dependency artifacts (e.g. `node_modules/`, `dist/`, `playwright-report/`, `test-results/`)

## 2. `playwright-ts/` project setup

- [x] 2.1 Create `playwright-ts/` directory and initialize `package.json` (npm)
- [x] 2.2 Add `@playwright/test` and `typescript` as dependencies; add npm scripts for running tests (e.g. `test`, `test:api`, `test:ui`, `test:mocking`)
- [x] 2.3 Add `tsconfig.json` with `"strict": true`, extending Playwright's recommended TS settings
- [x] 2.4 Add `.gitignore` for `playwright-ts/` (`node_modules/`, `playwright-report/`, `test-results/`, `.env`)

## 3. Test directory layout and Playwright config

- [x] 3.1 Create `tests/api/`, `tests/ui/`, `tests/mocking/`, `tests/component/` directories (empty except for `.gitkeep` or a placeholder file where needed)
- [x] 3.2 Write `playwright.config.ts` registering three named projects (`api`, `ui`, `mocking`) with `testDir` pointing at their respective folders
- [x] 3.3 Add `tests/component/README.md` documenting that component testing is reserved and not yet wired (Playwright's experimental component-testing runner needs its own config, deferred until a real component test is written)

## 4. TestPortal target configuration

- [x] 4.1 Add `dotenv` dependency and load it at the top of `playwright.config.ts`
- [x] 4.2 Wire `TESTPORTAL_BASE_URL` from `process.env` into Playwright's `use.baseURL`
- [x] 4.3 Add `.env.example` documenting `TESTPORTAL_BASE_URL` with a local-dev placeholder (`http://localhost:3001`)

## 5. `playwright-ts/` README

- [x] 5.1 Write `playwright-ts/README.md` covering: framework/language used, install instructions, how to run tests (including per-project commands), and which testing approaches it currently covers (api, ui, mocking scaffolded and runnable; component reserved)

## 6. Verification

- [x] 6.1 Run `npm install` inside `playwright-ts/` and confirm it completes with no errors
- [x] 6.2 Run `npx playwright test` inside `playwright-ts/` and confirm it completes with no configuration errors and reports zero tests found
- [x] 6.3 Confirm `.env.example` is present and no real `.env` is committed
- [x] 6.4 Re-read root and `playwright-ts/` READMEs against the `repo-scaffolding` and `playwright-ts` spec requirements to confirm every scenario is covered
