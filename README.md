# TestPortal-testing

A hands-on playground for practicing test automation against [TestPortal](../) across many frameworks, languages, and testing approaches — API, UI, mocking, and component testing. It's also where the team practices spec-driven development itself, using [OpenSpec](./openspec) to plan and track every change.

## Why this repo exists

This repo has two goals:

1. **Hands-on testing practice.** TestPortal supports test executions from a wide range of frameworks (Playwright, Cypress, JUnit, and more, converted to a unified CTRF format). This repo gives the team a place to get hands-on practice with those frameworks and testing approaches directly, using TestPortal itself as the system under test.
2. **Hands-on spec-driven development (SDD) practice.** Every change in this repo — including the scaffolding itself — goes through the [OpenSpec](./openspec) proposal → specs → design → tasks workflow. That makes this repo a low-stakes place to practice writing specs and design docs, not just test code.

Each framework/language combination lives in its own self-contained directory, so trying a new tool never disturbs an existing one.

## Framework directories

| Directory | Framework | Language | Status |
|---|---|---|---|
| [`playwright-ts/`](./playwright-ts) | Playwright | TypeScript | Scaffolded |
| [`cypress-ts/`](./cypress-ts) | Cypress | TypeScript | Scaffolded |

## Conventions

- **Naming**: each framework/language combination gets its own top-level directory named `<framework>-<language>` in kebab-case (e.g. `playwright-ts`, `cypress-ts`, `playwright-java`, `webdriver-io-js`).
- **Self-contained**: a framework directory has its own dependency manifest, its own config, and its own README. It does not depend on shared root-level tooling beyond what's documented here — you should be able to `cd` into it and install/run without needing anything else in the repo.
- **Minimum README content**: every framework directory's README documents which framework/language it uses, how to install dependencies, how to run its tests, and which testing approaches (API, UI, mocking, component, etc.) it currently covers.
- **Coding guides are owned per-directory**: a framework directory's coding guide (e.g. `playwright-ts/coding-guide.md`), if it has one, applies only to that directory. Other framework directories do not inherit or defer to it — each writes its own coding guide if and when it needs one.

## Adding a new framework directory

1. Create a new top-level directory named `<framework>-<language>` (kebab-case).
2. Add its dependency manifest and config (e.g. `package.json`, `pom.xml`) inside that directory only.
3. Add a README covering the minimum content listed above.
4. Keep it self-contained — no shared root-level tooling beyond these conventions.
5. Add a row for it in the table above.

## Scope

This repo currently covers scaffolding and framework setup. TestPortal report upload/integration and CI wiring are out of scope for now and will be introduced in later changes.
