describe("ManageUsers Component", () => {
  beforeEach(() => {
    const username = "yoolloo";
    const password = "Password123";

    cy.visit("http://localhost:3000/register");

    // Check if the user already exists
    console.log("User does not exist");
    cy.get('input[placeholder="Username"]').type(username);
    cy.get('input[placeholder="Email"]').type("yala@email.com");
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('input[placeholder="Confirm Password"]').type(password);
    cy.get(".register_btn").click();

    // Check if the registration was successful (the user is redirected to the login page)
    cy.url().should("eq", "http://localhost:3000/login");
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("Admin");
    cy.get('input[placeholder="Password"]').type("Password123");
    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
    cy.get(".dropbtn").click();
    cy.url().should("eq", "http://localhost:3000/manageusers");
    cy.getReduxState().as("currentState");
  });

  it("should delete a user", () => {
    // Get the initial number of users
    cy.get(".manage_users_user")
      .should("have.length.gte", 1)
      .as("initialUsers");

    // Store the initial user count
    cy.get("@initialUsers").its("length").as("initialUserCount");

    // Click the delete icon for the last user created
    cy.get(".manage_users_user")
      .last()
      .within(() => {
        cy.get(".user_delete").click();
      });

    // Confirm deletion
    cy.get(".delete_user_confirm").click();

    // Wait for the user list to update
    cy.wait(1000);

    // Check if the number of users has decreased
    cy.get("@initialUserCount").then((initialUserCount) => {
      cy.get(".manage_users_user").should("have.length.lt", initialUserCount);
    });
  });
});
