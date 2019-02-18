const request = require("supertest");
const app = require("../../app");

describe("GET /", () => {
  it("should pass the test", done => {
    request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200, done);
  });
});

describe("POST /createGame", () => {
  it("behaviour", done => {
    request(app)
      .post("/createGame")
      .send({ body: "chandan" })
      .expect("Content-Type", /html/)
      .expect(200, done);
  });
});
