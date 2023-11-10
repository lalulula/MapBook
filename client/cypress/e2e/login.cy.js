describe("Login Page", () => {
  //CASE1 : When User inputs valid login information
  it("should login user successgfully with the correct data", () => {
    cy.visit("https://mapbook-f381d1faf354.herokuapp.com/login");
    // Fill out the login form
    cy.get('input[placeholder="Username"]').type("Jasson");
    cy.get('input[placeholder="Password"]').type("Jasson123");
    //  Submit the form
    cy.get(".login_btn").click();

    // Ensure the registration was successful (you might need to assert the URL or page content)
    cy.url().should(
      "eq",
      "https://mapbook-f381d1faf354.herokuapp.com/mainpage"
    );
  });

  //CASE2 : When User inputs invalid password
  it("should show an error message if password is wrong", () => {
    cy.visit("https://mapbook-f381d1faf354.herokuapp.com/login");
    // Fill out the login form
    cy.get('input[placeholder="Username"]').type("Jasson");
    cy.get('input[placeholder="Password"]').type("Jasson");
    //  Submit the form
    cy.get(".login_btn").click();
    cy.get(".ui.negative.mini.message").should(
      "contain",
      "Incorrect username or"
    );
  });
});
