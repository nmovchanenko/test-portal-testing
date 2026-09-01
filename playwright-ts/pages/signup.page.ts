import { Page, Locator, test } from '@playwright/test';

export interface SignupFormInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Wraps `/signup`'s form fields, fill/submit actions, and loading state. */
export class SignupPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly loadingSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByRole('textbox', { name: 'Enter your full name' });
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm your password' });
    this.submitButton = page.getByRole('button', { name: 'Sign up' });
    this.loadingSubmitButton = page.getByRole('button', { name: 'Creating account...' });
  }

  async goto(): Promise<void> {
    await test.step('user navigates to the sign-up page', async () => {
      await this.page.goto('/signup');
    });
  }

  async fillForm(input: SignupFormInput): Promise<void> {
    await test.step('user fills the sign-up form', async () => {
      await this.nameInput.fill(input.name);
      await this.emailInput.fill(input.email);
      await this.passwordInput.fill(input.password);
      await this.confirmPasswordInput.fill(input.confirmPassword);
    });
  }

  async submit(): Promise<void> {
    await test.step('user clicks "Sign up"', async () => {
      await this.submitButton.click();
    });
  }
}
