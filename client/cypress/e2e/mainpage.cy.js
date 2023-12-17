import "cypress-file-upload";
describe("MainPage Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("ya");
    cy.get('input[placeholder="Password"]').type("Password123");

    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });

  // it("displays Trending Maps section", () => {
  //   cy.get(".mainpage_trending_header").should("be.visible");
  //   cy.get(".mainpage_trending_subheader").should("be.visible");
  // });

  // it("displays Search Bar and Filter Dropdown", () => {
  //   cy.get(".search_wrapper").should("be.visible");
  //   cy.get(".mainpage_search_filter_dropdown").should("be.visible");
  // });

  // it("displays maps and handles deletion", () => {
  //   // Create a map before deleteing one
  //   cy.visit("http://localhost:3000/createmap");

  //   cy.wait(2000);
  //   // Click the element with class "cypress_click"
  //   cy.get(".cypress_click").click();

  //   // Upload a file using the file input
  //   const fileName = "north_america.json";
  //   cy.fixture(fileName).then((fileContent) => {
  //     cy.get('input[type="file"]').attachFile({
  //       fileContent: fileContent,
  //       fileName: fileName,
  //       mimeType: "application/json",
  //     });
  //   });

  //   cy.get(".cypress_click_create").click();

  //   cy.url().should("include", "/createmap");

  //   cy.get(".addmapdata_left_sidebar input")
  //     .eq(0)
  //     .type("Creating CypressMap to delete");
  //   cy.get(".addmapdata_left_sidebar textarea")
  //     .eq(0)
  //     .type("Test map description");
  //   cy.get(".Dropdown-control").eq(0).click();
  //   cy.get(".Dropdown-menu").contains("Economy").click();
  //   cy.get(".Dropdown-control").eq(1).click();
  //   cy.get(".Dropdown-menu").contains("Circle Map").click();
  //   cy.get(".map_toolbar_container button").click({ force: true });

  //   cy.wait(2000);
  //   cy.url().should("eq", "http://localhost:3000/mainpage");

  //   // Delete
  //   cy.get(".mainpage_maps_container").should("be.visible");

  //   cy.get('input[placeholder="Search Maps"]').type("CypressMap");
  //   cy.get(".mainpage_maps .mainpage_mappreview_container")
  //     .should("have.length.greaterThan", 0)
  //     .first()
  //     .find(".bi.bi-three-dots-vertical")
  //     .should("be.visible")
  //     .click();

  //   cy.get(".mappreview_options_menu")
  //     .find(".mappreview_delete_option")
  //     .should("be.visible")
  //     .click();

  //   cy.get(".mappreview_delete_confirmation_modal").should("be.visible");
  //   cy.get(".mappreview_delete_confirm").click();

  //   cy.get(".mainpage_maps .mainpage_mappreview_container").should(
  // ch Maps"]').type("InvalidSearchTerm");
  //   cy.get(".mainpage_maps_no_search_container").should("be.visible");
  //   cy.get(".mainpage_maps_no_search h1").should(
  //     "contain.text",
  //     "No search results for 'InvalidSearchTerm'"
  //   );
  // });
  it("handles showing map details", () => {
    cy.get(".mainpage_maps .mainpage_mappreview_container").last().click();
  });
});
