import { test, expect } from '@playwright/test';
import { uniqueSignupEmail, VALID_SIGNUP_PASSWORD } from '../../fixtures/signup';
import { SignupSteps } from '../../steps/signup.steps';
import { LoginPage } from '../../pages/login.page';

test.describe('Signup — end-to-end happy path', () => {
  test('signing up navigates to /login with a success message, and the new account cannot log in yet', async ({
    page,
  }) => {
    const steps = new SignupSteps(page);
    const loginPage = new LoginPage(page);
    const email = uniqueSignupEmail('ui-happy-path');

    await steps.completeSignup({
      name: 'QA E2E Happy Path',
      email,
      password: VALID_SIGNUP_PASSWORD,
      confirmPassword: VALID_SIGNUP_PASSWORD,
    });

    await expect(page, 'should land on /login after a successful signup').toHaveURL(/\/login$/);
    await expect(
      page.getByText('Account created successfully! Please sign in to continue.'),
      'should show the signup success message',
    ).toBeVisible();
    await expect(loginPage.emailInput, 'login email field should retain the just-submitted email').toHaveValue(email);

    // The account was just created and is still pending admin approval —
    // a login attempt right now must be blocked, not succeed.
    await steps.attemptLogin(VALID_SIGNUP_PASSWORD);

    await expect(page, 'a blocked login attempt should stay on /login').toHaveURL(/\/login$/);
    await expect(
      page.getByText('Your account is pending administrator approval.'),
      'should show the pending-approval block message',
    ).toBeVisible();
  });
});
