## 1. Environment & config setup

- [x] 1.1 Add `TESTPORTAL_CLIENT_URL` to `playwright-ts/.env.example` (default `http://localhost:5173`), alongside the existing `TESTPORTAL_BASE_URL`
- [x] 1.2 Update `playwright-ts/playwright.config.ts` so the `ui` and `mocking` projects override `use.baseURL` to `TESTPORTAL_CLIENT_URL`, while `api` keeps `TESTPORTAL_BASE_URL`
- [x] 1.3 Add a shared unique-email helper (e.g. `tests/api/fixtures/signup.ts`) generating distinct `@ventionteams.com` emails per test (timestamp + worker index + random suffix), reusable from `tests/ui`

## 2. API-level tests (tests/api)

- [x] 2.1 Write `signup-success.spec.ts`: valid signup returns `201`, `status: "pending"`, no `passwordHash`/secret field, and a pending-approval `message`
- [x] 2.2 Write `signup-validation-errors.spec.ts` covering, each asserting no user is created: missing `name`/`email`/`password`, invalid email format, non-`ventionteams.com` domain (assert exact `"Registration not allowed"` text), password under 8 characters, duplicate email (assert exact `"An error occurred during registration. Please try again or contact support."` text)
- [x] 2.3 Write `signup-pending-account-login-blocked.spec.ts`: sign up a fresh unique user, then attempt login with the same credentials, assert `403` with pending-approval error text and no access/refresh tokens issued

## 3. Mocked-UI tests (tests/mocking)

- [x] 3.1 Write `signup-field-validation.spec.ts`: invalid name / invalid email / weak password / mismatched confirm-password each show their inline error and make no API request; submit button shows a loading state and is disabled while the mocked response is pending
- [x] 3.2 Write `signup-submission-outcomes.spec.ts`: mocked `201` response navigates to `/login` with a generic success message and the submitted email regardless of the mocked `message` body; mocked `4xx` response (any cause) shows the same generic failure message, stays on `/signup`, and retains entered field values
- [x] 3.3 Target form fields via placeholder-derived accessible name (`getByRole('textbox', { name: '<placeholder text>' })`), not `getByLabel` — `FormField` has no `htmlFor`/`id` association, confirmed during exploration

## 4. E2E tests (tests/ui)

- [x] 4.1 Write `signup-happy-path.spec.ts`: fill and submit a valid, unique signup against the live backend, confirm navigation to `/login` with a success message, then confirm a login attempt with the same credentials is still blocked (account remains pending)
- [x] 4.2 Write `signup-duplicate-email.spec.ts`: sign up once, resubmit the same email, confirm the generic failure message is shown and the page stays on `/signup`

## 5. Verification

- [x] 5.1 Run `npm run test:api`, `npm run test:mocking`, and `npm run test:ui` against the local dev stack (`TestPortal-backend` + `TestPortal-client` running) and confirm all signup tests pass
- [x] 5.2 Confirm suite composition satisfies the pyramid requirement: combined `api` + `mocking` signup test count exceeds the `ui` (E2E) signup test count
- [x] 5.3 Re-run the full suite a second time against the same dev database and confirm no failures from leftover users — duplicate-email and pending-login-block checks must not collide across runs
