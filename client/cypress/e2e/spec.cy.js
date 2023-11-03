// describe("template spec", () => {
//   it("passes", () => {
//     cy.visit("https://example.cypress.io");
//   });
// });
describe("LandingPage", () => {
  it("renders without errors", () => {
    cy.visit("http://localhost:3001"); // Adjust the URL as needed
    cy.get(".landing_container").should("exist");
  });

  it("displays the correct heading text", () => {
    cy.visit("http://localhost:3001");
    cy.get(".landing_right h2").should("contain", "Map Book");
  });

  // Add more test cases for interactions, navigation, etc.
});
