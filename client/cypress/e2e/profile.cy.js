describe("Profile Component", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("ya");
    cy.get('input[placeholder="Password"]').type("Password123");
    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
    cy.get(".header_profile").click();
    cy.url().should("eq", "http://localhost:3000/profile");
    cy.getReduxState().as("currentState");
  });

  it("Display user information", () => {
    cy.window().then((win) => {
      const user = win.userState;
      console.log(user.username, user.email);
      console.log(
        cy.get(".username_container").find(".username").invoke("val")
      );
      cy.get(".profile_img").should("have.attr", "src", user.profile_img);

      // cy.get(".username").invoke("prop", "disabled", false);
      cy.get(".edit_profile_btn").click();
      cy.get(".username_container")
        .find(".MuiInput-input css-1gw9vc6-JoyInput-input")
        .should("have.value", "ya");
      // cy.get(".username").invoke("val").should("eq", "ya");
      cy.get(".username").invoke("prop", "disabled", true);
      // // cy.get(".username_container")
      // //   .find(".username")
      // //   .should("have.attr", "value", "ya");
      // cy.get(".username_container").invoke("prop", "disabled", false);
      // cy.get(".username_container")
      //   .find(".MuiInput-input Mui-disabled css-1gw9vc6-JoyInput-input")
      //   .should("have.value", "ya");

      // cy.get(".email").should("have.value", user.email);
    });
  });

  it("Edit username", () => {
    cy.get(".edit_profile_btn").click();
    cy.get(".username").clear().type("newusername");
    cy.get(".update_user_button").click();
    cy.get(".username").should("have.value", "newusername");
  });

  it("Change profile image", () => {
    cy.get(".change_profileImg_btn").click();

    const fileName = "example-image.jpg";
    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName,
        mimeType: "image/jpeg",
      });
    });
    cy.get(".update_user_button").click();
    cy.get(".profile_img")
      .should("have.attr", "src")
      .should("include", "example-image.jpg");
  });

  it("Logout user", () => {
    // cy.intercept("POST", "/api/logout", { statusCode: 200 });
    cy.get(".logout").click();
    cy.url().should("include", "http://localhost:3000");
  });
});
