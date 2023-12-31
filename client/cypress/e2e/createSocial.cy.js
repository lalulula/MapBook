const LOCALHOST = "http://localhost:3000";
import "cypress-file-upload";

describe("CreateSocialPost Component", () => {
  beforeEach(() => {
    cy.visit(`${LOCALHOST}/login`);

    // Fill out the login form
    cy.get('input[placeholder="Username"]').type("ct1");
    cy.get('input[placeholder="Password"]').type("Password123");
    //  Submit the form
    cy.get(".login_btn").click();

    cy.url().should("eq", `${LOCALHOST}/mainpage`);
    cy.visit(`${LOCALHOST}/createsocialpost`);
  });

  it("should create a social post using UI", () => {
    // Assuming your elements have specific class names
    // Click on the dropdown to open it
    cy.get(".Dropdown-control").click();

    // Select a topic from the dropdown
    cy.get(".Dropdown-menu").contains("Economy").click();

    cy.get(".createsocialpost_title_input").type("Test Title");
    cy.get(".createsocialpost_description_textarea").type("Test Description");
    cy.get(".upload_label").click();
    const fileName = "YAprofiletest.jpg";
    cy.fixture(fileName, null).then((imageContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent: imageContent,
        fileName: fileName,
        mimeType: "image/jpeg",
      });
    });

    // Click on the Post button
    cy.get(".createsocialpost_submit").click();

    cy.wait(2000);

    // Assuming the navigation takes some time, wait for the destination page to load
    cy.url().should("eq", `${LOCALHOST}/socialpage`);
    cy.get(".socialpage_middle").should("contain", "Test Title");
  });
});

describe("CreateSocialPost API Test", () => {
  it("should create a social post using API", () => {
    cy.visit(`${LOCALHOST}/login`);

    // Fill out the login form
    cy.get('input[placeholder="Username"]').type("ct1");

    cy.get('input[placeholder="Password"]').type("Password123");
    //  Submit the form
    cy.get(".login_btn").click();

    cy.url().should("eq", `${LOCALHOST}/mainpage`);

    // Assuming you have set up a test API endpoint for social post creation
    cy.intercept("PUT", "/api/social/createSocialPost").as("createPost");

    // Make a request to your component's URL (assuming it's http://localhost:3000)
    cy.visit(`${LOCALHOST}/createsocialpost`);
    // Assuming your elements have specific class names
    cy.get('.createsocialpost_container_inner input[name="title"]').type(
      "Test Title API"
    );
    cy.get('.createsocialpost_description textarea[name="post_content"]').type(
      "Test Description"
    );

    // Select a topic from the dropdown
    cy.get(".Dropdown-control").click();

    cy.get(".Dropdown-menu").contains("Economy").click();
    // Click on the Post button
    cy.get(".createsocialpost_submit").click();

    // Wait for the API request to complete
    cy.wait("@createPost").then((interception) => {
      expect(interception.response.statusCode).to.eq(201);

      cy.url().should("include", `${LOCALHOST}/socialpage`);
    });
  });
});
