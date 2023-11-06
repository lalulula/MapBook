describe("Register Form", () => {
  //CASE1 : When User inputs valid register information
  it("should successfully register a user", () => {
    cy.visit("https://mapbook-f381d1faf354.herokuapp.com/register");
    // Fill out the registration form
    cy.get('input[placeholder="Name"]').type("Sam");
    cy.get('input[placeholder="Username"]').type("Sammy");
    cy.get('input[placeholder="Email"]').type("saaaaam@gmail.com");
    cy.get('input[placeholder="Password"]').type("Password123!");
    cy.get('input[placeholder="Confirm Password"]').type("Password123!");

    //  Submit the form
    cy.get(".register_btn").click();

    // Ensure the registration was successful (you might need to assert the URL or page content)
    cy.url().should("eq", "https://mapbook-f381d1faf354.herokuapp.com/login");
  });

  //CASE2 : When User inputs invalid register information
  it("should show an error message if passwords don't match", () => {
    cy.visit("https://mapbook-f381d1faf354.herokuapp.com/register");

    // Fill out the registration form with passwords that don't match
    cy.get('input[placeholder="Name"]').type("Yolo");
    cy.get('input[placeholder="Username"]').type("yoolloo");
    cy.get('input[placeholder="Email"]').type("yala@email.com");
    cy.get('input[placeholder="Password"]').type("Password123!");
    cy.get('input[placeholder="Confirm Password"]').type("Pass"); // Passwords don't match

    // Submit the form
    cy.get(".register_btn").click();

    // Ensure that an error message is displayed
    cy.get(".ui.negative.mini.message").should(
      "contain",
      "Passwords must match"
    );
  });
});
