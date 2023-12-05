describe("CreateMap-File Import Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("ya");
    cy.get('input[placeholder="Password"]').type("Password123");

    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });

  // it("should handle file upload and processing", () => {
  //   cy.visit("http://localhost:3000/createmap");
  //   const fileName = "sample.geojson";
  //   cy.get(".input_container").click();
  //   cy.wait(1000);
  //   cy.fixture(fileName).then((fileContent) => {
  //     cy.get('input[type="file"]').attachFile({
  //       fileContent: fileContent,
  //       fileName: fileName,
  //       mimeType: "application/geojson",
  //     });

  //     cy.wait(5000);

  //     cy.get("[data-cy=selected-file]").should("contain", "sample.geojson");

  //     cy.contains("Create Map").click();

  //     cy.wait(5000);
  //     cy.window()
  //       .its("selectedMapFile.mapbook_template")
  //       .should("not.be.empty");
  //   });
  // });
});
