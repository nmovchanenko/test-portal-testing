import { Page, test } from '@playwright/test';
import { SignupPage, SignupFormInput } from '../pages/signup.page';
import { LoginPage } from '../pages/login.page';

const SIGNUP_ENDPOINT = '/api/v2/auth/signup';
const LOGIN_ENDPOINT = '/api/v2/auth/login';

/** Orchestrates the sign-up and post-signup login business workflows spanning `/signup` and `/login`. */
export class SignupSteps {
  private readonly page: Page;
  private readonly signupPage: SignupPage;
  private readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.signupPage = new SignupPage(page);
    this.loginPage = new LoginPage(page);
  }

  /**
   * Completes a sign-up expected to succeed: fills and submits the form,
   * waits for the matching signup response, then waits for the resulting
   * `/login` navigation.
   *
   * @throws if the signup response is not ok — this step assumes success in
   *   order to proceed to `/login`. A scenario that expects the signup
   *   itself to be rejected should use {@link attemptSignup} instead.
   */
  async completeSignup(input: SignupFormInput): Promise<void> {
    return await test.step(`complete sign-up for "${input.email}"`, async () => {
      const responsePromise = this.waitForSignupResponse(input.email);

      await this.signupPage.goto();
      await this.signupPage.fillForm(input);
      await this.signupPage.submit();

      const response = await responsePromise;

      if (!response.ok()) {
        throw new Error(`signup request failed: ${response.status()}`);
      }

      await this.page.waitForURL(/\/login$/);
    });
  }

  /**
   * Attempts a sign-up without presuming the outcome: fills and submits the
   * form and waits for the matching signup response to resolve, but asserts
   * nothing about it. The caller's spec asserts what happens next, whether
   * that's success or rejection.
   */
  async attemptSignup(input: SignupFormInput): Promise<void> {
    return await test.step(`attempt sign-up for "${input.email}"`, async () => {
      const responsePromise = this.waitForSignupResponse(input.email);

      await this.signupPage.goto();
      await this.signupPage.fillForm(input);
      await this.signupPage.submit();

      await responsePromise;
    });
  }

  /** Submits the login form's password field and waits for the login response, asserting nothing about the outcome. */
  async attemptLogin(password: string): Promise<void> {
    return await test.step('attempt login with the newly created account', async () => {
      const responsePromise = this.page.waitForResponse(
        (res) => {
          const req = res.request();
          return req.url().includes(LOGIN_ENDPOINT) && req.method() === 'POST';
        },
        { timeout: 60_000 },
      );

      await this.loginPage.submitPassword(password);

      await responsePromise;
    });
  }

  private waitForSignupResponse(email: string) {
    return this.page.waitForResponse(
      (res) => {
        const req = res.request();

        if (!req.url().includes(SIGNUP_ENDPOINT) || req.method() !== 'POST') {
          return false;
        }

        try {
          const body = JSON.parse(req.postData() ?? '');
          return body.email === email;
        } catch {
          return false;
        }
      },
      { timeout: 60_000 },
    );
  }
}
