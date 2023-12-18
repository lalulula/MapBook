import "cypress-file-upload";

describe("Profile Component", () => {
  beforeEach(() => {
    switch (Cypress.currentTest.title) {
      case "Change profile image":
        cy.visit("http://localhost:3000/login");
        cy.get('input[placeholder="Username"]').type("newusername");
        cy.get('input[placeholder="Password"]').type("Password123");
        cy.get(".login_btn").click();
        cy.url().should("eq", "http://localhost:3000/mainpage");
        cy.get(".header_profile").click();
        cy.url().should("eq", "http://localhost:3000/profile");
        cy.getReduxState().as("currentState");

        // cy.get(".edit_profile_btn").click();
        // cy.get(".username_container")
        //   .find(".MuiInput-input")
        //   .clear()
        //   .type("ya");
        // // cy.get(".update_user_btn_container").click();

        break;
      default:
        cy.visit("http://localhost:3000/login");
        cy.get('input[placeholder="Username"]').type("ya");
        cy.get('input[placeholder="Password"]').type("Password123");
        cy.get(".login_btn").click();
        cy.url().should("eq", "http://localhost:3000/mainpage");
        cy.get(".header_profile").click();
        cy.url().should("eq", "http://localhost:3000/profile");
        cy.getReduxState().as("currentState");
        break;
    }
  });
  // TEST1 display user information
  it("Display user information", () => {
    cy.window().then((win) => {
      const user = win.userState;

      cy.get(".profile_img").should("have.attr", "src", user.profile_img);

      cy.get(".edit_profile_btn").click();
      cy.get(".username_container")
        .find(".MuiInput-input")
        .should("have.value", "ya");

      cy.get(".email_container")
        .find(".MuiInput-input")
        .should("have.value", "ya@ya.com");
    });
  });
  // TEST2 Edit username
  it("Edit username", () => {
    cy.get(".edit_profile_btn").click();
    cy.get(".username_container")
      .find(".MuiInput-input")
      .clear()
      .type("newusername");
    cy.get(".update_user_btn_container").click();
    cy.get(".edit_profile_btn").click();
    cy.get(".username_container")
      .find(".MuiInput-input")
      .should("have.value", "newusername");
  });
  // TEST3 Change profile image
  it("Change profile image", () => {
    cy.get(".edit_profile_btn").click();

    cy.get(".username_container").find(".MuiInput-input").clear().type("ya");
    cy.get(".cypress_click_profile").click();

    const fileName = "YAprofiletest.jpg";
    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent,
        fileName: fileName,
        mimeType: "image/jpeg",
      });
    });

    // cy.get(".update_user_btn_container").click();
    cy.get(".profile_update_btn").click();
    cy.window().then((win) => {
      const user = win.userState;
      console.log("Current", user);
      cy.wait(2000);
      console.log("Current", user.profile_img);
    });
    // cy.get(".username_container")
    //   .find(".MuiInput-input")
    //   .clear()
    //   .type("newusername");
    // cy.get(".update_user_btn_container").click();
  });
  // TEST4 logout
  it("Logout user", () => {
    cy.get(".logout").click();
    cy.get(".profile_logout_btn").click();
    cy.url().should("eq", "http://localhost:3000/");
  });
});
