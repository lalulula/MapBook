const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

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
    request(app)
      .post("/api/auth/register")
      .expect("Content-Type", /json/)
      .send({
        username: "haneul",
        password: "haneul123"
      })
      .expect(201)
      .expect((res) => {
        res.body.data.length = 2;
        res.body.data[0].username = "jasson";
        res.body.data[1].username = "haneul";
      })
      .end((err, res) => {
        if (err) return err;
      });
  });

  test("PUT /api/auth/user", async () => {
    request(app)
      .post("/api/auth/user")
      .expect("Content-Type", /json/)
      .send({
        username: "jasson",
        password: "jasson123"
      })
      .expect(200)
      .expect((res) => {
        res.body.data[0].password = "jasson123";
      })
      .end((err, res) => {
        if (err) return err;
      });
  });
});