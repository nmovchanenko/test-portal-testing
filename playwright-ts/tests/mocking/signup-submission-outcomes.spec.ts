import { test, expect, Page } from '@playwright/test';

const SIGNUP_API_PATTERN = '**/api/v2/auth/signup';

const VALID_NAME = 'QA Outcome User';
const VALID_PASSWORD = 'Passw0rd123';

function signupFields(page: Page) {
  return {
    name: page.getByRole('textbox', { name: 'Enter your full name' }),
    email: page.getByRole('textbox', { name: 'Enter your email' }),
    password: page.getByRole('textbox', { name: 'Enter your password' }),
    confirmPassword: page.getByRole('textbox', { name: 'Confirm your password' }),
    submit: page.getByRole('button', { name: 'Sign up' }),
  };
}

async function fillValidForm(page: Page, email: string) {
  const fields = signupFields(page);
  await fields.name.fill(VALID_NAME);
  await fields.email.fill(email);
  await fields.password.fill(VALID_PASSWORD);
  await fields.confirmPassword.fill(VALID_PASSWORD);
  return fields;
}

test.describe('Signup page — submission outcomes (mocked)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('successful (201) response navigates to /login with the generic success message and submitted email, ignoring the mocked message body', async ({
    page,
  }) => {
    const email = 'qa.outcome.success@ventionteams.com';
    await page.route(SIGNUP_API_PATTERN, (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        // deliberately different from the client's hardcoded success string,
        // to prove the UI ignores the backend's actual message
        body: JSON.stringify({
          user: { status: 'pending' },
          message: 'this backend-provided message should not be shown',
        }),
      }),
    );

    const fields = await fillValidForm(page, email);
    await fields.submit.click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByText('Account created successfully! Please sign in to continue.'),
    ).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Enter your email' })).toHaveValue(email);
  });

  test('failed (4xx) response — duplicate email — shows the generic failure message, stays on /signup, and retains input', async ({
    page,
  }) => {
    const email = 'qa.outcome.duplicate@ventionteams.com';
    await page.route(SIGNUP_API_PATTERN, (route) =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'An error occurred during registration. Please try again or contact support.',
        }),
      }),
    );

    const fields = await fillValidForm(page, email);
    await fields.submit.click();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByText('Failed to create account. Please try again.')).toBeVisible();
    await expect(fields.name).toHaveValue(VALID_NAME);
    await expect(fields.email).toHaveValue(email);
  });

  test('failed (4xx) response — any other rejection cause — shows the same generic failure message and stays on /signup', async ({
    page,
  }) => {
    const email = 'qa.outcome.other-failure@ventionteams.com';
    await page.route(SIGNUP_API_PATTERN, (route) =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Registration not allowed' }),
      }),
    );

    const fields = await fillValidForm(page, email);
    await fields.submit.click();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByText('Failed to create account. Please try again.')).toBeVisible();
    await expect(fields.email).toHaveValue(email);
  });
});
