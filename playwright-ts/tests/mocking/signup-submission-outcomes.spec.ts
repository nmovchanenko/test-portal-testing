import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/signup.page';

const SIGNUP_API_PATTERN = '**/api/v2/auth/signup';

const VALID_NAME = 'QA Outcome User';
const VALID_PASSWORD = 'Passw0rd123';

test.describe('Signup page — submission outcomes (mocked)', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.goto();
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

    await signupPage.fillForm({ name: VALID_NAME, email, password: VALID_PASSWORD, confirmPassword: VALID_PASSWORD });
    await signupPage.submit();

    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByText('Account created successfully! Please sign in to continue.'),
      'success message should be the client\'s generic copy, not the mocked backend message',
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

    await signupPage.fillForm({ name: VALID_NAME, email, password: VALID_PASSWORD, confirmPassword: VALID_PASSWORD });
    await signupPage.submit();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(
      page.getByText('Failed to create account. Please try again.'),
      'failure message should be the client\'s generic copy',
    ).toBeVisible();
    await expect(signupPage.nameInput, 'name input should retain its value after a failed submission').toHaveValue(VALID_NAME);
    await expect(signupPage.emailInput, 'email input should retain its value after a failed submission').toHaveValue(email);
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

    await signupPage.fillForm({ name: VALID_NAME, email, password: VALID_PASSWORD, confirmPassword: VALID_PASSWORD });
    await signupPage.submit();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(
      page.getByText('Failed to create account. Please try again.'),
      'failure message should be the same generic copy regardless of rejection cause',
    ).toBeVisible();
    await expect(signupPage.emailInput, 'email input should retain its value after a failed submission').toHaveValue(email);
  });
});
