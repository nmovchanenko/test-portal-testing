/**
 * Wraps TestPortal-client's `/login` page: email input, password input, and
 * submit button. Selected by placeholder/accessible name since the page has
 * no `data-*` test hooks yet.
 */
export class LoginPage {
  visit(): void {
    cy.visit('/login');
  }

  get emailInput(): Cypress.Chainable<JQuery<HTMLInputElement>> {
    return cy.get('input[placeholder="Enter your email"]');
  }

  get passwordInput(): Cypress.Chainable<JQuery<HTMLInputElement>> {
    return cy.get('input[placeholder="Enter your password"]');
  }

  get submitButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains('button', 'Sign in');
  }

  login(email: string, password: string): void {
    this.emailInput.type(email);
    this.passwordInput.type(password);
    this.submitButton.click();
  }
}
