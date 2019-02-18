const request = require("supertest");
const app = require("../../app");
const Game = require("../../src/model/Game");

describe("GET /", () => {
  it("should give the homepage with response code 200", done => {
    request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200, done);
  });
});

describe("POST /createGame", () => {
  it("should give the waiting page with response code 200", done => {
    request(app)
      .post("/createGame")
      .send({ body: "chandan" })
      .expect("Content-Type", /plain/)
      .expect(302, done);
  });
});

describe("POST /joinGame", () => {
  it("should redirect to the homepage if id is incorrect", done => {
    app.activeGames["2"] = new Game(2);
    request(app)
      .post("/joinGame")
      .send("username=chandan&gameId=1")
      .expect("Content-Type", /plain/)
      .expect(302, done);
  });

  it("should give the waiting page with response code 200 if the id is correct", done => {
    request(app)
      .post("/joinGame")
      .send("username=chandan&gameId=2")
      .expect("Content-Type", /html/)
      .expect(200, done);
  });

  it("should show that the game has started if game is already active", done => {
    app.activeGames["2"] = new Game(2);
    app.activeGames["2"].start();
    request(app)
      .post("/joinGame")
      .send("username=chandan&gameId=2")
      .expect("Content-Type", /html/)
      .expect(200, done);
  });
});

describe("GET /createGame", () => {
  it("should give the waiting page with response code 200", done => {
    app.activeGames["2"] = new Game(1);
    request(app)
      .get("/createGame?gameId=2")
      .expect(200, done);
  });

  it("should give to the gameplay page if max player has joined", done => {
    app.activeGames["2"] = new Game(0);
    request(app)
      .get("/createGame?gameId=2")
      .expect(200, done);
  });
});

describe("GET /gameplay", () => {
  it("should show the gameplay page with response code 200", done => {
    app.activeGames["2"] = new Game(0);
    request(app)
      .get("/gameplay?gameId=2")
      .expect(200, done);
  });
});

describe("GET /displayPowerPlantMarket", () => {
  it("should return the powerPlants with status code 200", done => {
    request(app)
      .get("/displayPowerPlantMarket")
      .expect("Content-Type", /html/)
      .expect(200, done);
  });
});

describe("GET /waitingPage", () => {
  it("should show the waiting page with response code 200", done => {
    app.activeGames["2"] = new Game(2);
    request(app)
      .get("/waitingPage?gameId=2")
      .expect(200, done);
  });
});
