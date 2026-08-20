## Purpose

Defines the automated test coverage the `playwright-ts` suite SHALL provide for the sign-up feature, distributed across API, mocked-UI, and E2E levels so regressions in the client-side or server-side sign-up rules — and in the account lifecycle signup feeds into — are caught at the cheapest, fastest layer possible.

## ADDED Requirements

### Requirement: API-level signup field and business-rule validation
The `playwright-ts` API suite SHALL verify `POST /api/v2/auth/signup`'s validation rules directly against a running TestPortal-backend, independent of any UI, including asserting the distinct error text returned per rejection cause.

#### Scenario: Missing required field is rejected
- **WHEN** a request is sent missing `name`, `email`, or `password`
- **THEN** the response is a `4xx` error and no user is created

#### Scenario: Invalid email format is rejected
- **WHEN** a request is sent with a syntactically invalid email address
- **THEN** the response is a `4xx` error and no user is created

#### Scenario: Non-organization email domain is rejected
- **WHEN** a request is sent with a validly formatted email whose domain is not `ventionteams.com`
- **THEN** the response is `400` with error text `"Registration not allowed"`, and no user is created

#### Scenario: Weak password is rejected
- **WHEN** a request is sent with a password shorter than 8 characters
- **THEN** the response is a `4xx` error and no user is created

#### Scenario: Duplicate email is rejected
- **WHEN** a request is sent with an email that already belongs to an existing user
- **THEN** the response is `400` with error text `"An error occurred during registration. Please try again or contact support."`, and no second user is created

### Requirement: API-level successful signup response
The `playwright-ts` API suite SHALL verify that a valid signup request creates a pending account and returns a response that discloses no secrets.

#### Scenario: Valid signup succeeds with a pending account
- **WHEN** a request is sent with a unique `@ventionteams.com` email, a name of at least 2 characters, and a password satisfying the complexity rules (length ≥ 8, lower, upper, numeric)
- **THEN** the response is `201 Created` with a body containing the created user (`status: "pending"`, no `passwordHash` or other secret field) and a `message` field explaining that the account is pending administrator approval

### Requirement: Pending account cannot authenticate until approved
The `playwright-ts` API suite SHALL verify that an account created via sign-up is not usable for login until an administrator approves it, since signup alone does not activate the account.

#### Scenario: Login immediately after signup is blocked
- **WHEN** a login request is sent with the email/password of an account that was just created via sign-up and has not been approved
- **THEN** the response is `403 Forbidden` with error text indicating the account is pending administrator approval, and no access/refresh tokens are issued

### Requirement: Mocked UI field-level validation
The `playwright-ts` mocking suite SHALL verify the Signup page's client-side form validation by rendering the page against a mocked/stubbed signup API, without depending on a live backend.

#### Scenario: Inline validation errors on invalid input
- **WHEN** a user blurs or submits the sign-up form with an invalid name, email, password, or mismatched confirm-password value
- **THEN** the corresponding field shows its validation error message and no API request is made

#### Scenario: Submit button reflects loading state
- **WHEN** a user submits a valid sign-up form and the mocked API response is pending
- **THEN** the submit button shows a loading state and is disabled, preventing duplicate submissions

### Requirement: Mocked UI submission outcome states
The `playwright-ts` mocking suite SHALL verify the two outcome states the Signup page renders after a submission resolves against the mocked API — a generic outcome message in both cases, since the page does not surface the backend's specific `message`/`error` text.

#### Scenario: Successful signup navigates to login with a generic confirmation
- **WHEN** the mocked signup API responds with `201` to a valid form submission
- **THEN** the page navigates to the login route carrying a generic success confirmation and the submitted email, regardless of the mocked response's own `message` content

#### Scenario: Failed signup shows a generic error and retains input
- **WHEN** the mocked signup API responds with a `4xx` error to a form submission, for any rejection cause
- **THEN** the form displays the same generic user-facing error message, the user remains on the sign-up page, and their entered field values are retained

### Requirement: End-to-end signup flow coverage
The `playwright-ts` UI (E2E) suite SHALL verify the sign-up flow works end-to-end against a real, running TestPortal-backend and TestPortal-client, limited to representative happy-path and failure-path scenarios per the testing pyramid.

#### Scenario: End-to-end happy path yields a pending, not-yet-usable account
- **WHEN** a user fills in the sign-up form with valid, unique data and submits it against a live backend
- **THEN** the browser navigates to the login page with a success confirmation visible, and a subsequent login attempt with the same credentials is blocked because the account is still pending approval

#### Scenario: End-to-end representative failure path
- **WHEN** a user submits the sign-up form against a live backend with data the server rejects (e.g. an email already registered)
- **THEN** the UI shows the generic sign-up error and the user remains on the sign-up page

### Requirement: Pyramid-shaped test distribution
The signup test suite SHALL contain more API-level and mocked-UI-level tests than end-to-end tests, so that most sign-up business-rule coverage runs fast and without a full live stack.

#### Scenario: Reviewing suite composition
- **WHEN** the number of tests in `playwright-ts/tests/api`, `playwright-ts/tests/mocking`, and `playwright-ts/tests/ui` (signup-related) are compared
- **THEN** the combined count of API and mocked-UI signup tests exceeds the count of E2E signup tests

### Requirement: Isolated, non-colliding signup test data
Signup tests that create real users (API-level and E2E-level) SHALL use dynamically generated, unique `@ventionteams.com` email addresses so that repeated or parallel test runs do not collide on the duplicate-email check or on the pending-account login-block check.

#### Scenario: Repeated suite runs do not collide
- **WHEN** the signup test suite is run multiple times against the same backend/database
- **THEN** each run's signup attempts use distinct email addresses and none fail due to a leftover user from a previous run
