describe("Landing Page", () => {
  it("renders without errors", () => {
    // cy.visit("https://mapbook-f381d1faf354.herokuapp.com/");
    cy.visit("https://localhost:3000/");
    cy.get(".landing_container").should("exist");
  });

  it("displays the correct heading text", () => {
    // cy.visit("https://mapbook-f381d1faf354.herokuapp.com/");
    cy.visit("https://localhost:3000/");

    cy.get(".landing_right h1").should("contain", "Map Book");
  });
});
