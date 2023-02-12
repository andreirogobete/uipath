import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { GridEntryDirective } from './directives/grid-entry/grid-entry.directive';

import { GridComponent } from './grid.component';
import { getPageSizeControlValue, gridPropertyHeaderSelector, gridRowCellSelector, gridRowSelector, paginationPageSizeControlSelector, paginationRightControlSelector } from './grid.component.page-model';

/**

  DEV NOTES: I mostly wrote DOM tests for Angular components until now. The reason was that these DOM tests would interact with the component more or less in
  the same way that the user would do (usually by clicking on the elements themselves).

  The idea is to assert the final component state via its actual DOM rather than the component internals (since some potential private variables inside the component
    would be hard to test). The DOM would eventually show the component state and it should bring out potential bugs.

  This test file contains the following:

  1. A Test Host component that wraps the grid inside. The tests are being run against the host component.

  2 The test data is the same one for all the tests. For this specific case, this should probably be enough. Alternatively, we could also configure the Test Host
    component with @Input() properties and set them for specific tests and the grid component would be updated via the call to "fixture.detectChanges()";

  3. A small suite of tests that verify the grid behaviour by verifying:
    - That the displayed data is the expected one (each data item in the expected table cell)
    - That sorting works as expected when clicking the table header
    - That pagination works when selecting the page size or changing the current page number -> displayed data should be different

  Note: The suite is not 100% complete. Potentially, there will be a lot more tests in this file, but I believe that for demonstration, this suite is ok for now :).
*/

@Component({
  template: `
    <t-grid [data]="data" [pageSize]="pageSize">
      <t-entry property="id" title="ID" [sortable]=true></t-entry>
      <t-entry property="firstName" title="First Name"></t-entry>
      <t-entry property="lastName" title="Last Name"></t-entry>
    </t-grid>
  `
})
class GridTestHostComponent {
  testData = [
    {
      id: 1,
      firstName: 'First Name 1',
      lastName: 'Last Name 1'
    },
    {
      id: 2,
      firstName: 'First Name 2',
      lastName: 'Last Name 2'
    },
    {
      id: 3,
      firstName: 'First Name 3',
      lastName: 'Last Name 3'
    },
    {
      id: 4,
      firstName: 'First Name 4',
      lastName: 'Last Name 4'
    },
    {
      id: 5,
      firstName: 'First Name 5',
      lastName: 'Last Name 5'
    }
  ];
  pageSize = 2;
  data = of(this.testData)
}

describe('GridComponent', () => {
  let component: GridTestHostComponent;
  let fixture: ComponentFixture<GridTestHostComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridComponent, GridTestHostComponent, GridEntryDirective ],
      imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridTestHostComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should display table header with configured data', () => {
      const expectedHeaderLabels = ['ID', 'First Name', 'Last Name'];

      const headers = nativeElement.querySelectorAll(gridPropertyHeaderSelector);
      
      for (let index = 0; index < expectedHeaderLabels.length; index++) {
        expect(headers[index].textContent?.trim()).toEqual(expectedHeaderLabels[index]);
      }
  });

  it('should display correct information for one data row', () => {
    const expectedData = component.testData[0];

    const firstRow = nativeElement.querySelector(gridRowSelector);
    const firstRowCells = firstRow?.querySelectorAll(gridRowCellSelector);

    /*
      Alternatively, we could iterate through "expectedData" keys and verify but I thought
      that being more specific here would make the test more valuable.

      Downsides: Updating the test data would imply updating this test -> which is not necesarily bad
    */
    expect(Number(firstRowCells?.[0].textContent?.trim())).toEqual(expectedData.id);
    expect(firstRowCells?.[1].textContent?.trim()).toEqual(expectedData.firstName);
    expect(firstRowCells?.[2].textContent?.trim()).toEqual(expectedData.lastName);
  });

  it('should have selected current page size', () => {
    const pageSizeControl = nativeElement.querySelector(paginationPageSizeControlSelector) as HTMLSelectElement;

    expect(Number(pageSizeControl.value)).toEqual(component.pageSize);
  });

  // This is the same test as above, but demonstrated via a page model API that interacts with the component HTML element directly
  it('should have selected current page size -> alternate usage of page model', () => {
    const selectedPageSize = getPageSizeControlValue(nativeElement);

    expect(selectedPageSize).toEqual(component.pageSize);
  });

  it('should display expected number of elements based on pageSize', () => {
    const displayedRows = nativeElement.querySelectorAll(gridRowSelector);
    
    expect(displayedRows.length).toEqual(component.pageSize);
  });

  it('should update displayed elements when changing page number', () => {
    const expectedData = component.testData[2]; // We will test against the data with ID = 3;

    // Click the right pagination control
    const rightPaginationControl = nativeElement.querySelector(paginationRightControlSelector) as HTMLButtonElement;
    rightPaginationControl?.click();

    fixture.detectChanges();

    // Verify the first displayed row, which should be the one with ID = 3
    const firstRow = nativeElement.querySelector(gridRowSelector);
    const firstRowCells = firstRow?.querySelectorAll(gridRowCellSelector);

    expect(Number(firstRowCells?.[0].textContent?.trim())).toEqual(expectedData.id);
    expect(firstRowCells?.[1].textContent?.trim()).toEqual(expectedData.firstName);
    expect(firstRowCells?.[2].textContent?.trim()).toEqual(expectedData.lastName);
  })

  it('should sort descending based on ID', () => {
    const idColumnHeader = nativeElement.querySelector(gridPropertyHeaderSelector) as HTMLElement;

    // Need to click twice to sort descending
    clickHtmlElementTimes(idColumnHeader, fixture, 2);
    
    // The first element should be the one with ID = 5 since we clicked the header twice to sort descending
    const expectedData = component.testData[component.testData.length - 1];
    const firstRow = nativeElement.querySelector(gridRowSelector);
    const firstRowCells = firstRow?.querySelectorAll(gridRowCellSelector);

    expect(Number(firstRowCells?.[0].textContent?.trim())).toEqual(expectedData.id);
    expect(firstRowCells?.[1].textContent?.trim()).toEqual(expectedData.firstName);
    expect(firstRowCells?.[2].textContent?.trim()).toEqual(expectedData.lastName);
    
  });

  function clickHtmlElementTimes(element: HTMLElement, fixture: ComponentFixture<GridTestHostComponent>, clickCount: number) {
    for (let i = 0; i < clickCount; i++) {
      element.click();
      fixture.detectChanges();
    }
  }
});
