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


  let createdCommentId;
  describe('POST /api/socialComment/createSocialComment', () => {

      test("should create new comment", async () => {
          const response = await request(app)
          .post("/api/socialComment/createSocialComment")
          .send({
              "social_comment_content": "This is test Comment",
              "social_comment_owner": "6557f2371c72d20d1def2748",
              "social_post_id": createdPostId
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

  let createdReplyId;
  describe('POST /api/socialCommentReply/createSocialPostReply', () => {
      test("should create new social comment reply", async () => {
          const response = await request(app)
          .post("/api/socialCommentReply/createSocialPostReply")
          .send({
              "social_reply_content": "This is test reply",
              "social_reply_owner": "6557f2a91c72d20d1def274e",
              "social_comment_id": createdCommentId 
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


  describe('DELETE /api/socialComment/deleteSocialComment/:id', () => {

      test("should delete comment with a comment id", async () => {

      const response = await request(app)
      .delete(`/api/socialComment/deleteSocialComment/${createdCommentId}` )

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