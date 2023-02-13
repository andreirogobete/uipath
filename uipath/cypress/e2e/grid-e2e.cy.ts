import { gridPropertyHeaderSelector } from "src/app/components/grid/grid.component.page-model";
import { progressValueSelector } from "src/app/components/progress/progresss.component.page-model";

describe('template spec', () => {
  beforeEach(() => {
    const baseUrl = Cypress.config().baseUrl;
    cy.visit(baseUrl!);
  });

  it('should display a grid with items', () => {
    const expectedHeaderLabels = ['ID', 'First Name', 'Last Name', 'Username', 'Role'];

    cy.get(gridPropertyHeaderSelector).should(
      'have.length',
      expectedHeaderLabels.length
    );

    for (let index = 0; index < expectedHeaderLabels.length; index++) {
        cy.get(gridPropertyHeaderSelector).eq(index).should('have.text', expectedHeaderLabels[index]);
    }
  });

  it('should display a progress indicator circle', () => {
    // For simplicity, wait for the progress to be complete.
    cy.wait(3000);

    cy.get(progressValueSelector).should('have.text', '100%');
  });
})