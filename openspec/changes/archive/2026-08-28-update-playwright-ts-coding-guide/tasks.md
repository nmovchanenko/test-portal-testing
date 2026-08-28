## 1. Formatting section

- [x] 1.1 Add a new "Formatting" section to `coding-guide.md` (placed before "Page objects and components", matching `coding-guide-2.md`'s ordering): brace all `if`/`else`/`else if`/loop bodies, separate logical blocks within a method body with a blank line, prefix boolean variables/fields with `is`/`has`/`should`/`can`.
- [x] 1.2 Include the before/after example contrasting brace-omission and bare boolean names against the corrected form.

## 2. Page objects and components — getByTestId refinement

- [x] 2.1 Extend the existing `getByTestId` bullet in "Page objects and components" with the priority refinement: prefer a stable parent `data-testid`, chained down with `.locator(...)`, over a long copy-derived string (placeholder text, button labels) whenever such a test id exists.
- [x] 2.2 Include the fragile-placeholder-vs-stable-testid example pair.

## 3. Assertions and matchers — generalized principle

- [x] 3.1 Add a bullet generalizing the matcher/alias convention: mirror the nearest neighboring spec file's import and alias conventions for any shared matcher/assertion utilities, once such utilities exist in this repo. Do not include `coding-guide-2.md`'s `@fixtures/helpers/matchers.collection` example — no equivalent alias or custom matcher collection exists here.

## 4. Documentation (JSDoc/TSDoc) section

- [x] 4.1 Add the new "Documentation (JSDoc / TSDoc)" section: when to document vs. skip, the tag list, and the style rules (declarative summary line, no redundant type annotations, length proportionate to surface).
- [x] 4.2 Include the worked JSDoc example (a documented async method showing `@returns`/`@throws` usage).

## 5. Flow Model Pattern section

- [x] 5.1 Add the "Flow Model Pattern (steps layer)" section: the layer-responsibilities table (spec / steps / POM), the step-class shape example, and the rules list (constructor takes `Page`, one public method per workflow wrapped in `test.step`, methods speak the domain, stateless).
- [x] 5.2 Include the "Common patterns" subsection (wait for backend not time, converge UI to backend response, return component objects not raw locators) and the "Anti-patterns" list.
- [x] 5.3 Add the explicit scope-boundary note this workspace's version needs (absent from `coding-guide-2.md`, per design.md's Flow Model decision): this layer applies to genuine cross-page/multi-step business workflows, not every spec — anchor it with this workspace's own worked split (a cross-page scenario like signup-then-login goes through steps; a single-field, UI-mechanic-level check talks to the page object directly), using the pattern's own business-words-vs-UI-words test to justify the split.

## 6. Verification

- [x] 6.1 Re-read the complete updated `coding-guide.md` top to bottom: confirm section order, heading levels, and internal consistency (no section contradicts another, e.g. the Flow Model scope note doesn't conflict with "Specs" section's existing guidance).
- [x] 6.2 Confirm nothing repo-specific or inapplicable from `coding-guide-2.md` survived the merge (the `@fixtures` matcher alias, any other iQuality-specific naming/paths).
- [x] 6.3 Confirm `playwright-ts/CLAUDE.md` and `playwright-ts/README.md` still accurately describe the guide (no wording there assumes the pre-merge, three-section version) — update only if they've gone stale.
