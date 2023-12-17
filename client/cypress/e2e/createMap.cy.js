// export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const API_BASE_URL = process.env.REACT_APP_HOME_URL;

import "cypress-file-upload";

describe("CreateMap-File Import Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("sam");
    cy.get('input[placeholder="Password"]').type("Password123");

    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });

  it("should import a file and create a map", () => {
    // Visit the page
    cy.visit("http://localhost:3000/createmap");

    cy.wait(2000);
    // Click the element with class "cypress_click"
    cy.get(".cypress_click").click();

    // Upload a file using the file input
    const fileName = "north_america.json";
    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent,
        fileName: fileName,
        mimeType: "application/json",
      });
    });

    cy.get(".cypress_click_create").click();

    cy.url().should("include", "/createmap");

    cy.get('.addmapdata_left_sidebar input').eq(0).type("Test Map (cypress)");
    cy.get('.addmapdata_left_sidebar textarea').eq(0).type("Test map description");
    cy.get('.Dropdown-control').eq(0).click();
    cy.get('.Dropdown-menu').contains("Economy").click();
    cy.get('.Dropdown-control').eq(1).click();
    cy.get('.Dropdown-menu').contains("Circle Map").click();
    cy.get('.map_toolbar_container button').click({ force: true });

    cy.wait(2000);
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });
});
