import "cypress-file-upload";

describe("CreateMap-File Import Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Username"]').type("ct1");
    cy.get('input[placeholder="Password"]').type("Password123");

    cy.get(".login_btn").click();
    cy.url().should("eq", "http://localhost:3000/mainpage");
  });

  describe("API Test: Create a map", () => {
    it("should successfully create a map via API", () => {
      const fileName = "Server.geojson";

      cy.fixture(fileName).then((geoJsonContent) => {
        const geoJSONString = JSON.stringify(geoJsonContent);

        const geojsonFile = new File([geoJSONString], "Server.geojson", {
          type: "application/json",
        });

        cy.fixture("sample.jpg", null).then((imageContent) => {
          console.log(imageContent);
          var imgFile = new File([imageContent], "mapPreviewImg.png", {
            type: "image/png",
          }); // Blob 생성
          console.log("imgFile: ", imgFile);

          const formData = new FormData();
          formData.append("file", geojsonFile);
          formData.append("map_name", "Test Cypress");
          formData.append("topic", "Health");
          formData.append("is_visible", true);
          formData.append("user_id", "6580845b80f91d7411d3b11d");
          formData.append("map_description", "Test description");

          formData.append("mapPreviewImg", imgFile);

          formData.append("view_count", 1);

          console.log("formData", formData);

          cy.request({
            method: "POST",
            url: "http://localhost:3001/api/map/createMap",
            body: formData,
          }).then((response) => {
            expect(response.status).to.eq(201);
            console.log(
              "response.body: ",
              JSON.parse(
                String.fromCharCode.apply(null, new Uint8Array(response.body))
              )
            );
            expect(
              JSON.parse(
                String.fromCharCode.apply(null, new Uint8Array(response.body))
              )
            ).to.have.property("_id");
          });
        });
      });

      cy.visit("http://localhost:3000/mainpage");
    });
  });
});

// Define the request payload
// const geojsonData = JSON.stringify(geoJsonContent);
// console.log(geojsonData);

// const mapPayload = {
//   map_name: "Test Cypress",
//   topic: "Health",
//   is_visible: true,
//   user_id: "657f85f2d2dcca77a0d9524e",
//   map_description: "Test description",
//   mapPreviewImg:
//     "https://umbrellacreative.com.au/wp-content/uploads/2020/01/hide-the-pain-harold-why-you-should-not-use-stock-photos.jpg",
//   file: geojsonData,
//   view_count: 1,
// };
