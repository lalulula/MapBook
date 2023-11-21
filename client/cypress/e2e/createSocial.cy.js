// describe("CreateSocialPost Component", () => {
//   beforeEach(() => {
//     // Assuming your React app is running at http://localhost:3000
//     cy.visit("http://localhost:3000/createsocialpost");
//   });

//   it("should create a social post using UI", () => {
//     // Assuming your elements have specific class names
//     cy.get('.create_social_post_container_inner input[name="title"]').type(
//       "Test Title"
//     );
//     cy.get('.social_post_description textarea[name="post_content"]').type(
//       "Test Description"
//     );

//     // Click on the dropdown to open it
//     cy.get(".Dropdown-control").click();

//     // Select a topic from the dropdown
//     cy.get(".Dropdown-placeholder").contains("Economy").click();

//     // Click on the Post button
//     cy.get(".social_post_button").click();

//     // Assuming the navigation takes some time, wait for the destination page to load
//     cy.url().should("include", "/socialpage");
//   });
// });

// describe("CreateSocialPost API Test", () => {
//   it("should create a social post using API", () => {
//     // Assuming you have set up a test API endpoint for social post creation
//     cy.intercept("POST", "/api/social/posts").as("createPost");

//     // Make a request to your component's URL (assuming it's http://localhost:3000)
//     cy.visit("http://localhost:3000/createsocialpost");
//     // Assuming your elements have specific class names
//     cy.get('.create_social_post_container_inner input[name="title"]').type(
//       "Test Title"
//     );
//     cy.get('.social_post_description textarea[name="post_content"]').type(
//       "Test Description"
//     );

//     // // Upload an image (assuming you have set data-testid for the image input)
//     // cy.fixture("example-image.jpg").then((fileContent) => {
//     //   cy.get('[data-testid="image-upload"]').attachFile({
//     //     fileContent: fileContent.toString(),
//     //     fileName: "example-image.jpg",
//     //     mimeType: "image/jpeg",
//     //   });
//     // });

//     // Select a topic from the dropdown
//     cy.get('[data-testid="topic-dropdown"]').select("Economy");

//     // Click on the Post button
//     cy.get('[data-testid="post-button"]').click();

//     // Wait for the API request to complete
//     cy.wait("@createPost").then((interception) => {
//       // Check if the API request was successful
//       expect(interception.response.statusCode).to.eq(200);

//       // Assuming the navigation takes some time, wait for the destination page to load
//       cy.url().should("include", "/socialpage");
//     });
//   });
// });
