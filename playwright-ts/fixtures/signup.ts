/**
 * Shared signup test data helpers.
 *
 * TestPortal-backend restricts self-signup to `@ventionteams.com` email
 * addresses (see root CLAUDE.md — "no self-signup for arbitrary emails").
 * Tests that create real users (API-level and E2E-level) must use a fresh,
 * unique email per attempt so repeated/parallel suite runs don't collide on
 * the duplicate-email check or the pending-account login-block check.
 */

const EMAIL_DOMAIN = 'ventionteams.com';

/**
 * Generates a unique `@ventionteams.com` email address, combining a
 * timestamp, the current worker index, and a random suffix so concurrent
 * and repeated runs never produce the same address.
 *
 * @param label short, filename-safe tag identifying the calling test
 *   (e.g. `'signup-success'`), included in the local part for readability
 *   when inspecting the dev database.
 */
export function uniqueSignupEmail(label = 'qa'): string {
  const workerIndex = process.env.TEST_PARALLEL_INDEX ?? '0';
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${label}.w${workerIndex}.${timestamp}.${randomSuffix}@${EMAIL_DOMAIN}`;
}

/** A password satisfying the signup complexity rules (>= 8 chars, lower, upper, numeric). */
export const VALID_SIGNUP_PASSWORD = 'Passw0rd123';

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

/**
 * Builds a valid signup payload with a fresh unique email, allowing any
 * field to be overridden for negative-path tests.
 */
export function buildSignupPayload(overrides: Partial<SignupPayload> = {}): SignupPayload {
  return {
    name: 'QA Test User',
    email: uniqueSignupEmail(),
    password: VALID_SIGNUP_PASSWORD,
    ...overrides,
  };
}
