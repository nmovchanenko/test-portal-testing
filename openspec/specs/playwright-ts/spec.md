# playwright-ts Specification

## Purpose

Defines the scaffolded Playwright + TypeScript workspace that will host future hands-on API, UI, mocking, and component tests against TestPortal, established as a correctly wired but empty starting point.

## Requirements

### Requirement: Standalone Playwright TypeScript project
The `playwright-ts/` directory SHALL be a self-contained Node.js/TypeScript project with its own `package.json`, `tsconfig.json`, and `playwright.config.ts`, following the conventions defined by `repo-scaffolding`.

#### Scenario: Installing the workspace
- **WHEN** a team member runs the install command inside `playwright-ts/`
- **THEN** all dependencies needed to run Playwright tests are installed without requiring anything from outside that directory

### Requirement: Directory layout anticipates multiple testing approaches
The `playwright-ts/` scaffold SHALL provide separate, clearly named locations for at least API tests, UI tests, mocking-based tests, and component tests, even before any test cases exist in them.

#### Scenario: Locating where a new test type belongs
- **WHEN** a team member wants to add a new test (e.g. an API test)
- **THEN** there is an obvious, pre-existing location for it that is distinct from the locations for UI, mocking, and component tests

### Requirement: Runnable scaffold with zero test cases
The scaffold SHALL be runnable — the Playwright test runner executes successfully against it — even though it contains zero test cases, so the workspace is verified as correctly wired before real tests are added.

#### Scenario: Verifying the empty scaffold
- **WHEN** a team member runs the test command in a freshly scaffolded `playwright-ts/`
- **THEN** the command completes without configuration errors and reports zero tests found

### Requirement: Configurable TestPortal target
The scaffold SHALL define a configuration point (e.g. an environment variable) for the TestPortal base URL/API endpoint that tests will eventually target, without hardcoding a live TestPortal instance into the scaffold.

#### Scenario: Configuring the target environment
- **WHEN** a team member sets the TestPortal target configuration value
- **THEN** the Playwright configuration picks it up without requiring code changes, even though no test yet uses it
