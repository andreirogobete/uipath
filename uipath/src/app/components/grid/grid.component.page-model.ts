// Export selectors for DOM elements from the page model in order to only change them once for tests if the component DOM is updated.
export const gridPropertyHeaderSelector = '[data-test-id="grid-property-header"]';
export const gridRowSelector = '[data-test-id="grid-row"]';
export const gridRowCellSelector = '[data-test-id="grid-row-cell"]';
export const paginationPageSizeControlSelector = '[data-test-id="pagination-page-size-control"]';
export const paginationLeftControlSelector = '[data-test-id="pagination-left-control"]';
export const paginationRightControlSelector = '[data-test-id="pagination-right-control"]';


// Alternative way for using page object by embedding the logic around querying and getting the interested value directly
// in this file rather than the test itself. I (personally) like this approach more but having a lot of functions like this in the page model
// file can really clutter up things.
export const getPageSizeControlValue = (component: HTMLElement) => {
    const pageSizeControlSelect = component.querySelector(paginationPageSizeControlSelector) as HTMLSelectElement;

    return Number(pageSizeControlSelect.value);
}