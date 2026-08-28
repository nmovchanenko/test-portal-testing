## Why

`playwright-ts/coding-guide.md` was written and wired in before any real specs existed against it, and now that existing signup specs are due for a guide-following refactor, a comparable guide from another project (`coding-guide-2.md`) surfaced several proven, portable additions — a Formatting section, a JSDoc/TSDoc policy, a refined `getByTestId` locator priority, and a Flow Model (spec → steps → POM) pattern for orchestrating multi-page workflows. Merging these into the guide now, before the refactor, means the refactor happens against the guide's intended final shape instead of needing a second pass once the guide catches up.

## What Changes

- Add a **Formatting** section: always brace `if`/`else`/loop bodies (no single-statement shortcuts), separate logical blocks within a method body with a blank line, and prefix boolean variables/fields with `is`/`has`/`should`/`can`.
- Add a **Documentation (JSDoc/TSDoc)** section: when to document (public surface, non-obvious side effects, thrown errors, non-obvious return contracts) vs. skip (trivial getters, pure delegates, side-effect-free constructors), which tags to use, and style (declarative summary line, no redundant type annotations).
- Add a **Flow Model Pattern** section establishing a three-layer architecture — spec (business intent, asserts) → steps (business actions, orchestrates page objects, `test.step`-wrapped) → page object (UI mechanics only) — for genuine cross-page or multi-step business workflows, plus its common patterns (wait for backend response instead of time, converge UI to backend response, return component objects not raw locators) and anti-patterns (no orchestration/`waitForResponse` in POMs, no business assertions in steps, no `waitForTimeout`, no UI-mechanic vocabulary in step names). Make explicit that this layer is for genuine multi-step/cross-page business workflows, not a mandatory layer for every spec — a spec probing single-field, UI-mechanic-level behavior (e.g. one invalid field, one inline error) talks to the page object directly.
- Refine the existing `getByTestId` guidance in **Page objects and components**: prefer a stable parent `data-testid`, chained down with `.locator(...)`, over a long user-facing string (placeholder copy, button labels) that product/design copy changes can break, whenever such a test id exists — rather than treating `getByTestId` as strictly last-resort.
- Generalize the existing **Assertions and matchers** guidance with a repo-agnostic principle: mirror the nearest neighboring spec file's import and alias conventions for any shared matcher/assertion utilities, once such utilities exist in this repo.
- No changes to the **Specs** section — it already matches the reference guide.

## Capabilities

This change edits `playwright-ts/coding-guide.md` content only. It does not change any `playwright-ts` spec requirement — the existing requirements only govern the guide's existence and wiring (auto-loaded via `CLAUDE.md`, referenced from `README.md`), both of which are unaffected. No capability, new or modified; `skip_specs: true` is set in `.openspec.yaml`.

## Impact

- `playwright-ts/coding-guide.md` — the sections and refinement described above.
- No test code changes in this change. Refactoring the existing `tests/` specs (and any new `pages/`/`steps/` modules) to follow the updated guide is separate, follow-on work.
