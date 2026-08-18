# repo-scaffolding Specification

## Purpose

Defines the organizational philosophy for this multi-framework, multi-language testing playground so that every framework or language added over time follows the same predictable structure and stays self-contained and discoverable.

## Requirements

### Requirement: One directory per framework+language combination
The repo SHALL organize test code by framework+language combination, with each combination living in its own top-level directory named `<framework>-<language>` in kebab-case (e.g. `playwright-ts`, `cypress-ts`, `playwright-java`, `webdriver-io-js`).

#### Scenario: Adding a new framework/language combination
- **WHEN** a new framework or language is introduced (e.g. Cypress with TypeScript)
- **THEN** it is placed in its own top-level directory (e.g. `cypress-ts/`) and does not share test code or config with any other framework directory

### Requirement: Self-contained framework directories
Each framework directory SHALL be self-contained: its own dependency manifest, its own config, and its own README, without requiring shared root-level tooling beyond the documented repo-wide conventions.

#### Scenario: Working inside a single framework directory
- **WHEN** a team member wants to run tests for one framework
- **THEN** they can operate entirely from within that framework's directory (install and run) without needing files outside it, aside from documented shared conventions

### Requirement: Minimum README content per framework directory
Each framework directory SHALL include a README documenting: which framework and language it uses, how to install dependencies, how to run its tests, and which testing approaches (e.g. API, UI, mocking, component) it currently covers.

#### Scenario: Onboarding to a new framework directory
- **WHEN** a team member opens a framework directory for the first time
- **THEN** its README explains how to set up and run its tests without needing to consult docs outside that directory

### Requirement: Root-level philosophy documentation
The repo root SHALL document the overall philosophy — why the repo exists, how framework directories relate to each other, and the process for adding a new one — in a root-level README.

#### Scenario: Understanding repo intent
- **WHEN** someone new clones the repo
- **THEN** the root README explains the repo's purpose (hands-on practice with different testing frameworks and approaches against TestPortal) and lists the existing framework directories

### Requirement: Documented process for adding a new framework directory
The repo SHALL define a documented, repeatable process for introducing a new framework+language directory that keeps it consistent with existing ones: naming convention, required README sections, and no cross-directory dependencies.

#### Scenario: Team member adds a new framework directory
- **WHEN** a team member wants to add a new framework directory (e.g. `playwright-java/`)
- **THEN** following the documented process produces a directory matching the established naming convention and README requirements
