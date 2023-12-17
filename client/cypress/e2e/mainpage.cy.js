describe("template spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("sam");
    cy.get('input[placeholder="Password"]').type("Password123");

    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });
});
