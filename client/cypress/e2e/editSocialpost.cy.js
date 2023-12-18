describe("EditSocialPost Component", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("ct1");
    cy.get('input[placeholder="Password"]').type("Password123");
    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });

  it("should go to social page, click it, edit it and save it", () => {
    // Visit the page
    cy.get(".header_begin h4").eq(1).click();
    cy.wait(2000);
    cy.get(".MuiFormControlLabel-root").click();
    cy.get(".social_post_preview_container").eq(0).click();
    cy.url().should("include", "/socialpostdetails");
    cy.get(".social_edit_btn").click();
    cy.url().should("include", "/editsocialpost");
    cy.get(".editsocialpost_top input").clear();
    cy.get(".editsocialpost_top input").type("CYPRESS EDIT");
    cy.get(".Dropdown-control").click();
    cy.get(".Dropdown-menu").contains("Health").click();
    cy.get(".editsocialpost_description_textarea").type(" CYPRESS EDITED THIS");
    cy.get(".editsocialpost_submit").click();
    cy.wait(3000);
    cy.get(".socialpostdetails_top_left_title_container").should(
      "contain",
      "CYPRESS EDIT"
    );
  });

  it("should go to social page, click it, edit it and save it", () => {
    // Visit the page
    cy.get(".header_begin h4").eq(1).click();
    cy.wait(2000);
    cy.get(".MuiFormControlLabel-root").click();
    cy.get(".social_post_preview_container").eq(0).click();
    cy.url().should("include", "/socialpostdetails");
    cy.get(".social_edit_btn").click();
    cy.url().should("include", "/editsocialpost");
    cy.get(".editsocialpost_top input").clear();
    cy.get(".Dropdown-control").click();
    cy.get(".editsocialpost_submit").click();
    cy.wait(1000);
    cy.get(".createsocialpost_error_message").should(
      "contain",
      "Please fill everything out!"
    );
  });
});
