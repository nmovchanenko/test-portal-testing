## Context

`coding-guide.md` currently has three sections — Page objects and components, Specs, Assertions and matchers — written before any page objects, steps classes, or component objects existed in this workspace; every current spec under `tests/` inlines raw locators directly. `coding-guide-2.md` is a comparable guide pulled from another project, largely identical in its Page objects/Specs/Assertions sections but with additional sections this workspace's guide lacks. See proposal.md - Why for why this merge happens before the tests/ refactor rather than after.

## Goals / Non-Goals

**Goals:**
- Fold the portable sections and refinements from `coding-guide-2.md` into `coding-guide.md`.
- Give the Flow Model Pattern an explicit scope boundary so it doesn't get misapplied as a mandatory layer for every spec once the refactor starts.

**Non-Goals:**
- Refactoring `tests/` to follow the updated guide — separate, follow-on work.
- Adding `data-testid` attributes to TestPortal-client, or verifying whether any already exist — the `getByTestId` priority refinement is adopted on its stated merits, without that check (explicit user decision).
- Carrying over `coding-guide-2.md`'s repo-specific matcher-alias example (`@fixtures/helpers/matchers.collection`) — this workspace has no such alias or custom matcher collection today.

## Decisions

**Adopt Formatting and Documentation (JSDoc/TSDoc) sections wholesale.**
Both are framework-agnostic TS style, not coupled to `coding-guide-2.md`'s originating project. Formatting's boolean-naming rule already has a live target in this repo (`let requested = false;` in `tests/mocking/signup-field-validation.spec.ts`), so it isn't speculative. Documentation's timing works out cleanly: it lands before the refactor introduces the first page-object/steps files, i.e. before there's any public surface in this workspace that would need it — so there's no retroactive-doc debt created by adopting it now.
- Alternative considered: defer Documentation until the first page object exists. Rejected — the whole point of merging the guide before the refactor is to hand the refactor a finished guide, not one that grows mid-refactor.

**Adopt the Flow Model Pattern, scoped to genuine cross-page/multi-step business workflows — not every spec.**
The pattern's own test for the boundary ("business words → step, UI words → POM method") already discriminates cleanly across this workspace's existing specs: `signup-happy-path` (signup → redirect → attempt login) is a genuine cross-page workflow with nowhere principled to live short of a steps class; the `mocking/*` specs (fill one field with an interesting value, assert one inline error or one absent request) are deliberately UI-mechanic-level and would have their intent obscured by forcing them through business vocabulary.
- Alternative considered: mandate Steps for every UI/mocking spec, for architectural uniformity. Rejected — disproportionate for single-field checks, and the pattern's own anti-pattern list ("UI mechanics in step method names ✗") argues against forcing mechanic-level tests into it.
- Alternative considered: omit the Flow Model section entirely, leave cross-page orchestration ad hoc. Rejected — `signup-happy-path` already needs it today, and reaching for a shared `AuthFields` sub-object (composing Signup/Login field locators) instead would have solved the wrong problem: the two pages don't share structure so much as one workflow needs to sequence both.

**Adopt the `getByTestId` priority refinement without verifying TestPortal-client's markup.**
User's explicit call. The refinement only changes locator *preference* when a stable test id exists; it doesn't deprecate `getByRole`/`getByLabel`/etc., so no currently-passing spec becomes non-compliant if the client turns out to have no test ids at all.
- Alternative considered: check the client's signup-form markup first, then decide. Rejected per explicit user instruction — deferred as a risk instead (see below).

**Generalize, don't copy, the matcher-alias bullet.**
`coding-guide-2.md`'s literal example (`@fixtures/helpers/matchers.collection`) names a path alias and a custom matcher collection that don't exist in this workspace. Copying it verbatim would document infrastructure that isn't there. The underlying principle — mirror the nearest neighboring file's import/alias conventions once shared matcher utilities exist — carries over without the dead example.
- Alternative considered: omit the bullet entirely until such utilities exist. Rejected — cheap to state now as a forward-looking convention, and avoids the guide needing a second edit the moment the first shared matcher helper is added.

## Risks / Trade-offs

- [Risk] The `getByTestId` priority may be unenforceable today if TestPortal-client's signup form has no `data-testid` attributes at all → [Mitigation] The refinement is stated as a preference conditional on a stable id existing; existing role/label/placeholder-based locators remain valid guide-compliant fallback, so no current spec is retroactively non-compliant.
- [Risk] Flow Model's spec/POM boundary is a per-spec judgment call, not a mechanical rule, so the coming refactor could apply it inconsistently across files → [Mitigation] The guide states the concrete business-words-vs-UI-words test and anchors it with the worked split already reasoned through here (happy-path → steps, `mocking/*` → POM directly), giving the refactor a precedent to match rather than a rule to interpret from scratch.
- [Risk] Five sections change or land in one guide edit → [Mitigation] None of them are speculative: each is either already proven in a shipped project (`coding-guide-2.md`) or answers a concrete gap already found in this workspace's existing specs (duplicated `signupFields` helpers, the bare `requested` boolean, the two-page `signup-happy-path` workflow with no principled home).
