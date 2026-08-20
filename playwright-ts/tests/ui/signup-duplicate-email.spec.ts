import { test, expect } from '@playwright/test';
import { uniqueSignupEmail, VALID_SIGNUP_PASSWORD } from '../api/fixtures/signup';

async function fillAndSubmitSignup(
  page: import('@playwright/test').Page,
  { name, email, password }: { name: string; email: string; password: string },
) {
  await page.getByRole('textbox', { name: 'Enter your full name' }).fill(name);
  await page.getByRole('textbox', { name: 'Enter your email' }).fill(email);
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
  await page.getByRole('textbox', { name: 'Confirm your password' }).fill(password);
  await page.getByRole('button', { name: 'Sign up' }).click();
}

test.describe('Signup — end-to-end representative failure path', () => {
  test('resubmitting an already-registered email shows the generic failure message and stays on /signup', async ({
    page,
  }) => {
    const email = uniqueSignupEmail('ui-duplicate-email');

    await page.goto('/signup');
    await fillAndSubmitSignup(page, {
      name: 'QA E2E Duplicate',
      email,
      password: VALID_SIGNUP_PASSWORD,
    });
    await expect(page).toHaveURL(/\/login$/);

    await page.goto('/signup');
    await fillAndSubmitSignup(page, {
      name: 'QA E2E Duplicate',
      email,
      password: VALID_SIGNUP_PASSWORD,
    });

    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByText('Failed to create account. Please try again.')).toBeVisible();
  });
});
