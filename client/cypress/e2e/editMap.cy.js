describe("Editing map", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/login");
        cy.get('input[placeholder="Username"]').type("sam");
        cy.get('input[placeholder="Password"]').type("Password123");

        cy.get(".login_btn").click();
        cy.url().should("eq", "http://localhost:3000/mainpage");
    });

    // it("should navigate to mymaps and edit a map", () => {
    //     // Visit the page
    //     cy.visit("http://localhost:3000/mymap");
    //     cy.wait(2000);
    //     cy.get('.mymap_mappreview_container:contains("DONT DELETE THIS TOO")').click();

    //     cy.wait(2000);
    //     cy.url().should("include", "/mapdetails");
    //     cy.wait(3000);
    //     cy.get(".social_edit_btn").click();
    //     cy.wait(2000);
    //     cy.url().should("include", "/editmap");
    //     cy.get('.addmapdata_left_sidebar input').eq(0).type("CYPRESS EDIT");
    //     cy.get('.addmapdata_left_sidebar textarea').eq(0).type("Test map description edited");
    //     cy.get('.Dropdown-control').eq(0).click();
    //     cy.get('.Dropdown-menu').contains("Health").click();
    //     cy.get('.Dropdown-control').eq(1).click();

    //     cy.get('.map_toolbar_container button').click({ force: true });
    //     cy.wait(3000);
    //     cy.get(".header_begin h4").eq(2).click();
    //     cy.wait(3000);
    //     cy.get(".mappreview_name_container").eq(0).should('contain', 'CYPRESS EDIT');
    // });

    // it("should leave an input empty and throw error message", () => {
    //     // Visit the page
    //     cy.visit("http://localhost:3000/mymap");
    //     cy.wait(2000);
    //     cy.get(".mymap_mappreview_container").eq(0).click();
    //     cy.wait(2000);
    //     cy.url().should("include", "/mapdetails");
    //     cy.wait(3000);
    //     cy.get(".social_edit_btn").click();
    //     cy.wait(2000);
    //     cy.url().should("include", "/editmap");
    //     cy.get('.addmapdata_left_sidebar input').eq(0).clear();
    //     cy.get('.map_toolbar_container button').click({ force: true });
    //     cy.wait(1000);
    //     cy.get(".createsocialpost_error_message").should('contain', "Please fill everything out!")
    // });
    it("should edit a map using the API method", () => {
        // Visit the page
        const fileName = "Server.geojson";

        cy.fixture(fileName).then((geoJsonContent) => {
            const geoJsonObjectFeatures = JSON.parse(geoJsonContent);
            for (var i = 0; i < geoJsonObjectFeatures.features.length; i++) {
                if (geoJsonObjectFeatures.features[i].properties.hasOwnProperty("mapbook_data")) {
                    const firstProperty = Object.keys(geoJsonObjectFeatures.features[i].properties.mapbook_data)[0];
                    geoJsonObjectFeatures.features[i].properties.mapbook_data[firstProperty] = 6969;
                }
            }

            const geoJSONString = JSON.stringify(geoJsonObjectFeatures);

            // const geoJSONString = JSON.stringify(geoJsonContent);
            console.log("JDFS: ", geoJSONString);


            const geojsonFile = new File([geoJSONString], "Server.geojson", {
                type: "application/json",
            });

            cy.fixture("sample.jpg", null).then((imageContent) => {
                console.log(imageContent);
                var imgFile = new File([imageContent], "mapPreviewImg.png", {
                    type: "image/png",
                }); // Blob 생성
                console.log("imgFile: ", imgFile);

                const mapPayload = {
                    map_name: "Test Cypress BLAH",
                    topic: "Health",
                    is_visible: true,
                    user_id: "657f85f2d2dcca77a0d9524e",
                    map_description: "Test description",
                    mapPreviewImg:
                        "https://umbrellacreative.com.au/wp-content/uploads/2020/01/hide-the-pain-harold-why-you-should-not-use-stock-photos.jpg",
                    file: geojsonFile,
                    view_count: 1,
                };

                cy.request({
                    method: "PUT",
                    url: "http://localhost:3001/api/maps/editMap/657fbbaf4eed8eb8e2d86963",
                    body: mapPayload,
                }).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body).to.have.property("_id");
                });
            });
        });
    });
});