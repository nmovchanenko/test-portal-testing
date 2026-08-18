## Why

TestPortal-testing needs a starting structure and a shared philosophy before any test code is written. This repo serves two hands-on practice goals: the team exercises different testing frameworks, languages, and approaches (API, UI, mocking, component testing) while generating real reports against the TestPortal product itself, and the team practices spec-driven development (SDD) itself by running every change here through the OpenSpec proposal → specs → design → tasks workflow. Without an agreed layout up front, each framework/language combo added later risks inventing its own conventions, making the repo harder to navigate and reports harder to compare across frameworks. This change establishes that structure now, starting with a Playwright + TypeScript workspace.

## What Changes

- Establish the repo-wide philosophy: one top-level directory per framework + language combination (e.g. `playwright-ts/`, `cypress-ts/`, `playwright-java/`, `webdriver-io-js/`), each self-contained with its own dependencies, config, and README.
- Define the shared conventions every framework directory follows (naming, minimum README content, how a new framework directory is added later) so future additions stay consistent without re-litigating structure each time.
- Scaffold the first framework directory, `playwright-ts/`: project setup (`package.json`, `playwright.config.ts`, `tsconfig.json`) and a directory layout that anticipates multiple testing approaches (API, UI, mocking, component testing) as separate suites/folders.
- Scope note: this change is scaffolding only — no test cases, no TestPortal report upload/integration. Those follow in later changes once the structure is in place.

## Capabilities

### New Capabilities
- `repo-scaffolding`: Root-level philosophy and conventions for organizing this multi-framework/multi-language testing playground — one directory per framework+language, shared conventions each directory must follow, and the process for introducing a new framework directory.
- `playwright-ts`: The Playwright + TypeScript workspace scaffold — project setup and a directory layout that separates testing approaches (API, UI, mocking, component), without yet containing test cases.

### Modified Capabilities
<!-- none: this is a greenfield repo, no existing specs to modify -->

## Impact

- Affected paths: repo root (new top-level convention/README), new `playwright-ts/` directory and its config files.
- No existing code, APIs, or systems are touched — this is a new, currently-empty repository.
- Dependencies introduced: Playwright + TypeScript tooling inside `playwright-ts/` (exact packages decided in design.md).
- Out of scope for this change: reporting/TestPortal upload integration, actual test implementations, CI wiring, and any other framework directories (`cypress-ts/`, `playwright-java/`, `webdriver-io-js/`, etc.) beyond `playwright-ts/`.
