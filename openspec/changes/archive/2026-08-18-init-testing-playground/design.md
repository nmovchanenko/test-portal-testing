## Context

See `proposal.md` - Why for motivation. Relevant constraints from the wider TestPortal workspace (`CLAUDE.md`):
- TestPortal-backend requires Node.js 18+ and exposes a REST API (default `http://localhost:3001`) plus OpenAPI docs — the natural target for `playwright-ts` API tests.
- TestPortal-client is a React 19 SPA (Vite, Chakra UI) — relevant if/when component tests target its components later.
- This repo (`TestPortal-testing`) is currently empty; nothing here constrains tooling choices yet.

## Goals / Non-Goals

**Goals:**
- Pick concrete, unambiguous tooling for `playwright-ts` (package manager, TS config, project layout) so scaffolding can be built without further decisions.
- Define exactly how `repo-scaffolding`'s conventions get expressed as real files (what the root README contains, what "the process for adding a framework directory" actually is).
- Keep every decision reversible and low-cost, since this is the first of many framework directories and mistakes here shouldn't be expensive to undo.

**Non-Goals:**
- Linting/formatting setup (ESLint/Prettier) for `playwright-ts` — deferred to when real tests exist and style conventions matter.
- Wiring Playwright's experimental component-testing runner (`@playwright/experimental-ct-react` or similar) end-to-end — deferred until the first component test is actually written (see Decisions).
- CI integration, TestPortal report upload, or any framework directory beyond `playwright-ts`.

## Decisions

### Package manager: npm
Use npm for `playwright-ts` (and as the default recommendation for future JS/TS framework directories). TestPortal-backend and TestPortal-cli already use npm; only TestPortal-client uses yarn. npm needs no extra global install and keeps friction low for anyone picking up a new framework directory.
- Alternative considered: yarn, for consistency with TestPortal-client — rejected since this repo has no dependency on the client's tooling and npm is one less thing to install.

### Directory layout inside `playwright-ts/`
```
playwright-ts/
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── .env.example
├── .gitignore
├── README.md
└── tests/
    ├── api/          # Playwright project: "api"
    ├── ui/            # Playwright project: "ui"
    ├── mocking/       # Playwright project: "mocking"
    └── component/     # reserved, not yet a runnable Playwright project (see below)
```
`api`, `ui`, and `mocking` are registered as named Playwright **projects** in `playwright.config.ts` (`testDir` pointing at each folder). This lets someone run `npx playwright test --project=api` in isolation while keeping one shared config, one `package.json`, and one install step.
- Alternative considered: a fully separate `package.json`/config per testing approach (api/ui/mocking as sibling mini-projects) — rejected as overkill for a single framework+language combo; the per-framework directory is already the isolation boundary per `repo-scaffolding`.

### Component testing folder is reserved, not wired
`tests/component/` is created with a placeholder `README.md` explaining that Playwright's component-testing runner is experimental, framework-specific (e.g. `@playwright/experimental-ct-react` for TestPortal-client's React components), and needs its own `playwright-ct.config.ts` plus a Vite-based dev-server setup. Wiring that now, with no real component to test against, risks locking in config that has to be redone anyway once a concrete component test is written.
- Alternative considered: fully configure `@playwright/experimental-ct-react` now — rejected; adds real complexity (separate config, separate command, Vite plugin) for zero present payoff, and the API is still marked experimental upstream.

### TestPortal target via environment variable
`playwright.config.ts` reads `TESTPORTAL_BASE_URL` (via `process.env`, loaded from a local `.env` through `dotenv`) into Playwright's `use.baseURL`. `.env.example` documents the variable with a placeholder pointing at local dev (`http://localhost:3001`, matching TestPortal-backend's default port per `CLAUDE.md`) but ships with no real `.env` committed.
- Alternative considered: hardcode the local dev URL directly in `playwright.config.ts` — rejected; violates the `playwright-ts` spec's requirement that the target be configurable without code changes, and blocks pointing at a staging/deployed TestPortal later.

### TypeScript config: strict mode, ES modules
`tsconfig.json` extends Playwright's recommended settings with `"strict": true`. Catching type errors early matters more for a practice/reference repo (where code doubles as a learning example) than avoiding minor friction.
- Alternative considered: loose/default TS config — rejected; strict mode is the more instructive default for a repo meant to demonstrate good practice.

`playwright-ts/` uses native ES modules rather than CommonJS: `package.json` sets `"type": "module"`, and `tsconfig.json` uses `"module": "NodeNext"` / `"moduleResolution": "NodeNext"`. Playwright Test has supported ESM TypeScript configs since v1.21, so this needs no extra tooling. ESM is the direction the JS/TS ecosystem has settled on, and it's the more instructive default for a repo meant to demonstrate current practice.
- Alternative considered: CommonJS (the initial scaffold's default) — rejected in favor of ESM per explicit direction.

### Root-level conventions live in the root `README.md`
`repo-scaffolding`'s "process for adding a new framework directory" and "minimum README content" requirements are satisfied by a single root `README.md` (not a separate CONTRIBUTING.md) containing: repo purpose, the list of existing framework directories, the naming convention (`<framework>-<language>`, kebab-case), and a short checklist for adding a new one (create directory, add manifest/config, add README with the required sections, keep it self-contained).
- Alternative considered: a dedicated `docs/adding-a-framework.md` — rejected for now; one root README is enough content to stay in a single file, and splitting it out can happen later if it grows.

## Risks / Trade-offs

- **[Risk]** Reserving `tests/component/` without a runnable config means the `playwright-ts` "runnable scaffold, zero tests found" requirement only covers `api`/`ui`/`mocking`, not `component`. → **Mitigation**: the spec's "directory layout anticipates multiple testing approaches" requirement is satisfied by the folder + README existing; the "runnable scaffold" requirement is scoped to the registered Playwright projects, which is documented in this design so it isn't a silent gap.
- **[Risk]** Conventions documented only in a README (not enforced by tooling) can drift as more framework directories are added by different people. → **Mitigation**: accepted for this change since there's only one framework directory to date; a future change can add a lint/CI check once there's a second directory to validate against.
- **[Risk]** No CI wiring means the "runnable, zero tests found" scaffold check is only ever run manually. → **Mitigation**: out of scope by proposal; acceptable since this change's own verification (running the test command once during implementation) confirms it works at scaffold time.

## Migration Plan

Greenfield addition, no rollback beyond deleting the new files:
1. Add root `README.md` covering `repo-scaffolding`'s requirements.
2. Scaffold `playwright-ts/` per the layout above; run `npm install` then `npx playwright test` to confirm "zero tests found" with no config errors.
3. Commit both together as the initial scaffold.
