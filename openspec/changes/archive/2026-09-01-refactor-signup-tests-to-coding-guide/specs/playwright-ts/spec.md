## ADDED Requirements

### Requirement: Reusable modules live outside `tests/`
The `playwright-ts/` scaffold SHALL keep page objects, steps classes, fixtures, and any other reusable (non-spec) module at the workspace home directory — in dedicated folders such as `pages/`, `steps/`, `fixtures/` — separate from `tests/`, which SHALL contain only spec files (and the `tests/<project>/` locations named by the existing directory-layout requirement).

#### Scenario: Adding a new shared module
- **WHEN** a contributor adds a new page object, steps class, fixture, or other module meant to be reused across specs
- **THEN** it is placed under its home-dir folder (e.g. `pages/`, `steps/`, `fixtures/`), not nested inside `tests/`

#### Scenario: Locating an existing shared module
- **WHEN** a contributor looks for a page object, steps class, or fixture that already models part of the app
- **THEN** it is found at the workspace home directory rather than searched for inside `tests/`
