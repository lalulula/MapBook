describe("Create Map Page", () => {
  it("should select topics and templates from dropdowns", () => {
    cy.visit("https://mapbook-f381d1faf354.herokuapp.com/createmap");

    cy.get(".custom-dropdown").should("be.visible");
    cy.get(".custom-dropdown-item").contains("Education").click();
    cy.get(".custom-dropdown").should("contain", "Education");
    cy.get(".custom-dropdown").contains("Select Template").click();
    cy.get(".custom-dropdown-item").contains("Bar Chart").click();
    cy.get(".custom-dropdown").should("contain", "Bar Chart");
  });

  it("should trigger the 'nextStep' function when 'Go To Step2' is clicked", () => {
    cy.visit("https://mapbook-f381d1faf354.herokuapp.com/createmap");
    cy.window().then((win) => {
      cy.stub(win, "nextStep");
    });
    cy.get(".custom-dropdown").contains("Select Topic").click();
    cy.get(".custom-dropdown-item").contains("Education").click();
    cy.get(".custom-dropdown").contains("Select Template").click();
    cy.get(".custom-dropdown-item").contains("Bar Chart").click();
    cy.get("button").click();
    cy.window().its("nextStep").should("be.called");
  });
});
