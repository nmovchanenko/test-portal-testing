import { Page, Locator, test } from '@playwright/test';

/**
 * Wraps `/login`'s email (read-only — no caller fills it, since it arrives
 * pre-filled by the signup-to-login redirect), password, and submit button.
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async submitPassword(password: string): Promise<void> {
    await test.step('user submits the login password', async () => {
      await this.passwordInput.fill(password);
      await this.submitButton.click();
    });
  }
}
