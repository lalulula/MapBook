//////////////////////////////////////////////
describe("Register Form", () => {
  //CASE1 : When User inputs valid register information
  it("should navigate to the login page and register if not already registered", () => {
    const username = "Jasson";
    const password = "Jasson123";

    cy.visit("http://localhost:3000/register");

    // Check if the user already exists
    cy.request("GET", `/api/checkUser/${username}`).then((response) => {
      if (response.status === 200) {
        // User with the same username exists, you can handle this scenario accordingly
        // For example, you can skip registration or display an error message
        console.log("User exists");
      } else {
        // User is not registered, proceed with registration
        cy.get('input[placeholder="Username"]').type(username);
        cy.get('input[placeholder="Password"]').type(password);
        cy.get('input[placeholder="Confirm Password"]').type(password);
        cy.get(".register_btn").click();

        // Check if the registration was successful (the user is redirected to the login page)
        cy.url().should(
          "eq",
          "http://localhost:3000/login"
        );

        // Perform actions after successful registration
      }
    });
  });

  //CASE2 : When User inputs invalid register information
  it("should show an error message if passwords don't match", () => {
    cy.visit("http://localhost:3000/register");

    // Fill out the registration form with passwords that don't match
    //cy.get('input[placeholder="Name"]').type("Yolo");
    cy.get('input[placeholder="Username"]').type("yoolloo");
    cy.get('input[placeholder="Email"]').type("yala@email.com");
    cy.get('input[placeholder="Password"]').type("Password123!");
    cy.get('input[placeholder="Confirm Password"]').type("Pass"); // Passwords don't match

    // Submit the form
    cy.get(".register_btn").click();

    // Ensure that an error message is displayed
    cy.get(".ui.negative.mini.message").should("contain", "Passwords must");
  });
});
