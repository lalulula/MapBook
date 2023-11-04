const request = require("supertest");

const app = require("../app");

jest.useFakeTimers()

describe("Test example", () => {
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
});