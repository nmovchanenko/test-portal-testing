## 1. Relocate the existing fixtures module

- [x] 1.1 Move `tests/api/fixtures/signup.ts` to `playwright-ts/fixtures/signup.ts` (content unchanged) so it follows the home-dir convention this change establishes.
- [x] 1.2 Repoint its 5 importers: `tests/api/signup-success.spec.ts`, `tests/api/signup-validation-errors.spec.ts`, `tests/api/signup-pending-account-login-blocked.spec.ts` (from `./fixtures/signup` to `../../fixtures/signup`), and `tests/ui/signup-happy-path.spec.ts`, `tests/ui/signup-duplicate-email.spec.ts` (from `../api/fixtures/signup` to `../../fixtures/signup`).
- [x] 1.3 Remove the now-empty `tests/api/fixtures/` directory.
- [x] 1.4 Run the full suite (`api`, `ui`, `mocking` projects) and confirm the move alone changed nothing behaviorally.

## 2. SignupPage

- [x] 2.1 Create `playwright-ts/pages/signup.page.ts` with a `SignupPage` class: constructor takes `Page`; `goto()` navigates to `/signup`; field locators for name/email/password/confirm-password via `getByRole('textbox', { name: ... })` (no `data-testid` exists on the client form — confirmed against `TestPortal-client/src/pages/Signup/index.tsx`).
- [x] 2.2 Add `fillForm(input: { name: string; email: string; password: string; confirmPassword: string })`, wrapped in `test.step`.
- [x] 2.3 Add `submit()`, wrapped in its own `test.step`, kept separate from `fillForm` so a caller can assert "no request fires" around just the click (as `signup-field-validation.spec.ts` does today).
- [x] 2.4 Add a loading-state accessor for the submit button in its "Creating account..." state, for the loading/disabled assertion in `signup-field-validation.spec.ts`.
- [x] 2.5 Add JSDoc per `coding-guide.md`'s Documentation section on `fillForm`/`submit` only if they carry a non-obvious contract; skip boilerplate docs on straightforward wrappers. (None added — `goto`/`fillForm`/`submit` are straightforward wrappers with no non-obvious side effect beyond what `test.step` labels already say.)

## 3. LoginPage

- [x] 3.1 Create `playwright-ts/pages/login.page.ts` with a minimal `LoginPage` class: constructor takes `Page`; password field locator via `getByRole('textbox', { name: 'Enter your password' })`; submit button via `getByRole('button', { name: 'Sign in' })`. No email field — the email arrives pre-filled from the signup redirect and no current spec fills it.
- [x] 3.2 Add `submitPassword(password: string): Promise<void>`, wrapped in `test.step`, filling the password field and clicking submit.

## 4. SignupSteps

