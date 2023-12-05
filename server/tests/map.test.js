const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../server");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Test example", () => {

    // Give time to any async operation to complete after each test
    afterEach(async () => {
        await sleep(2000);
    });

    // Also close any pending connection (or related) if any
    afterAll(() => { 
        mongoose.connection.close()
    })

    let createdMapId;
    describe('POST /api/map/createMap', () => {
        test("should create new map", async () => {
            const response = await request(app)
            .post("/api/map/createMap")
            .send({
                "map_name": "This is test map",
                "topic": "test Topic",
                "is_visible": true,
                "user_id": "655fd58b2b0e9ff49fe19154",
                "map_description": "This is test map description"
            })
            expect(response.statusCode).toBe(201);
            createdMapId = response.body._id;
        });
    });

    
    describe('GET /api/maps/getMaps/:userId', () => {

        test("should get map by user id", async () => {
            const response = await request(app)
            .get(`/api/maps/getMaps/655fd58b2b0e9ff49fe19154`)
            expect(response.statusCode).toBe(200);

        });
    });

    describe('GET /api/maps/getMap/:mapId', () => {

        test("should get map by map id", async () => {
            const response = await request(app)
            .get(`/api/maps/getMaps/${createdMapId}`)
            expect(response.statusCode).toBe(200);

        });
    });

    describe('DELETE /api/maps/:id', () => {

        test("should delete map with a map id", async () => {

        const response = await request(app)
        .delete(`/api/maps/${createdMapId}` )

        expect(response.statusCode).toBe(200);
        });
    });

});