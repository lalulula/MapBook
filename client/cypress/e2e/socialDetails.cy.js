const LOCALHOST = "http://localhost:3000";
const sampleSocialPostUrl = "socialpostdetails/657e6a430d5f991a81dda5ca";

describe("Social Details", () => {
  beforeEach(() => {
    cy.visit(`${LOCALHOST}/login`);
    // Fill out the login form
    cy.get('input[placeholder="Username"]').type("ct1");
    cy.get('input[placeholder="Password"]').type("Password123");
    //  Submit the form
    cy.get(".login_btn").click();
    cy.wait(1000);
    // Ensure the registration was successful (you might need to assert the URL or page content)
    cy.url().should("eq", `${LOCALHOST}/mainpage`);
  });

  it("Logins in ct1, navigates to social page, and creates a comment", () => {
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

  it("Logins in ct1, navigates to social page, and replies to the comment", () => {
    // Navigate to social page
    cy.visit(`${LOCALHOST}/socialpage`);

    // click the first social post
    cy.get(".social_post_preview_container").eq(0).click();

    cy.get(".show_post_comments").click();
    cy.get(".show_post_comments").click();
    cy.get(".show_post_comments").click();

    const sampleReply = "This is a sample reply.";
    cy.get(".reply_comment_btn").eq(0).click();
    cy.get(".reply_text_field textarea").type(sampleReply);
    cy.get(".post_reply_btn").click();
    cy.get(".social_comment_reply").eq(0).should("contain", sampleReply);
  });

  it("Logins in ct1, navigates to social page, and edits the comment and reply", () => {
    // Navigate to social page
    const sampleCommentEdit = "CYPRESS EDITED THIS COMEMNT";
    const sampleReplyEdit = "CYPRESS EDITED THIS REPLY";
    cy.visit(`${LOCALHOST}/socialpage`);

    // click the first social post
    cy.get(".social_post_preview_container").eq(0).click();

    cy.get(".show_post_comments").click();
    cy.get(".show_post_comments").click();
    cy.get(".show_post_comments").click();

    cy.get(".edit_comment_btn").eq(0).click();
    cy.get(".edit_comment_input").eq(0).type(sampleCommentEdit);
    cy.get(".save_comment_changes").click();

    cy.get(".social_comment_content")
      .eq(0)
      .should("contain", sampleCommentEdit);

    cy.get(".social_reply_dotted_menu").eq(0).click();
    cy.get(".edit_reply_btn").click();
    cy.get(".social_comment_reply_input").type(sampleReplyEdit);
    cy.get(".social_comment_replies_container").should(
      "contain",
      sampleReplyEdit
    );
  });

  it("Logins in ct1, navigates to social page, and delete the comment", () => {
    // Navigate to social page
    cy.visit(`${LOCALHOST}/socialpage`);

    // click the first social post
    cy.get(".social_post_preview_container").eq(0).click();

    cy.get(".show_post_comments").click();
    cy.get(".show_post_comments").click();
    cy.get(".show_post_comments").click();

    cy.get(".delete_comment_btn").eq(0).click();
    cy.get(".delete_comment_confirm").click();

    cy.get(".social_comment_header").should("not.exist");
  });
});
