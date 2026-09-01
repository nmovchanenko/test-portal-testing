## Why

`playwright-ts/coding-guide.md` was expanded (Formatting, JSDoc, and the Flow Model steps-layer sections) in `update-playwright-ts-coding-guide`, which explicitly deferred refactoring the existing signup suite as "separate, follow-on work." That suite (`6fb4c89`) was written before the guide's page-object and Flow Model sections existed, so every UI/mocking spec talks to `page.getByRole(...)` directly, and the same "fill the signup form" logic is duplicated three different ways across three spec files (`signupFields` defined verbatim twice; `fillAndSubmitSignup`/`fillValidForm` reinventing the same fill-and-submit flow). This change is that follow-on work.

## What Changes

- Establish the directory convention: reusable modules (page objects, steps, fixtures, and anything else that isn't a spec) live at the `playwright-ts/` home directory (`pages/`, `steps/`, `fixtures/`); `tests/` holds spec files only.
- Introduce `pages/signup.page.ts` — a `SignupPage` page object wrapping the sign-up form's fields, fill/submit actions (each wrapped in `test.step`), and error/loading-state readers, replacing the three duplicated inline helpers.
- Introduce `steps/signup.steps.ts` — a `SignupSteps` class with `completeSignup()`, `attemptSignup()`, and `attemptLogin()` business-level methods, for the specs that span `/signup` → `/login` and sequence more than one business action.
- Introduce `pages/login.page.ts` — a minimal `LoginPage` (password field, submit button) so `attemptLogin()` orchestrates a POM instead of holding raw `/login` locators itself.
- Relocate the existing `tests/api/fixtures/signup.ts` to `fixtures/signup.ts` (it's a shared fixture module, not a spec, so it's already out of place under the convention this change establishes) and repoint its 5 importers.
- Migrate `tests/ui/signup-happy-path.spec.ts` and `tests/ui/signup-duplicate-email.spec.ts` onto `SignupSteps`.
- Migrate `tests/mocking/signup-field-validation.spec.ts` and `tests/mocking/signup-submission-outcomes.spec.ts` onto `SignupPage` directly (single-field / mocked-outcome checks stay at the POM level per the guide's own worked example).
- Delete the now-redundant inline helpers (`signupFields`, `fillAndSubmitSignup`, `fillValidForm`, `expectNoSignupRequest`'s field-reading duplication) from all four spec files.
- Apply the mechanical formatting fixes surfaced during exploration while touching these files: move any remaining spec-local helper below the spec body, rename the bare `requested` boolean to `wasSignupRequested`, replace the inline `import('@playwright/test').Page` type with a top-level import, and add custom `expect` messages where they clarify business intent.
- Remove `tests/api/seed.spec.ts` (a dead stub duplicating `tests/api/.gitkeep`'s role, with a non-descriptive `test.describe('Test group')`).

## Capabilities

### Modified Capabilities
- `playwright-ts`: adds a requirement that reusable modules (page objects, steps, fixtures, and similar) live at the workspace home directory, separate from `tests/`, which holds spec files only. This is a lasting workspace-wide convention established by this change, not specific to signup — captured as a formal requirement so future changes can be verified against it.

`signup-testing`'s scenarios (what is verified, at which layer) are unchanged — this only restructures how the UI/mocking specs reach the app, and where the shared modules that do so live.

## Impact

- New: `playwright-ts/pages/signup.page.ts`, `playwright-ts/pages/login.page.ts`, `playwright-ts/steps/signup.steps.ts`
- Moved: `tests/api/fixtures/signup.ts` → `playwright-ts/fixtures/signup.ts`
- Modified: `tests/ui/signup-happy-path.spec.ts`, `tests/ui/signup-duplicate-email.spec.ts`, `tests/mocking/signup-field-validation.spec.ts`, `tests/mocking/signup-submission-outcomes.spec.ts` (migration), plus `tests/api/signup-success.spec.ts`, `tests/api/signup-validation-errors.spec.ts`, `tests/api/signup-pending-account-login-blocked.spec.ts` (import path only, following the fixture move)
- Removed: `tests/api/seed.spec.ts`
- No behavioral changes to `tests/api/*` specs (request-only; the guide's POM/steps sections don't apply there) or to `coding-guide.md` itself.
