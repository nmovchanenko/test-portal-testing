## Context

See `proposal.md` - Why for motivation. Relevant constraints:
- `repo-scaffolding` (`openspec/specs/repo-scaffolding/spec.md`) already fixes the directory-naming and self-containment conventions this scaffold must follow; `playwright-ts/` is the existing sibling to stay consistent with where the two frameworks overlap (README shape, env-var-configured target) while each remains fully independent per that spec.
- TestPortal-client (`CLAUDE.md`) is a React 19 SPA served by Vite (`yarn dev`, default `http://localhost:5173`). Its `/login` page (`src/pages/Login/index.tsx`) has no `data-testid`s: the email input has placeholder "Enter your email", the password input has placeholder "Enter your password", and the submit button's accessible name is "Sign in". On success it dispatches auth tokens to Redux and navigates to `PATHS.ROOT` (`/`).
- Logging in requires an existing, **approved** user (`useLogin`'s flow rejects pending accounts with a 403). TestPortal-backend has no self-service way to get an approved account beyond the admin bootstrap script (`npm run bootstrap:admin`) or an admin approving a signup — there is no "seed a test user" endpoint this scaffold can call itself.
- This is the second framework directory ever added here (`playwright-ts` was the first, via the archived `init-testing-playground` change) — its design decisions are the closest precedent, referenced below.

## Goals / Non-Goals

**Goals:**
- Pick concrete tooling for `cypress-ts` (package manager, TS config, project layout, base URL config) so scaffolding can be built without further decisions.
- Decide how the one example test gets a valid, approved account to log in with, without baking a live credential into the repo.
- Stay consistent with `playwright-ts`'s precedent (npm, env-var-configured target, strict TS) where nothing about Cypress forces a different choice.

**Non-Goals:**
- Linting/formatting setup (ESLint/Prettier) — deferred, same reasoning as `playwright-ts`.
- Any test beyond the one happy-path login example (validation errors, API-level checks, mocking, component testing) — deferred to a later change if pursued.
- Automating test-user creation/seeding (e.g. a setup script that calls `bootstrap:admin`) — out of scope; the example test consumes credentials for an already-existing approved account.
- CI integration or TestPortal report upload.

## Decisions

### Package manager: npm
Same rationale as `playwright-ts`: no extra global install, consistent with the majority of TestPortal repos (backend, cli).
- Alternative considered: yarn, for consistency with TestPortal-client — rejected for the same reason `playwright-ts` rejected it; this repo has no dependency on the client's tooling.

### Directory layout inside `cypress-ts/`
```
cypress-ts/
├── package.json
├── tsconfig.json
├── cypress.config.ts
├── .env.example
├── .gitignore
├── README.md
└── cypress/
    ├── e2e/
    │   └── login-happy-path.cy.ts
    ├── pages/
    │   └── login.page.ts        # page-object wrapping the login form's locators/actions
    └── support/
        ├── e2e.ts                # Cypress support file (global hooks/imports)
        └── commands.ts           # custom commands (empty/placeholder for now)
```
`cypress/e2e/` and `cypress/pages/` mirror `playwright-ts`'s existing `tests/` + `pages/` split (see `playwright-ts/pages/login.page.ts`) so switching between the two frameworks in this repo feels familiar, without literally sharing code (each stays self-contained per `repo-scaffolding`).
- Alternative considered: put the page object inline in the spec file — rejected; the page-object pattern is already the established convention in `playwright-ts` and is worth demonstrating here too since this scaffold ships a real example.

### TestPortal-client target via environment variable
`cypress.config.ts` reads `CYPRESS_BASE_URL` (Cypress's own convention: any `CYPRESS_`-prefixed env var is auto-exposed as `config.env` and `baseUrl` specifically is settable via `CYPRESS_BASE_URL`) into `e2e.baseUrl`, loaded from a local `.env` via `dotenv`. `.env.example` documents it with a placeholder pointing at local dev (`http://localhost:5173`, TestPortal-client's default Vite port per `CLAUDE.md`).
- Alternative considered: Cypress's built-in `env` config block with a non-`CYPRESS_`-prefixed key — rejected; the `CYPRESS_BASE_URL` convention needs no custom plumbing in `cypress.config.ts` beyond reading `process.env`.

### Login credentials via environment variables, not seeded
The example test reads `CYPRESS_LOGIN_EMAIL` / `CYPRESS_LOGIN_PASSWORD` from the environment (same `CYPRESS_`-prefix convention, surfaced via `Cypress.env(...)` in the spec) rather than a hardcoded fixture value. `.env.example` documents both as placeholders with a comment that the account must already exist and be approved (e.g. created via `bootstrap:admin` or an approved signup) in whatever TestPortal-client instance `CYPRESS_BASE_URL` points at.
- Alternative considered: a Cypress fixture (`cypress/fixtures/user.json`) with a placeholder credential — rejected; env vars keep secrets out of a committed file entirely and match how `playwright-ts` externalizes its own config (`TESTPORTAL_BASE_URL` via `.env`), so the two frameworks stay consistent on "how does a test get environment-specific values."
- Alternative considered: have the test create its own user via signup first, then log in — rejected; signup produces a *pending* account (per `useLogin`'s pending-approval handling), which login cannot use, so this would still need an out-of-band approval step and adds real complexity for zero benefit to a scaffold-verification test.

### TypeScript config: strict mode
`tsconfig.json` sets `"strict": true`, extending Cypress's recommended TS settings — same instructive-default rationale as `playwright-ts`.
- Alternative considered: loose/default TS config — rejected for the same reason `playwright-ts` rejected it.

### Cypress test type: E2E, not component testing
Use Cypress's E2E testing mode (`e2e: {...}` in `cypress.config.ts`) exclusively; Cypress Component Testing is not configured. The one example test is a full-browser UI flow against a running TestPortal-client, which is what E2E mode is for; component testing would need TestPortal-client's Vite config wired in as a dev-server, which is unnecessary for a single login flow test.
- Alternative considered: also reserve a `cypress/component/` folder the way `playwright-ts` reserved `tests/component/` — rejected; that reservation existed because `playwright-ts` anticipated multiple testing approaches as an explicit spec requirement. This change's spec only commits to one E2E example, so an unused placeholder folder would document a decision nobody asked for. A future change can add component testing support if and when it's actually pursued.

### Root README table update
Add a `cypress-ts` row to the existing table in the root `README.md` (framework: Cypress, language: TypeScript, status: Scaffolded), the same mechanical update `init-testing-playground` made for `playwright-ts`.

## Risks / Trade-offs

- **[Risk]** The example test requires a pre-existing approved account and a running TestPortal-client instance; it cannot run standalone out of the box. → **Mitigation**: `.env.example` and the README document the prerequisite explicitly (start TestPortal-client, ensure an approved account exists via `bootstrap:admin`) so this is a documented manual setup step, not a silent failure.
- **[Risk]** Env-var-sourced credentials in `CYPRESS_LOGIN_EMAIL`/`CYPRESS_LOGIN_PASSWORD` could be committed accidentally via a real `.env`. → **Mitigation**: `.gitignore` excludes `.env` (same as `playwright-ts`); only `.env.example` with placeholder values is committed.
- **[Risk]** No CI wiring means the example test's continued correctness (e.g. if TestPortal-client's login markup changes) is only ever caught by someone running it manually. → **Mitigation**: out of scope by proposal, same trade-off `playwright-ts` accepted for its own scaffold verification.

## Migration Plan

Greenfield addition, no rollback beyond deleting the new files:
1. Scaffold `cypress-ts/` per the layout above.
2. Add the root README table row.
3. Start TestPortal-client locally, ensure an approved test account exists, set `.env` from `.env.example`, run `npx cypress run` to confirm the example test passes.
4. Commit as one change.
