import { test, expect } from '@playwright/test';
import { uniqueSignupEmail, VALID_SIGNUP_PASSWORD } from './fixtures/signup';

test.describe('Pending account cannot authenticate until approved', () => {
  test('login immediately after signup is blocked with 403 and no tokens', async ({
    request,
  }) => {
    const email = uniqueSignupEmail('signup-login-block');
    const password = VALID_SIGNUP_PASSWORD;

    const signupResponse = await request.post('/api/v2/auth/signup', {
      data: { name: 'QA Pending User', email, password },
    });
    expect(signupResponse.status()).toBe(201);
    const signupBody = await signupResponse.json();
    expect(signupBody.user.status).toBe('pending');

    const loginResponse = await request.post('/api/v2/auth/login', {
      data: { email, password },
    });
    const loginBody = await loginResponse.json();

    expect(loginResponse.status()).toBe(403);
    expect(loginBody.error).toBe('Your account is pending administrator approval.');
    expect(loginBody.accessToken).toBeUndefined();
    expect(loginBody.refreshToken).toBeUndefined();
  });
});
