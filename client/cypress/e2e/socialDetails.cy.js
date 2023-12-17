const LOCALHOST = "http://localhost:3000";
const sampleSocialPostUrl = "socialpostdetails/657e6a430d5f991a81dda5ca";

describe("Social Details", () => {
  //const baseUrl = Cypress.env('http://localhost:3000' || 'https://mapbook-f381d1faf354.herokuapp.com');
  //const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    cy.visit(`${LOCALHOST}/login`);
    // Fill out the login form
    cy.get('input[placeholder="Username"]').type("sam");
    cy.get('input[placeholder="Password"]').type("Password123");
    //  Submit the form
    cy.get(".login_btn").click();
    cy.wait(1000);
    // Ensure the registration was successful (you might need to assert the URL or page content)
    cy.url().should("eq", `${LOCALHOST}/mainpage`);
  });

  it("Logins in sam, navigates to social page, and creates a comment", () => {
    // Navigate to social page
    cy.visit(`${LOCALHOST}/socialpage`);

    // click the first social post
    cy.get(".social_post_preview_container").eq(0).click();

    cy.get(".show_post_comments").click();

    const sampleComment = "This is a sample comment.";
    cy.get("#social_comment").type(sampleComment);

    cy.get(".social_comment_button").click();
    cy.wait(2000);
    cy.get(".social_comments_container").should("contain", sampleComment);
  });
});
