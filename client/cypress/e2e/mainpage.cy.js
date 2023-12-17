describe("MainPage Test", () => {
  beforeEach(() => {
    // Assuming you have a valid login. If not, adjust accordingly.
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("sam");
    cy.get('input[placeholder="Password"]').type("Password123");

    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });

  it("displays the Trending Maps section", () => {
    cy.get(".mainpage_trending_header").should("be.visible");
    cy.get(".mainpage_trending_subheader").should("be.visible");
    // Add more assertions based on your UI requirements
  });

  it("displays the Search Bar and Filter Dropdown", () => {
    cy.get(".search_wrapper").should("be.visible");
    cy.get(".mainpage_search_filter_dropdown").should("be.visible");
    // Add more assertions based on your UI requirements
  });

  it("displays maps and handles deletion", () => {
    // Assuming there are maps displayed on the page
    cy.get(".mainpage_maps_container").should("be.visible");

    // Perform searches and filter actions
    cy.get('input[placeholder="Search"]').type("YourSearchTerm");
    cy.get(".mainpage_search_filter_dropdown").select("Map Name");

    // Check if the maps are displayed after filtering
    cy.get(".mainpage_maps .mainpage_mappreview_container").should(
      "have.length.greaterThan",
      0
    );

    // Click on the delete button of the first map (assuming there is at least one map)
    cy.get(".mainpage_maps .mainpage_mappreview_container")
      .first()
      .find(".mappreview_delete_button")
      .click();

    // Confirm deletion
    cy.get(".mappreview_delete_confirmation_modal").should("be.visible");
    cy.get(".mappreview_delete_confirm").click();

    // Check if the map is removed from the list
    cy.get(".mainpage_maps .mainpage_mappreview_container").should(
      "have.length",
      0
    );
  });

  it("handles no search results gracefully", () => {
    cy.get('input[placeholder="Search"]').type("InvalidSearchTerm");
    cy.get(".mainpage_maps_no_search_container").should("be.visible");
    cy.get(".mainpage_maps_no_search h1").should(
      "contain.text",
      "No search results for 'InvalidSearchTerm'"
    );
  });
});
