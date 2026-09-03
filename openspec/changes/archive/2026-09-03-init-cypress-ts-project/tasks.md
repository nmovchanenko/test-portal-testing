## 1. `cypress-ts/` project setup

- [x] 1.1 Create `cypress-ts/` directory and initialize `package.json` (npm)
- [x] 1.2 Add `cypress`, `typescript`, and `dotenv` as dependencies; add npm scripts for running tests (e.g. `cy:open`, `test`/`cy:run`)
- [x] 1.3 Add `tsconfig.json` with `"strict": true`, extending Cypress's recommended TS settings
- [x] 1.4 Add `.gitignore` for `cypress-ts/` (`node_modules/`, `cypress/videos/`, `cypress/screenshots/`, `.env`)

## 2. Cypress configuration and target

- [x] 2.1 Write `cypress.config.ts` with `e2e` config, loading `dotenv` and reading `CYPRESS_BASE_URL` into `baseUrl`
- [x] 2.2 Add `.env.example` documenting `CYPRESS_BASE_URL` (local-dev placeholder `http://localhost:5173`), `CYPRESS_LOGIN_EMAIL`, and `CYPRESS_LOGIN_PASSWORD`, with a comment that the account must already exist and be approved
- [x] 2.3 Create `cypress/support/e2e.ts` and `cypress/support/commands.ts` (placeholder, no custom commands yet)

## 3. Login page object and example test

- [x] 3.1 Create `cypress/pages/login.page.ts`: a page object wrapping the login form's email input (placeholder "Enter your email"), password input (placeholder "Enter your password"), and submit button (accessible name "Sign in")
- [x] 3.2 Create `cypress/e2e/login-happy-path.cy.ts`: visits `/login`, fills in `Cypress.env('LOGIN_EMAIL')` / `Cypress.env('LOGIN_PASSWORD')` via the page object, submits, and asserts the app navigates away from `/login` (lands on the authenticated app root)

## 4. `cypress-ts/` README

- [x] 4.1 Write `cypress-ts/README.md` covering: framework/language used, install instructions, how to run tests, the local prerequisites for the login example (running TestPortal-client, an approved account, `.env` set from `.env.example`), and which testing approaches it currently covers (UI only, via the login example)

## 5. Root README update

- [x] 5.1 Add a `cypress-ts` row (Cypress, TypeScript, Scaffolded) to the framework directory table in the root `README.md`

## 6. Verification

- [x] 6.1 Run `npm install` inside `cypress-ts/` and confirm it completes with no errors
- [x] 6.2 Start TestPortal-client locally, ensure an approved test account exists, copy `.env.example` to `.env` and fill in real local values
- [x] 6.3 Run the test command (e.g. `npx cypress run`) inside `cypress-ts/` and confirm the login happy-path test passes
- [x] 6.4 Confirm `.env.example` is present and no real `.env` is committed
- [x] 6.5 Re-read `cypress-ts/README.md` and the root README against the `cypress-ts` and `repo-scaffolding` spec requirements to confirm every scenario is covered
