import { test, expect } from '@playwright/test';
import { buildSignupPayload } from './fixtures/signup';

test.describe('POST /api/v2/auth/signup — success', () => {
  test('valid signup returns 201 with a pending account and no secret fields', async ({
    request,
  }) => {
    const payload = buildSignupPayload({ name: 'QA Success User' });

    const response = await request.post('/api/v2/auth/signup', { data: payload });

    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body.user).toMatchObject({
      name: payload.name,
      email: payload.email,
      status: 'pending',
    });
    const secretLikeKeys = Object.keys(body.user).filter((key) => /password|secret|hash/i.test(key));
    expect(secretLikeKeys).toEqual([]);

    // pending-approval message, without pinning the exact backend wording
    // beyond what's needed to confirm it's about pending approval
    expect(body.message).toMatch(/pending/i);
    expect(body.message).toMatch(/approval/i);
  });
});
