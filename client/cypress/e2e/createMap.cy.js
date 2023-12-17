// export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const API_BASE_URL = process.env.REACT_APP_HOME_URL;
const filePath = "/Users/Samuel/Desktop/SBU Semester 7/cse416/MapBook/client/src/assets/test_files/Average Age of Marriage by State.geojson";

// import "cypress-file-upload";

// describe("CreateMap-File Import Page", () => {
//   beforeEach(() => {
//     cy.visit("http://localhost:3000/login");
//     cy.get('input[placeholder="Username"]').type("sam");
//     cy.get('input[placeholder="Password"]').type("Password123");

//     cy.get(".login_btn").click();
//     cy.url().should("eq", "http://localhost:3000/mainpage");
//   });

//   it("should import a file and create a map", () => {
//     // Visit the page
//     cy.visit("http://localhost:3000/createmap");

//     cy.wait(3000);
//     // Click the element with class "cypress_click"
//     cy.get(".cypress_click").click();

//     // Upload a file using the file input
//     const fileName = "north_america.json";
//     cy.fixture(fileName).then((fileContent) => {
//       cy.get('input[type="file"]').attachFile({
//         fileContent: fileContent,
//         fileName: fileName,
//         mimeType: "application/json",
//       });
//     });

//     cy.wait(2000);
//     cy.wait(2000);
//     cy.get(".cypress_click_create").click();

//     cy.url().should("include", "/createmap");

//     cy.get(".addmapdata_left_sidebar input").eq(0).type("Test Map (cypress)");
//     cy.get(".addmapdata_left_sidebar textarea")
//       .eq(0)
//       .type("Test map description");
//     cy.get(".Dropdown-control").eq(0).click();
//     cy.get(".Dropdown-menu").contains("Economy").click();
//     cy.get(".Dropdown-control").eq(1).click();
//     cy.get(".Dropdown-menu").contains("Circle Map").click();
//     cy.get(".map_toolbar_container button").click({ force: true });

//     cy.wait(2000);
//     cy.url().should("eq", "http://localhost:3000/mainpage");
//   });
// });


describe("API Test: Create a map", () => {
  it("should successfully create a map via API", () => {
    // You can add any necessary setup steps for authentication or other prerequisites

    let mapPayload = null;
    // Define the request payload
    cy.readFile(filePath).then((geoJsonContent) => {
      // Assign the JSON content to the file property in mapPayload
      mapPayload = {
        map_name: "Test map (cypress)",
        topic: "Health",
        is_visible: true,
        user_id: "655a62936afeccd8dd9366c1",
        map_description: "Test description",
        mapPreviewImg: "https://umbrellacreative.com.au/wp-content/uploads/2020/01/hide-the-pain-harold-why-you-should-not-use-stock-photos.jpg",
        file: geoJsonContent,
        view_count: 1,
      };
    });

    // Make a POST request to create a map
    cy.request({
      method: 'POST',
      url: "http://localhost:3001/api/map/createMap",
      body: mapPayload,
    }).then((response) => {
      // Assertions on the response
      expect(response.status).to.eq(201); // Assuming a successful creation returns a 201 status code
      expect(response.body).to.have.property('mapId');
    });

    // Optionally, you can check the created map on the UI
    cy.visit("http://localhost:3000/mainpage");

    // Add any UI assertions related to the created map
  });
});