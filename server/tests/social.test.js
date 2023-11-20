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

//   test("POST /api/social/createSocialPost", async () => {
//     await request(app)
//       .post("/api/social/createSocialPost")
//       .send({
//         "title": "This is test Title",
//         "post_content": "this is test post content",
//         "post_images": "this is test post content",
//         "topic": "this is test post content",
//         "customTopic": "this is test post content",
//         "post_owner": "6557f2371c72d20d1def2748"
//       })
//       .expect(200)
//   });

  
  test("POST /api/social/socialPosts", async () => {
    await request(app)
      .get("/api/social/socialPosts")
      .expect(200)
  });

  
  test("POST /api/social/socialPost", async () => {
    await request(app)
      .get("/api/social/socialPost/65sdfij1d49fecef9044e")
      .expect(404)
  });


  // test("PUT /api/users", async () => {
  //   await request(app)
  //     .post("/api/auth/user")
  //     .send({
  //       username: "jasson",
  //       password: "jasson123"
  //     })
  //     .expect(404)
  // });
});