- [x] 4.1 Create `playwright-ts/steps/signup.steps.ts` with a `SignupSteps` class: constructor takes `Page`, instantiates `SignupPage` (from `../pages/signup.page`) and `LoginPage` (from `../pages/login.page`) as private fields.
- [x] 4.2 Add `completeSignup(input): Promise<void>` — fills and submits via `SignupPage`, `waitForResponse`-matches `POST /api/v2/auth/signup` by URL + method + the submitted email in the request body (per `coding-guide.md`'s worked example), throws if the response is not ok, and waits for the `/login` navigation to complete.
- [x] 4.3 Add `attemptSignup(input): Promise<void>` — same fill/submit/wait-for-response sequence as `completeSignup`, but asserts nothing about the response outcome; the caller's spec asserts what happens next.
- [x] 4.4 Add `attemptLogin(password: string): Promise<void>` — calls `LoginPage.submitPassword`, `waitForResponse`-matches `POST /api/v2/auth/login`, asserts nothing about the outcome.
- [x] 4.5 Add JSDoc on `completeSignup` and `attemptSignup` stating which one throws on a non-2xx signup response and which doesn't, per design.md's "Risks" note on this being a naming decision future contributors must get right.

## 5. Migrate mocking specs onto SignupPage

- [x] 5.1 Rewrite `tests/mocking/signup-field-validation.spec.ts` to import `SignupPage` from `../../pages/signup.page` in place of the local `signupFields`/`expectNoSignupRequest` duplication; keep the "no request fires" assertion behavior unchanged.
- [x] 5.2 Rewrite `tests/mocking/signup-submission-outcomes.spec.ts` to import `SignupPage` from `../../pages/signup.page` in place of the local `signupFields`/`fillValidForm` duplication.
- [x] 5.3 Run the `mocking` project (`npx playwright test --project=mocking`) and confirm all cases still pass with unchanged assertions.

## 6. Migrate UI specs onto SignupSteps

- [x] 6.1 Rewrite `tests/ui/signup-happy-path.spec.ts` to import `SignupSteps` from `../../steps/signup.steps` and call `steps.completeSignup(...)` then `steps.attemptLogin(...)`, keeping the existing business assertions (`toHaveURL`, pending-approval message) in the spec body.
- [x] 6.2 Rewrite `tests/ui/signup-duplicate-email.spec.ts` to import `SignupSteps` from `../../steps/signup.steps` and call `steps.completeSignup(...)` for the first (expected-to-succeed) attempt and `steps.attemptSignup(...)` for the second (expected-to-fail) attempt, replacing the local `fillAndSubmitSignup` helper.
- [x] 6.3 Run the `ui` project (`npx playwright test --project=ui`) and confirm both specs still pass with unchanged assertions.

## 7. Cleanup and mechanical fixes

- [x] 7.1 Delete the now-unused inline helpers (`signupFields`, `fillAndSubmitSignup`, `fillValidForm`, `expectNoSignupRequest`'s field-reading duplication) from all four migrated spec files.
- [x] 7.2 Delete `tests/api/seed.spec.ts` (redundant with `tests/api/.gitkeep`, non-descriptive `test.describe` name).
- [x] 7.3 In `tests/mocking/signup-field-validation.spec.ts`, rename the bare `requested` boolean to `hasSignupRequest` (guide's boolean-naming rule; `wasSignupRequested` as originally planned here doesn't match any of the guide's four prefixes — caught and corrected during the 8.2 re-read).
- [x] 7.4 Replace the inline `import('@playwright/test').Page` type reference with a top-level `Page` import, matching every other spec file (this lives in `signup-duplicate-email.spec.ts` before its migration in 6.2 — apply as part of that rewrite). (Resolved by elimination — the rewritten spec no longer needs a `Page` type reference at all; `SignupSteps` owns the page internally.)
- [x] 7.5 Add custom `expect` messages where they clarify business intent, per `coding-guide.md`'s Assertions example, in the migrated spec files.
- [x] 7.6 Confirm any remaining spec-local helper in the four migrated files sits below the spec body, per the guide's ordering rule. (Only `expectNoSignupRequest` remains, in `signup-field-validation.spec.ts`, placed below `test.describe`.)

## 8. Full-suite verification

- [x] 8.1 Run the full suite (`api`, `ui`, `mocking` projects) once more after cleanup and confirm no regressions.
- [x] 8.2 Re-read the four migrated spec files against `coding-guide.md` end to end (Formatting, Page objects and components, Specs, Assertions and matchers, Flow Model Pattern) to confirm no other drift was missed. Caught and fixed two things: the boolean rename in 7.3 didn't actually match the guide's `is`/`has`/`should`/`can` prefixes (`wasSignupRequested` → `hasSignupRequest`), and `signup-happy-path.spec.ts` read `/login`'s email field via a raw locator instead of through a page object (added `LoginPage.emailInput`, used it in the spec). Also added one-line class JSDoc to `SignupPage` and `SignupSteps` for consistency with `LoginPage`. Full suite re-run clean after both fixes.
