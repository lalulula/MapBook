describe("MainPage Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("ya");
    cy.get('input[placeholder="Password"]').type("Password123");

    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });

  it("displays Trending Maps section", () => {
    cy.get(".mainpage_trending_header").should("be.visible");
    cy.get(".mainpage_trending_subheader").should("be.visible");
  });

  it("displays Search Bar and Filter Dropdown", () => {
    cy.get(".search_wrapper").should("be.visible");
    cy.get(".mainpage_search_filter_dropdown").should("be.visible");
  });

  it("displays maps and handles deletion", () => {
    // Or create a map before deleting one
    cy.get(".mainpage_maps_container").should("be.visible");

    cy.get('input[placeholder="Search Maps"]').type("data");
    cy.get(".mainpage_maps .mainpage_mappreview_container")
      .should("have.length.greaterThan", 0)
      .first()
      .find(".bi.bi-three-dots-vertical")
      .should("be.visible")
      .click();

    cy.get(".mappreview_options_menu")
      .find(".mappreview_delete_option")
      .should("be.visible")
      .click();

    cy.get(".mappreview_delete_confirmation_modal").should("be.visible");
    cy.get(".mappreview_delete_confirm").click();

    cy.get(".mainpage_maps .mainpage_mappreview_container").should(
      "have.length",
      0
    );
  });

  it("handles no search results gracefully", () => {
    cy.get('input[placeholder="Search Maps"]').type("InvalidSearchTerm");
    cy.get(".mainpage_maps_no_search_container").should("be.visible");
    cy.get(".mainpage_maps_no_search h1").should(
      "contain.text",
      "No search results for 'InvalidSearchTerm'"
    );
  });
});
