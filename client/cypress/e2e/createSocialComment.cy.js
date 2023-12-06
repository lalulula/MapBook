describe("SocialPostCommentRender Component", () => {
    //const baseUrl = Cypress.env('http://localhost:3000' || 'https://mapbook-f381d1faf354.herokuapp.com');
    //const baseUrl = 'http://localhost:3000';
    const baseUrl = 'https://mapbook-f381d1faf354.herokuapp.com';
    const sampleSocialPostUrl = "socialpostdetails/655cbd12b9e4fe50471a0f83";

    beforeEach(() => {
        cy.visit(`${baseUrl}/login`);

        // Fill out the login form
        cy.get('input[placeholder="Username"]').type("sam");
        cy.get('input[placeholder="Password"]').type("Password123");
        //  Submit the form
        cy.get(".login_btn").click();
        cy.wait(1000);
        // Ensure the registration was successful (you might need to assert the URL or page content)
        cy.url().should("eq", `${baseUrl}/mainpage`);
    });

    it("Logins in sam, navigates to social page, and creates a comment", () => {
        // Navigate to social page
        cy.visit(`${baseUrl}/socialpage`);

        // click the first social post
        cy.get('.social_post_preview_container').eq(0).click();

        //check if the proper social post was clicked
        cy.url().should("eq", `${baseUrl}/${sampleSocialPostUrl}`);

        cy.get('.show_post_comments').click();

        const sampleComment = 'This is a sample comment.';
        cy.get('#social_comment').type(sampleComment);

        cy.get('.social_comment_button').click();
        cy.wait(2000);
        cy.get('.social_comments_container').should('contain', sampleComment);
    });

    it("Logins in sam, navigates to social page, and deletes the comment just created", () => {
        // Navigate to social page
        cy.visit(`${baseUrl}/socialpage`);

        // click the first social post
        cy.get('.social_post_preview_container').eq(0).click();

        //check if the proper social post was clicked
        cy.url().should("eq", `${baseUrl}/${sampleSocialPostUrl}`);

        cy.get('.show_post_comments').click();
        cy.wait(1000);

        const sampleComment = 'This is a sample comment.';
        cy.get('.social_comments_container').should('contain', sampleComment)

        cy.get('.delete_comment_btn').last().click();
        cy.get('.delete_comment_confirm').click();
        cy.wait(2000);

        cy.get('.social_comment').last().should('exist').invoke('text').should('not.include', sampleComment);
    });
})

// to make the test fail: create a comment with the text 'This is a sample comment.'