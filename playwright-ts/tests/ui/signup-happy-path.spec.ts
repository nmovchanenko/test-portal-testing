import { test, expect } from '@playwright/test';
import { uniqueSignupEmail, VALID_SIGNUP_PASSWORD } from '../api/fixtures/signup';

test.describe('Signup — end-to-end happy path', () => {
  test('signing up navigates to /login with a success message, and the new account cannot log in yet', async ({
    page,
  }) => {
    const email = uniqueSignupEmail('ui-happy-path');

    await page.goto('/signup');
    await page.getByRole('textbox', { name: 'Enter your full name' }).fill('QA E2E Happy Path');
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(email);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(VALID_SIGNUP_PASSWORD);
    await page
      .getByRole('textbox', { name: 'Confirm your password' })
      .fill(VALID_SIGNUP_PASSWORD);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByText('Account created successfully! Please sign in to continue.'),
    ).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Enter your email' })).toHaveValue(email);

    // The account was just created and is still pending admin approval —
    // a login attempt right now must be blocked, not succeed.
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(VALID_SIGNUP_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText('Your account is pending administrator approval.')).toBeVisible();
  });
});
