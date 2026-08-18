## MODIFIED Requirements

### Requirement: Runnable scaffold with zero test cases
The scaffold SHALL be runnable — the Playwright test runner executes successfully against every project — even where a project contains zero test cases, so the workspace is verified as correctly wired independent of how many real tests exist yet.

#### Scenario: Verifying the empty scaffold
- **WHEN** a team member runs the test command for a project with no test files (`ui` or `mocking`)
- **THEN** the command completes without configuration errors and reports zero tests found

#### Scenario: Verifying the api project's seed test
- **WHEN** a team member runs the test command for the `api` project
- **THEN** the command completes without configuration errors and its seed test passes, since the seed establishes shared starting state rather than asserting product behavior
