const LOCALHOST = "http://localhost:3000";
const sampleSocialPostUrl = "socialpostdetails/657e6a430d5f991a81dda5ca";

describe("Social Details", () => {
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

  it("Logins in sam, clicks the first map, and creates a comment", () => {
    // click the first social post
    // cy.get(".mainpage_mappreview_container").eq(0).click();
    cy.get('.mainpage_mappreview_container:contains("DONT DELETE THIS")').click();
    cy.wait(3000);

    cy.get(".show_map_comments").click();

    const sampleComment = "This is a sample comment.";
    cy.get("#map_comment").type(sampleComment);

    cy.get(".map_comment_button").click();
    cy.wait(1000);
    cy.get(".map_comments_container").should("contain", sampleComment);
  });

  it("Logins in sam, clicks on the first map, and replies to the comment", () => {
    // click the first social post
    // cy.get(".mainpage_mappreview_container").eq(0).click();
    cy.get('.mainpage_mappreview_container:contains("DONT DELETE THIS")').click();
    cy.wait(3000);

    cy.get(".show_map_comments").click();
    cy.get(".show_map_comments").click();
    cy.get(".show_map_comments").click();

    const sampleReply = "This is a sample reply.";
    cy.get(".reply_comment_btn").eq(0).click();
    cy.get(".reply_text_field textarea").type(sampleReply);
    cy.get(".post_reply_btn").click();
    cy.get(".map_comment_replies").eq(0).should('contain', sampleReply);
  });

  it("Logins in sam, clicks on the first map, and edits the comment and reply", () => {
    // Navigate to social page
    const sampleCommentEdit = "CYPRESS EDITED THIS COMEMNT";
    const sampleReplyEdit = "CYPRESS EDITED THIS REPLY";

    // click the first social post
    // cy.get(".mainpage_mappreview_container").eq(0).click();
    cy.get('.mainpage_mappreview_container:contains("DONT DELETE THIS")').click();
    cy.wait(3000);

    cy.get(".show_map_comments").click();
    cy.get(".show_map_comments").click();
    cy.get(".show_map_comments").click();

    cy.get(".edit_comment_btn").eq(0).click();
    cy.get(".edit_comment_input").eq(0).type(sampleCommentEdit);
    cy.get(".save_comment_changes").click();

    cy.get(".map_comment_content").eq(0).should('contain', sampleCommentEdit);

    cy.get(".map_reply_dotted_menu").eq(0).click();
    cy.get(".edit_reply_btn").click();
    cy.get(".map_comment_reply_input").type(sampleReplyEdit);
    cy.get(".map_comment_replies_container").should('contain', sampleReplyEdit);
  });

  it("Logins in sam, navigates to social page, and delete the comment", () => {
    // click the first social post
    // cy.get(".social_post_preview_container").eq(0).click();
    cy.get('.mainpage_mappreview_container:contains("DONT DELETE THIS")').click();
    cy.wait(3000);

    cy.get(".show_map_comments").click();
    cy.get(".show_map_comments").click();
    cy.get(".show_map_comments").click();

    cy.get(".delete_comment_btn").eq(0).click();
    cy.get(".mapcomments_delete_comment_confirm").click();

    cy.get(".map_comment_header").should('not.exist');
  });
});
