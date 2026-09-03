import { LoginPage } from '../pages/login.page';

describe('Login - happy path', () => {
  it('logs in with valid, approved credentials and lands on the authenticated app', () => {
    cy.env(['LOGIN_EMAIL', 'LOGIN_PASSWORD']).then(({ LOGIN_EMAIL, LOGIN_PASSWORD }) => {
      expect(LOGIN_EMAIL, 'CYPRESS_LOGIN_EMAIL must be set (see .env.example)').to.be.a('string').and.not.be.empty;
      expect(LOGIN_PASSWORD, 'CYPRESS_LOGIN_PASSWORD must be set (see .env.example)').to.be.a('string').and.not.be
        .empty;

      const loginPage = new LoginPage();
      loginPage.visit();
      loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);

      cy.location('pathname', { timeout: 10000 }).should('not.equal', '/login');
    });
  });
});
