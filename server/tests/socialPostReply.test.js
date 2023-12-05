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

    let createdReplyId;
    describe('POST /api/socialCommentReply/createSocialPostReply', () => {
        test("should create new social comment reply", async () => {
            const response = await request(app)
            .post("/api/socialCommentReply/createSocialPostReply")
            .send({
                "social_reply_content": "This is test reply",
                "social_reply_owner": "6557f2a91c72d20d1def274e",
                "social_comment_id": "65681137775739fc3164dae7"
            })
            expect(response.statusCode).toBe(201);
            createdReplyId = response.body._id;
        });
    });


    describe('GET /api/socialCommentReply/existingSocialPostReplies', () => {

        test("should get all social replies", async () => {
            const response = await request(app)
            .get("/api/socialCommentReply/existingSocialPostReplies")

            expect(response.statusCode).toBe(200);
        });
    });

    describe('GET /api/socialCommentReply/:sPostReplyId', () => {

        test("should get social reply with reply id", async () => {
            const response = await request(app)
            .get(`/api/socialCommentReply/${createdReplyId}`)
            expect(response.statusCode).toBe(200);

        });
    });

    
    describe('Put /api/socialCommentReply/editSocialComment/:sPostReplyId', () => {

        test("should update a comment with comment id", async () => {
        const response = await request(app)
            .put(`/api/socialCommentReply/editSocialPostReply/${createdReplyId}`)
            .send({
                "social_reply_content": "This is modified test reply",

            })

            expect(response.statusCode).toBe(200);
        });
    });

    describe('DELETE /api/socialCommentReply/deleteSocialComment/:sPostReplyId', () => {

        test("should delete comment with a comment id", async () => {

        const response = await request(app)
        .delete(`/api/socialCommentReply/deleteSocialPostReply/${createdReplyId}` )

        expect(response.statusCode).toBe(200);
        });
    });


});