import { test, expect } from '@playwright/test';
import { uniqueSignupEmail, VALID_SIGNUP_PASSWORD } from '../../fixtures/signup';
import { SignupSteps } from '../../steps/signup.steps';

test.describe('Signup — end-to-end representative failure path', () => {
  test('resubmitting an already-registered email shows the generic failure message and stays on /signup', async ({
    page,
  }) => {
    const steps = new SignupSteps(page);
    const email = uniqueSignupEmail('ui-duplicate-email');
    const signupInput = {
      name: 'QA E2E Duplicate',
      email,
      password: VALID_SIGNUP_PASSWORD,
      confirmPassword: VALID_SIGNUP_PASSWORD,
    };

    await steps.completeSignup(signupInput);
    await expect(page, 'first signup attempt should succeed and land on /login').toHaveURL(/\/login$/);

    await steps.attemptSignup(signupInput);

    await expect(page, 'resubmitting the same email should stay on /signup').toHaveURL(/\/signup$/);
    await expect(
      page.getByText('Failed to create account. Please try again.'),
      'should show the generic failure message',
    ).toBeVisible();
  });
});
