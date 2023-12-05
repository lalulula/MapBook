import "cypress-file-upload";

describe("CreateMap-File Import Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("ya");
    cy.get('input[placeholder="Password"]').type("Password123");

    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });

  it("should import a file and create a map", () => {
    // Visit the page
    cy.visit("http://localhost:3000/createmap");

    // Click the element with class "cypress_click"
    cy.get(".cypress_click").click();

    // Upload a file using the file input
    const fileName = "sample.geojson";
    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent,
        fileName: fileName,
        mimeType: "application/json",
      });
    });

    cy.get(".cypress_click_create").click();

    cy.url().should("include", "/createmap");
    cy.pause();
  });
});
