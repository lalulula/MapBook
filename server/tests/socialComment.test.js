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

    let createdCommentId;
    describe('POST /api/socialComment/createSocialComment', () => {

        test("should create new comment", async () => {
            const response = await request(app)
            .post("/api/socialComment/createSocialComment")
            .send({
                "social_comment_content": "This is test Comment",
                "social_comment_owner": "6557f2371c72d20d1def2748",
                "social_post_id": "656e954fcce0942061313fce"
            })
            expect(response.statusCode).toBe(201);
            createdCommentId = response.body._id;
            
        });
    });

    describe('GET /api/socialComment/existingSocialComments', () => {

        test("should get all social comments", async () => {
            const response = await request(app)
            .get("/api/socialComment/existingSocialComments")
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);

        });
    });

    describe('GET /api/socialComment/:sCommentId', () => {

        test("should get social comment with comment id", async () => {
            const response = await request(app)
            .get(`/api/socialComment/${createdCommentId}`)
            expect(response.statusCode).toBe(200);

        });
    });

    
    describe('Put /api/socialComment/editSocialComment/:sPostId', () => {

        test("should update a comment with comment id", async () => {
        const response = await request(app)
            .put(`/api/socialComment/editSocialComment/${createdCommentId}`)
            .send({
                "social_comment_content": "This is modified Comment",
            })

            expect(response.statusCode).toBe(200);
        });
    });

    describe('DELETE /api/socialComment/deleteSocialComment/:id', () => {

        test("should delete comment with a comment id", async () => {

        const response = await request(app)
        .delete(`/api/socialComment/deleteSocialComment/${createdCommentId}` )

        expect(response.statusCode).toBe(200);
        });
    });


});