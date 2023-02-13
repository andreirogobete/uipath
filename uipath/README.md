# Developer Notes

I'm leaving some notes regarding the developer process that might prove helpful to you guys.

## Component Development

The 2 components that have been required for the home assignment are located under src/app/components. Each component directory contains the following:
- The component items (template file, style file, component file)
- Each component contains 2 files for tests
    - Simple unit tests written using DOM APIs
    - Cypress unit tests written using the Cypress API (this is a subset of the initial tests just to demonstrate the ability to write cypress unit/component/e2e tests :)

You can view the components directly by running "npm start" in a terminal and going to "http://localhost:4200" in a web browser. You should see a grid and the progress indicator under.

For simplicity, I've configured both components to be displayed in the App Component, without adding routing.

## Grid Component

The grid component contains the following features:
 - Sortable headers
    - click on each header to sort it ascending or descending
    - The column is sortable only if specified in the template grid item
 - Pagination
    - You can change the number of visible rows per page
    - If not items are visible in the current page, the pagination control allows you to change the current page
    - The pagination control displays the current page out of the total number of pages

From a styling point of view, I went with something pretty simple like a couple of borders and alternate backgrounds for rows. Upon requests, styling can be more complex, depending on requirements.

The grid outputs events for the following:
 - Changing the page size using the "Select" control
 - Changing the page number
 - Changing the sort

 The events are currently caught in the App Component and I've added console logs for info.

 For the grid data, I've added a JSON file under src/assets/data that contains some user information. However, the grid should be pretty generic in order to accomodate any data items, as long as the provided configuration items are correct :). 

## Progress indicator component

The progress indicator displays a circle that spins and fills itself up until completion. The center of the indicator displays the current progress.

The indicator starts spinning based on the currently set "progress" input. It will always complete until 100% and stops.

The progress indicator outupts an event called "complete" that is fired when the indicator reaches 100% completion.

I've used 2 animations for the indicator, as follows:
- rotate -> rotates the whole indicator as long as it is not complete. This animation is smooth but it depends on the speed of completion.

- conic-gradien -> This is used to fill up the indicator as the progress goes up. Unfortunately, I believe this property is not supported via the "animate/transition" API, or at least I had some troubles trying to make it work :(

## Testing

There are 3 ways of running tests for the 2 components:
- Simple unit tests using Karma + Jasmine
    - To run these -> run "npm run test" (or ng test) -> Opens up karma and runs the tests found in the **component-name**.spec.ts file

- Cypress component tests
    - These tests mount the actual component and it uses cypress APIs to test the component DOM
    - To run these tests, run "npm run test:cypress" to open up cypress
    - Click the "Component Testing" button when cypress opens
    - I've only written some tests for the grid to demonstrate the ability to write cypress component tests

- Cypress e2e tests
    - These tests will visit the URL defined in the cypress configuration (currently set to Angular's dev server -> localhost:4200)
    - The test will visit the URL defined in the config file and will test against the real-running app example
    - There are 2 e2e tests written, one for the grid, another one for the progress indicator
    - To run these tests, you need to:
        - Start the local app by running "npm start"
        - Open cypress by running "npm run test:cypress"
        - Click the "E2E Testing" button when cypress opens


**That being said, I hope this will raise up to your expectations, or at least close to them. Looking forward to talking to you and thanks for this oppportunity again! :)**