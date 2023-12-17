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

        cy.get(".edit_profile_btn").click();
        cy.get(".username_container")
          .find(".MuiInput-input")
          .clear()
          .type("ya");
        cy.get(".update_user_btn").click();

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

  it("Edit username", () => {
    cy.get(".edit_profile_btn").click();
    cy.get(".username_container")
      .find(".MuiInput-input")
      .clear()
      .type("newusername");
    cy.get(".update_user_btn").click();
    cy.get(".edit_profile_btn").click();
    cy.get(".username_container").find(".MuiInput-input");
  });

  it("Change profile image", () => {
    cy.get(".edit_profile_btn").click();
    cy.wait(2000);
    cy.get(".cypress_click_profile").click();

    const fileName = "sample.jpg";
    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent,
        fileName: fileName,
        mimeType: "image/jpeg",
      });
    });

    cy.get(".update_user_btn").click();
    cy.window().then((win) => {
      const user = win.userState;
      cy.get(".profile_img").should("have.attr", "src", user.profile_img);
    });
  });

  it("Logout user", () => {
    cy.get(".logout").click();
    cy.url().should("include", "http://localhost:3000");
  });
});
