describe("Editing map", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/login");
        cy.get('input[placeholder="Username"]').type("sam");
        cy.get('input[placeholder="Password"]').type("Password123");

        cy.get(".login_btn").click();
        cy.url().should("eq", "http://localhost:3000/mainpage");
    });

    it("should navigate to mymaps and edit a map", () => {
        // Visit the page
        cy.visit("http://localhost:3000/mymap");
        cy.wait(2000);
        cy.get(".mymap_mappreview_container").eq(0).click();
        cy.wait(2000);
        cy.url().should("include", "/mapdetails");
        cy.wait(3000);
        cy.get(".social_edit_btn").click();
        cy.wait(2000);
        cy.url().should("include", "/editmap");
        cy.get('.addmapdata_left_sidebar input').eq(0).type("CYPRESS EDIT");
        cy.get('.addmapdata_left_sidebar textarea').eq(0).type("Test map description edited");
        cy.get('.Dropdown-control').eq(0).click();
        cy.get('.Dropdown-menu').contains("Health").click();
        cy.get('.Dropdown-control').eq(1).click();
        cy.get('.map_toolbar_container button').click({ force: true });
        cy.wait(2000);
        cy.get(".header_begin h4").eq(2).click();
        cy.wait(2000);
        cy.get(".mymaps_container").should('include', 'CYPRESS EDIT');
    });
});