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

  let createdPostId;
  describe('POST /api/social/createSocialPost', () => {

    test("should create a new post", async () => {
      const response = await request(app)
        .post("/api/social/createSocialPost")
        .send({
          "title": "This is test Title",
          "post_content": "this is test post content",
          "topic": "this is test post content",
          "customTopic": "this is test post content",
          "post_owner": "6557f2371c72d20d1def2748"
        })
        expect(response.statusCode).toBe(201);
        createdPostId = response.body._id;

    });
  });

  describe('GET /api/social/socialPosts', () => {

    test("should get all posts", async () => {
      const response = await request(app)
        .get("/api/social/socialPosts")

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);

    });
  });
  

  describe('GET /api/social/socialPost/:id', () => {

    test("should get a post with post id", async () => {
      const response = await request(app)
        .get(`/api/social/socialPost/${createdPostId}`)

      expect(response.statusCode).toBe(200);
    });
  });

  describe('Put /api/social/editSocialPost/:sPostId', () => {

    test("should update a post with post id", async () => {
      const response = await request(app)
        .put(`/api/social/editSocialPost/${createdPostId}`)
        .send({
          "title": "This is modified Title",
          "post_content": "this is modified post content",
          "topic": "this is modified post content",
          "customTopic": "this is modified post content",
        })

        expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /api/social/deleteSocialPost/:id', () => {

    test("should delete post with a post id", async () => {

      const response = await request(app)
      .delete(`/api/social/deleteSocialPost/${createdPostId}` )

      expect(response.statusCode).toBe(200);
    });
  });
});