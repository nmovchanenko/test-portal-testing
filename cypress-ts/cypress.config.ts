import { defineConfig } from 'cypress';
import 'dotenv/config';

export default defineConfig({
  // Tests read env values via the async cy.env() command, not the deprecated
  // synchronous Cypress.env() — safe to disable.
  allowCypressEnv: false,
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    setupNodeEvents(_on, config) {
      config.env.LOGIN_EMAIL = process.env.CYPRESS_LOGIN_EMAIL;
      config.env.LOGIN_PASSWORD = process.env.CYPRESS_LOGIN_PASSWORD;
      return config;
    },
  },
});
