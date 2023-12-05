/* import ImportFilePage from '../../src/Components/createmap/ImportFilePage';

describe("Create Map Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("sam");
    cy.get('input[placeholder="Password"]').type("Password123");
    //  Submit the form
    cy.get(".login_btn").click();

    cy.url().should("eq", "http://localhost:3000/mainpage");
  });
  it('Handles file change', () => {
    // Mount the component
    mount(<ImportFilePage />);

    // Stub the processFile function to prevent actual file processing during the test
    cy.stub(window, 'processFile').as('processFile');

    // Use the Cypress FileUpload command to simulate file selection
    // Replace 'example.txt' with the actual file name in your fixtures directory
    cy.fixture('north_america.json').then((fileContent) => {
      cy.get('.importfilepage_fileInput').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'north_america.json',
        mimeType: 'application/json',
      });
    });

    // it("should select topics and templates from dropdowns", () => {
    //   // cy.visit("https://mapbook-f381d1faf354.herokuapp.com/createmap");
  
    //   cy.visit("http://localhost:3000/createmap");
  
    //   cy.get('.popup-overlay ').click();
  
    //   // Use the fixture command to load a file from the fixtures directory
    //   cy.fixture('north_america.json').then((fileContent) => {
    //     // Get the file input element and attach the file
    //     cy.get('.importfilepage_fileInput').then(($fileInput) => {
    //       // Assuming the FileInput component has an `upload` method
    //       // You should replace this with the actual method or event that triggers file upload
    //       cy.wrap($fileInput).invoke('upload', fileContent, 'north_america.json', 'application/json');
    //     });
  
    //     cy.get('.importfilepage_container').should('contain', "Create Map");
    //   });

    // cy.get(".Dropdown-control").should("be.visible");
    // cy.get(".Dropdown-control").contains("Select Topic").click();
    // cy.get(".Dropdown-menu").contains("Education").click();
    // cy.get(".Dropdown-control").contains("Select Template").click();
    // cy.get(".Dropdown-menu").contains("Bar Chart").click();
  });

  // it("should trigger the 'nextStep' function when 'Go To Step2' is clicked", () => {
  //   // cy.visit("https://mapbook-f381d1faf354.herokuapp.com/createmap");
  //   cy.visit("http://localhost:3000/createmap");
  //   // cy.window().then((win) => {
  //   //   cy.stub(win, "nextStep");
  //   // });
  //   cy.get(".Dropdown-control").contains("Select Topic").click();
  //   cy.get(".Dropdown-menu").contains("Education").click();
  //   cy.get(".Dropdown-control").contains("Select Template").click();
  //   cy.get(".Dropdown-menu").contains("Bar Chart").click();
  //   cy.get(".next_btn").click();
  //   cy.get(".before_btn").should("be.visible");
  // });
});
 */