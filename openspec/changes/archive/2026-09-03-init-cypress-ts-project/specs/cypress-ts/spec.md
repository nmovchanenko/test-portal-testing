## Purpose

Defines the scaffolded Cypress + TypeScript workspace that hosts future UI tests against TestPortal-client, established as a correctly wired starting point verified by one runnable example test.

## ADDED Requirements

### Requirement: Standalone Cypress TypeScript project
The `cypress-ts/` directory SHALL be a self-contained Node.js/TypeScript project with its own `package.json`, `tsconfig.json`, and `cypress.config.ts`, following the conventions defined by `repo-scaffolding`.

#### Scenario: Installing the workspace
- **WHEN** a team member runs the install command inside `cypress-ts/`
- **THEN** all dependencies needed to run Cypress tests are installed without requiring anything from outside that directory

### Requirement: Configurable TestPortal-client target
The scaffold SHALL define a configuration point (e.g. an environment variable) for the TestPortal-client base URL that tests target, without hardcoding a live TestPortal-client instance into the scaffold.

#### Scenario: Configuring the target environment
- **WHEN** a team member sets the TestPortal-client target configuration value
- **THEN** the Cypress configuration picks it up without requiring code changes

### Requirement: Example happy-path login test
The scaffold SHALL include one runnable E2E test that exercises the happy-path UI login flow against TestPortal-client, so the scaffold is verified end-to-end and contributors have a concrete pattern to follow.

#### Scenario: Running the example test
- **WHEN** a team member runs the test command against a running TestPortal-client with a valid, approved user account configured
- **THEN** the example test visits the login page, submits valid credentials, and asserts the user lands on the authenticated app

### Requirement: `cypress-ts/` README
The `cypress-ts/` directory SHALL include a README documenting which framework and language it uses, how to install dependencies, how to run its tests, and which testing approaches it currently covers.

#### Scenario: Onboarding to `cypress-ts/`
- **WHEN** a team member opens `cypress-ts/` for the first time
- **THEN** its README explains how to set up and run its tests, and states that UI testing (via the login example) is the only approach currently covered
