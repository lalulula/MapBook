describe("Guest Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.get(".landing_right").should("contain", "Map Book");
    cy.get(".landing_intro_3").scrollIntoView();
    cy.get("#animationContainer").click();
    cy.get(".custom-modal").should("be.visible");
    cy.get(".modal_content_guest").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });
  it("should continue as guest and prevent from clicking specific header(EX: My Maps)", () => {
    // Stub the window:alert event
    cy.on("window:alert", (str) => {
      expect(str).to.equal("You need to Register to continue!");
    });
    cy.get(".header_begin h4").contains("MyMaps").click();
  });
  it("should continue as guest and prevent from clicking specific header", () => {
    cy.get(".header_begin h4").contains("Social").click();
    cy.get(".socialpage_middle .social_post_preview_container")
      .first()
      .as("firstSocialPostPreview");

    cy.get("@firstSocialPostPreview").click();

    cy.get(".show_post_comments").click();
    cy.get(".social_comments_bottom").contains(
      "Please Login/Register to Comment"
    );
  });
});
