describe("Register Form", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/register");
  });
  //CASE1 : User Already exists
  it("should navigate to the login page and register if not already registered", () => {
    cy.get('input[placeholder="Username"]').type("ct1");
    cy.get('input[placeholder="Email"]').type("ct1@ct1.com");
    cy.get('input[placeholder="Password"]').type("Passwowrd123");
    cy.get('input[placeholder="Confirm Password"]').type("Passwowrd123");
    cy.get(".register_btn").click();
    cy.get("p.ui.negative.mini.message").should(
      "contain",
      "Registration failed. Please check your information and make sure that the account has not been created."
    );
  });

  //CASE2 : When User inputs invalid register information
  it("should show an error message if passwords don't match", () => {
    cy.get('input[placeholder="Username"]').type("yoolloo");
    cy.get('input[placeholder="Email"]').type("yala@email.com");
    cy.get('input[placeholder="Password"]').type("Password123!");
    cy.get('input[placeholder="Confirm Password"]').type("Pass"); // When passwords don't match
    cy.get(".register_btn").click();

    // Ensure that an error message is displayed
    cy.get(".ui.negative.mini.message").should("contain", "Passwords must");
  });
  //CASE3 : Successful register
  it("should register a new user and login", () => {
    cy.get('input[placeholder="Username"]').type("yoolloo");
    cy.get('input[placeholder="Email"]').type("yala@email.com");
    cy.get('input[placeholder="Password"]').type("Password123!");
    cy.get('input[placeholder="Confirm Password"]').type("Password123!");
    cy.get(".register_btn").click();
    cy.url().should("eq", "http://localhost:3000/login");
  });

  after(() => {
    cy.log("All test cases have completed-removing account created");
    cy.get('input[placeholder="Username"]').type("yoolloo");
    cy.get('input[placeholder="Password"]').type("Password123!");
    cy.get(".login_btn").click();
    cy.get(".header_profile").click();
    cy.get(".remove_account").click();
    cy.get(".profile_remove_btn").click();
  });
});
