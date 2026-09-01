import { test, expect, Page } from '@playwright/test';
import { SignupPage } from '../../pages/signup.page';

const SIGNUP_API_PATTERN = '**/api/v2/auth/signup';

const VALID_NAME = 'QA Valid User';
const VALID_EMAIL = 'qa.valid@ventionteams.com';
const VALID_PASSWORD = 'Passw0rd123';

test.describe('Signup page — client-side field validation (mocked)', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.goto();
  });

  test('invalid name shows an inline error and makes no API request', async ({ page }) => {
    await signupPage.fillForm({
      name: 'A',
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
      confirmPassword: VALID_PASSWORD,
    });

    await expectNoSignupRequest(page, () => signupPage.submit());

    await expect(
      page.getByText('Name must be at least 2 characters'),
      'invalid name should show an inline error',
    ).toBeVisible();
  });

  test('invalid email format shows an inline error and makes no API request', async ({
    page,
  }) => {
    await signupPage.fillForm({
      name: VALID_NAME,
      email: 'not-an-email',
      password: VALID_PASSWORD,
      confirmPassword: VALID_PASSWORD,
    });

    await expectNoSignupRequest(page, () => signupPage.submit());

    await expect(
      page.getByText('Please enter a valid email address'),
      'invalid email format should show an inline error',
    ).toBeVisible();
  });

  test('weak password shows an inline error and makes no API request', async ({ page }) => {
    await signupPage.fillForm({
      name: VALID_NAME,
      email: VALID_EMAIL,
      password: 'alllowercase1',
      confirmPassword: 'alllowercase1',
    });

    await expectNoSignupRequest(page, () => signupPage.submit());

    await expect(
      page.getByText('Password must contain at least one uppercase character'),
      'weak password should show an inline error',
    ).toBeVisible();
  });

  test('mismatched confirm password shows an inline error and makes no API request', async ({
    page,
  }) => {
    await signupPage.fillForm({
      name: VALID_NAME,
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
      confirmPassword: 'Different123',
    });

    await expectNoSignupRequest(page, () => signupPage.submit());

    await expect(
      page.getByText("Passwords don't match"),
      'mismatched confirm password should show an inline error',
    ).toBeVisible();
  });

  test('submit button shows a loading state and is disabled while the response is pending', async ({
    page,
  }) => {
    await signupPage.fillForm({
      name: VALID_NAME,
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
      confirmPassword: VALID_PASSWORD,
    });

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

    await signupPage.submit();

    await expect(signupPage.loadingSubmitButton, 'submit button should show a loading state').toBeVisible();
    await expect(signupPage.loadingSubmitButton, 'submit button should be disabled while pending').toBeDisabled();

    releaseResponse();
  });
});

/** Fails the test if a signup API request is observed during `action`. */
async function expectNoSignupRequest(page: Page, action: () => Promise<void>) {
  let hasSignupRequest = false;
  const onRequest = (request: { url(): string; method(): string }) => {
    if (request.url().includes('/api/v2/auth/signup') && request.method() === 'POST') {
      hasSignupRequest = true;
    }
  };
  page.on('request', onRequest);
  try {
    await action();
  } finally {
    page.off('request', onRequest);
  }
  expect(hasSignupRequest, 'no signup request should be sent for invalid input').toBe(false);
}
