// describe("template spec", () => {
//   it("passes", () => {
//     cy.visit("https://example.cypress.io");
//   });
// });
describe("Landing Page", () => {
  it("renders without errors", () => {
    //cy.visit("http://localhost:3000"); // Adjust the URL as needed
    cy.visit("https://mapbook-f381d1faf354.herokuapp.com/");
    cy.get(".landing_container").should("exist");
  });

  it("displays the correct heading text", () => {
    //cy.visit("http://localhost:3000");
    cy.visit("https://mapbook-f381d1faf354.herokuapp.com/");
    cy.get(".landing_right h1").should("contain", "Map Book");
  });

  // Add more test cases for interactions, navigation, etc.
});
