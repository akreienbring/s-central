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

// selects the given data-testid
Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});

// selects the given data-testid with a wildcard
Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-testid*=${selector}]`, ...args);
});

// testing the header in every page
Cypress.Commands.add('testHeader', () => {
  cy.getBySel('open_account_popover_button').should('exist');
  cy.getBySel('open_language_popover_button').should('exist');
  cy.getBySel('open_notifications_popover_button').should('exist');
});
