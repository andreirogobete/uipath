import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GridEntryDirective } from './directives/grid-entry/grid-entry.directive';
import { GridComponent } from './grid.component';
import { gridPropertyHeaderSelector, gridRowCellSelector, gridRowSelector } from './grid.component.page-model';

const template = `
    <t-grid
      [data]=data
      [pageSize]="12"
    >
      <t-entry property="id" title="ID" [sortable]=true></t-entry>
      <t-entry property="firstName" title="First Name" [sortable]=true></t-entry>
      <t-entry property="lastName" title="Last Name" [sortable]=true></t-entry>
    </t-grid>
`;

const testDataItem = {
  id: 1,
  firstName: 'Test First Name',
  lastName: 'Test Last Name',
};

describe('Grid Component', () => {
  beforeEach(() => {
    cy.mount(template, {
      declarations: [GridEntryDirective, GridComponent],
      imports: [CommonModule, MatIconModule, FormsModule, ReactiveFormsModule],
      componentProperties: {
        data: [testDataItem],
      },
    });
  });

  it('should display table header with configured data', () => {
    const expectedHeaderLabels = ['ID', 'First Name', 'Last Name'];

    cy.get(gridPropertyHeaderSelector).should(
      'have.length',
      expectedHeaderLabels.length
    );

    for (let index = 0; index < expectedHeaderLabels.length; index++) {
        cy.get(gridPropertyHeaderSelector).eq(index).should('have.text', expectedHeaderLabels[index]);
    }
  });

  it('should display correct information in each cell', () => {
    const keys = Object.keys(testDataItem);
    cy.get(`${gridRowSelector} ${gridRowCellSelector}`).each((value, index) => {
        const key = keys[index];
        // Cast "testDataItem" to "any" to be able to dynamically index it as a key
        cy.wrap(value).should('have.text', (testDataItem as any)[key]);
    })
  });
});
