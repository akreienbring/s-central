// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});

Cypress.Commands.add('containsBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});

// testing the header in every page
Cypress.Commands.add('testHeader', () => {
  cy.getBySel('open_account_popover_button');
  cy.getBySel('open_language_popover_button');
  cy.getBySel('open_notifications_popover_button');
});

// testing the edit profile dialog from accout and user table row
Cypress.Commands.add('testProfile', () => {
  const profile_alias_input = cy.getBySel('profile_alias_input');
  cy.containsBySel('profile_firstname_input');
  cy.containsBySel('profile_lastname_input');
  cy.containsBySel('profile_role_select');
  const account_save_button = cy.getBySel('account_save_button').should('be.disabled');
  profile_alias_input.type('x');
  account_save_button.should('not.be.disabled');
});
