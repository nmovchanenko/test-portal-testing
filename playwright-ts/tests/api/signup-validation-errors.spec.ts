import { test, expect } from '@playwright/test';
import { buildSignupPayload, uniqueSignupEmail, VALID_SIGNUP_PASSWORD } from '../../fixtures/signup';

/**
 * All cases here are rejected before the signup service persists anything
 * (validation runs — missing fields, then name, then password length, then
 * email format, then domain — strictly before the DB write), so a rejected
 * response (non-201, no `user` in the body) is itself the evidence that no
 * user was created. This suite is intentionally unauthenticated (see
 * design.md decision 3), so there's no admin listing endpoint available to
 * double-check via a user lookup.
 */
function expectNoUserCreated(status: number, body: unknown) {
  expect(status).toBeGreaterThanOrEqual(400);
  expect(status).toBeLessThan(500);
  expect((body as { user?: unknown }).user).toBeUndefined();
}

test.describe('POST /api/v2/auth/signup — validation errors', () => {
  test('missing name is rejected', async ({ request }) => {
    const payload = buildSignupPayload();
    const { name: _name, ...withoutName } = payload;

    const response = await request.post('/api/v2/auth/signup', { data: withoutName });
    const body = await response.json();

    expectNoUserCreated(response.status(), body);
  });

  test('missing email is rejected', async ({ request }) => {
    const payload = buildSignupPayload();
    const { email: _email, ...withoutEmail } = payload;

    const response = await request.post('/api/v2/auth/signup', { data: withoutEmail });
    const body = await response.json();

    expectNoUserCreated(response.status(), body);
  });

  test('missing password is rejected', async ({ request }) => {
    const payload = buildSignupPayload();
    const { password: _password, ...withoutPassword } = payload;

    const response = await request.post('/api/v2/auth/signup', { data: withoutPassword });
    const body = await response.json();

    expectNoUserCreated(response.status(), body);
  });

  test('invalid email format is rejected', async ({ request }) => {
    const payload = buildSignupPayload({ email: 'not-an-email' });

    const response = await request.post('/api/v2/auth/signup', { data: payload });
    const body = await response.json();

    expectNoUserCreated(response.status(), body);
  });

  test('non-ventionteams.com email domain is rejected', async ({ request }) => {
    const payload = buildSignupPayload({
      email: `qa.wrong-domain.${Date.now()}@example.com`,
    });

    const response = await request.post('/api/v2/auth/signup', { data: payload });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.error).toBe('Registration not allowed');
    expectNoUserCreated(response.status(), body);
  });

  test('password shorter than 8 characters is rejected', async ({ request }) => {
    const payload = buildSignupPayload({ password: 'Sh0rt1' });

    const response = await request.post('/api/v2/auth/signup', { data: payload });
    const body = await response.json();

    expectNoUserCreated(response.status(), body);
  });

  test('duplicate email is rejected and no second user is created', async ({ request }) => {
    const email = uniqueSignupEmail('signup-dup');
    const payload = { name: 'QA Duplicate User', email, password: VALID_SIGNUP_PASSWORD };

    const firstResponse = await request.post('/api/v2/auth/signup', { data: payload });
    expect(firstResponse.status()).toBe(201);

    const duplicateResponse = await request.post('/api/v2/auth/signup', { data: payload });
    const duplicateBody = await duplicateResponse.json();

    expect(duplicateResponse.status()).toBe(400);
    expect(duplicateBody.error).toBe(
      'An error occurred during registration. Please try again or contact support.',
    );
    expectNoUserCreated(duplicateResponse.status(), duplicateBody);
  });
});
