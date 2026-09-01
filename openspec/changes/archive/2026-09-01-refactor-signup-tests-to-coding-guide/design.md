## Context

See proposal.md - Why. The signup surface is one form (`/signup`: name, email, password, confirm-password, submit) plus the `/login` page it hands off to. Four specs currently reach it through three different hand-rolled, duplicated helpers, and a fifth shared module (`fixtures/signup.ts`) already exists but sits inside `tests/api/fixtures/`. `playwright.config.ts` scopes each project (`api`/`ui`/`mocking`/`component`) to its own `testDir` for *discovery*, but imports aren't constrained to `testDir` — a spec can import a sibling module from anywhere in the workspace, so relocating shared modules out of `tests/` doesn't affect what Playwright collects as tests.

**Directory convention (user-directed):** reusable modules live at the `playwright-ts/` home directory — `pages/`, `steps/`, `fixtures/` — as siblings of `tests/`, not nested inside it. `tests/` holds spec files only. This applies to the new `SignupPage`/`SignupSteps` modules and retroactively to the existing `fixtures/signup.ts`, which moves from `tests/api/fixtures/signup.ts` to `fixtures/signup.ts`.

## Goals / Non-Goals

**Goals:**
- Establish `playwright-ts/pages/` and `playwright-ts/steps/` as the repo's first instance of the guide's POM/Flow Model layering, sited so future features follow the same layout.
- Bring the existing `fixtures/signup.ts` into that same convention (out of `tests/`) so the rule holds for every non-spec module, not just the two being introduced.
- Collapse the three duplicated fill/submit helpers into one `SignupPage`.
- Give the two cross-page-workflow specs (`signup-happy-path`, `signup-duplicate-email`) a `SignupSteps` layer; keep the two single-page mocked specs on `SignupPage` directly.

**Non-Goals:**
- Generalizing to a `BasePage`/`BaseSteps` abstraction — one feature isn't enough evidence for that shape yet.
- Touching `tests/api/*` — request-only, no POM/steps layer applies.
- Adding `data-testid`s to the client — confirmed during exploration that `TestPortal-client/src/pages/Signup/index.tsx` has none, so `getByRole(..., { name })` is already the guide-correct choice.

## Decisions

**Home-dir placement means `../../` imports from every spec, not `../`.** `tests/ui/*.spec.ts` and `tests/mocking/*.spec.ts` reach `pages/signup.page.ts` and `fixtures/signup.ts` via `../../pages/signup.page` / `../../fixtures/signup`; `tests/api/*.spec.ts` reaches `fixtures/signup.ts` the same way. One directory level deeper than the guide's own generic example (`../pages/some-page`, written for a `steps/` file one level inside a shared root), but consistent once `tests/` is a sibling of `pages/`/`steps/`/`fixtures/` rather than their parent. No tsconfig path alias exists to shorten this (`tsconfig.json` has no `paths` entries) — out of scope to add one here.

**One `fillForm(input)` on `SignupPage`, not four separate `fillName`/`fillEmail`/`fillPassword`/`fillConfirmPassword` methods.** Every current call site fills all four fields in one go — including the field-validation tests, which always fill all four and just vary which one holds an invalid value. No spec needs to fill a subset. `fillForm` wrapped in one `test.step` covers every observed use; per-field methods would be speculative surface with no current caller. `submit()` stays a separate method/step so `signup-field-validation.spec.ts`'s "assert no request fires" pattern (`expectNoSignupRequest(page, () => fields.submit.click())` today) still has a submit action to wrap independently of fill.

**`SignupSteps` gets two signup methods, not one.** `completeSignup(input): Promise<void>` asserts the workflow invariant that the signup response succeeded (throws otherwise, per the guide's `waitForResponse`/`!response.ok()` pattern) and waits for the `/login` navigation — used wherever the test's premise is "a signup happens successfully" (happy-path's first half, duplicate-email's first attempt). `attemptSignup(input): Promise<void>` performs the same fill+submit+wait-for-response sequence but asserts nothing about the outcome — used where the point of the test is what happens on the response the steps layer can't presume (duplicate-email's second, expected-to-fail attempt). This keeps the "no business assertions in steps" anti-pattern intact: `completeSignup`'s throw is a workflow invariant ("this step assumed success in order to proceed"), not a business assertion about signup rules.

**`attemptLogin(password): Promise<void>` similarly asserts nothing about outcome.** The happy-path spec is specifically testing that this login attempt is blocked; that's a business assertion and stays in the spec (`toHaveURL`, `getByText(...)`).

**A minimal `LoginPage` is added alongside `SignupPage`, discovered during implementation rather than planned up front.** `attemptLogin` needs to fill `/login`'s password field and click "Sign in" — without a `LoginPage`, that's raw locators sitting inside `SignupSteps`, which breaks the guide's "steps orchestrate POMs; POMs own UI mechanics" split for the sake of two elements. `LoginPage` stays deliberately minimal: no email field, since the email arrives pre-filled from the signup redirect and no current spec fills it — adding one now would be speculative surface, same reasoning as the `fillForm`-not-four-methods decision above.

**No `expect.poll` convergence helper needed here.** The guide's "converge UI to backend response" pattern exists for derived aggregates (a table total) where the DOM can lag the response by more than one signal. Here, the response is followed by a single navigation or a single error message appearing — both already covered by web-first `expect(...).toHaveURL(...)` / `.toBeVisible()`'s built-in retrying at the spec level. Adding a poll would be unused abstraction.

**Loading-state check stays a `SignupPage` accessor, not a `SignupSteps` concern.** `signup-field-validation.spec.ts`'s "submit button shows loading and is disabled" test is single-element UI-mechanic behavior (per the guide's own dividing line), so it reads a `SignupPage` locator (e.g. a loading-labeled submit button) directly — no steps involved.

## Risks / Trade-offs

- **Two-method split (`completeSignup` / `attemptSignup`) adds a naming decision future contributors must get right.** → Mitigate with JSDoc on each (per the guide's Documentation section) stating the contract: which one throws on a non-2xx response and which doesn't.
- **Introducing a layered pattern for a single feature risks looking over-built for the current suite size.** → The duplication already measured (one helper defined twice verbatim, two more reinventing the same fill flow) is the concrete return on that investment now, not a hypothetical future one; the layout also becomes the template the next feature's tests copy instead of re-deriving.
- **Fixed `60_000` timeout on `waitForResponse`, per the guide's example, could hide a genuinely slow backend in CI as a long hang rather than a fast failure.** → Out of scope to change here; matches the guide's documented pattern as-is.

## Migration Plan

Implemented and reviewed one file at a time rather than as one large diff:
1. Move `tests/api/fixtures/signup.ts` to `fixtures/signup.ts`, repoint its 5 importers, and run the full suite once to confirm the move alone changed nothing behaviorally.
2. Add `SignupPage`, then migrate the two mocking specs onto it (no steps layer involved yet) and run the `mocking` project.
3. Add `SignupSteps` on top of the now-existing `SignupPage`, migrate `signup-happy-path.spec.ts` and `signup-duplicate-email.spec.ts`, and run the `ui` project.
4. Delete the superseded inline helpers and `tests/api/seed.spec.ts`, then run the full suite (`api`, `ui`, `mocking`) once more.

No production/runtime deploy involved — this is test-code-only; rollback is `git revert` if a migrated spec regresses.
