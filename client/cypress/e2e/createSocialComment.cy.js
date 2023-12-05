describe("SocialPostCommentRender Component", () => {
    const baseUrl = Cypress.env('https://mapbook-f381d1faf354.herokuapp.com/') || 'http://localhost:3000';
    const sampleSocialPostUrl = "socialpostdetails/655cbd12b9e4fe50471a0f83";

    it("Logins in sam, navigates to social page, and creates a comment", () => {
        // cy.visit("https://localhost:3000/login");
        cy.visit("http://localhost:3000/login");

        // Fill out the login form
        cy.get('input[placeholder="Username"]').type("sam");
        cy.get('input[placeholder="Password"]').type("Password123");
        //  Submit the form
        cy.get(".login_btn").click();
        // Ensure the registration was successful (you might need to assert the URL or page content)
        cy.url().should("eq", "http://localhost:3000/mainpage");

        // Navigate to social page
        cy.visit("http://localhost:3000/socialpage");

        // click the first social post
        cy.get('.social_post_preview_container').eq(0).click();

        //check if the proper social post was clicked
        cy.url().should("eq", "http://localhost:3000/socialpostdetails/655cbd12b9e4fe50471a0f83");

        cy.get('.show_post_comments').click();

        const sampleComment = 'This is a sample comment.';
        cy.get('#social_comment').type(sampleComment);

        cy.get('.social_comment_button').click();
        cy.wait(2000);
        cy.get('.social_comments_container').should('contain', sampleComment);
    });

    it("Logins in sam, navigates to social page, and deletes the comment just created", () => {
        cy.visit("http://localhost:3000/login");

        // Fill out the login form
        cy.get('input[placeholder="Username"]').type("sam");
        cy.get('input[placeholder="Password"]').type("Password123");
        //  Submit the form
        cy.get(".login_btn").click();
        cy.url().should("eq", "http://localhost:3000/mainpage");

        // Navigate to social page
        cy.visit("http://localhost:3000/socialpage");

        // click the first social post
        cy.get('.social_post_preview_container').eq(0).click();

        //check if the proper social post was clicked
        cy.url().should("eq", "http://localhost:3000/socialpostdetails/655cbd12b9e4fe50471a0f83");

        cy.get('.show_post_comments').click();

        const sampleComment = 'This is a sample comment.';
        cy.get('.social_comments_container').should('contain', sampleComment)

        cy.get('.delete_comment_btn').last().click();
        cy.get('.delete_comment_confirm').click();
        cy.wait(2000);

        cy.get('.social_comment').last().should('exist').invoke('text').should('not.include', sampleComment);
    });
})

// to make the test fail: create a comment with the text 'This is a sample comment.'