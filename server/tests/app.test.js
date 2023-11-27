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

  test("POST /api/auth/register", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "test",
        password: "test123"
      })
      .expect(500)
  });

  test("POST /api/auth/login", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({
        username: "test",
        password: "test123"
      })
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