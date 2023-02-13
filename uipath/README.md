# Developer Notes

I'm leaving some notes regarding the developer process that might prove helpful to you guys.

## Component Development

The 2 components that have been required for the home assignment are located under src/app/components. Each component directory contains the following:
- The component items (template file, style file, component file)
- Each component contains 2 files for tests
    - Simple unit tests written using DOM APIs
    - Cypress unit tests written using the Cypress API (this is a subset of the initial tests just to demonstrate the ability to write cypress unit/component/e2e tests :)

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