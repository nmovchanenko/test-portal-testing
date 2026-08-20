import { test, expect, Page } from '@playwright/test';

const SIGNUP_API_PATTERN = '**/api/v2/auth/signup';

const VALID_NAME = 'QA Valid User';
const VALID_EMAIL = 'qa.valid@ventionteams.com';
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

/** Fails the test if a signup API request is observed during `action`. */
async function expectNoSignupRequest(page: Page, action: () => Promise<void>) {
  let requested = false;
  const onRequest = (request: { url(): string; method(): string }) => {
    if (request.url().includes('/api/v2/auth/signup') && request.method() === 'POST') {
      requested = true;
    }
  };
  page.on('request', onRequest);
  try {
    await action();
  } finally {
    page.off('request', onRequest);
  }
  expect(requested).toBe(false);
}

test.describe('Signup page — client-side field validation (mocked)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('invalid name shows an inline error and makes no API request', async ({ page }) => {
    const fields = signupFields(page);
    await fields.name.fill('A');
    await fields.email.fill(VALID_EMAIL);
    await fields.password.fill(VALID_PASSWORD);
    await fields.confirmPassword.fill(VALID_PASSWORD);

    await expectNoSignupRequest(page, () => fields.submit.click());

    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
  });

  test('invalid email format shows an inline error and makes no API request', async ({
    page,
  }) => {
    const fields = signupFields(page);
    await fields.name.fill(VALID_NAME);
    await fields.email.fill('not-an-email');
    await fields.password.fill(VALID_PASSWORD);
    await fields.confirmPassword.fill(VALID_PASSWORD);

    await expectNoSignupRequest(page, () => fields.submit.click());

    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });

  test('weak password shows an inline error and makes no API request', async ({ page }) => {
    const fields = signupFields(page);
    await fields.name.fill(VALID_NAME);
    await fields.email.fill(VALID_EMAIL);
    await fields.password.fill('alllowercase1');
    await fields.confirmPassword.fill('alllowercase1');

    await expectNoSignupRequest(page, () => fields.submit.click());

    await expect(
      page.getByText('Password must contain at least one uppercase character'),
    ).toBeVisible();
  });

  test('mismatched confirm password shows an inline error and makes no API request', async ({
    page,
  }) => {
    const fields = signupFields(page);
    await fields.name.fill(VALID_NAME);
    await fields.email.fill(VALID_EMAIL);
    await fields.password.fill(VALID_PASSWORD);
    await fields.confirmPassword.fill('Different123');

    await expectNoSignupRequest(page, () => fields.submit.click());

    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });

  test('submit button shows a loading state and is disabled while the response is pending', async ({
    page,
  }) => {
    const fields = signupFields(page);
    await fields.name.fill(VALID_NAME);
    await fields.email.fill(VALID_EMAIL);
    await fields.password.fill(VALID_PASSWORD);
    await fields.confirmPassword.fill(VALID_PASSWORD);

    let releaseResponse!: () => void;
    const responseGate = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    await page.route(SIGNUP_API_PATTERN, async (route) => {
      await responseGate;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { status: 'pending' },
          message: 'Your account is pending administrator approval.',
        }),
      });
    });

    await fields.submit.click();

    const loadingButton = page.getByRole('button', { name: 'Creating account...' });
    await expect(loadingButton).toBeVisible();
    await expect(loadingButton).toBeDisabled();

    releaseResponse();
  });
});
