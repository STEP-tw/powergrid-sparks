const request = require("supertest");
const app = require("../../app");
const Game = require("../../src/model/Game");
const Player = require("../../src/model/player");

describe("GET /", () => {
  it("should give the homepage with response code 200", done => {
    request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200, done);
  });

  it("should redirect to gameplay if valid cookie is set", done => {
    app.activeGames["3"] = new Game(2);
    app.cookies["123"] = "Ankon";
    request(app)
      .get("/")
      .set("Cookie", ["gameId=3;playerId=123"])
      .expect("Content-Type", /plain/)
      .expect(302, done);
  });

  it("should redirect to gameplay if valid cookie is set", done => {
    app.activeGames["3"] = new Game(0);
    app.cookies["123"] = "Ankon";
    request(app)
      .get("/")
      .set("Cookie", ["gameId=3;playerId=123"])
      .expect("Content-Type", /plain/)
      .expect(302, done);
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
      .expect("Content-Type", /plain/)
      .expect(302, done);
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

describe("GET /invalidGameId", () => {
  it("should show the join page with error message", done => {
    request(app)
      .get("/invalidGameId")
      .expect(200, done);
  });
});

describe("GET /currentPlayer", () => {
  it("should return response code 200 if cookie is present", done => {
    app.activeGames["5"] = new Game(2);
    app.cookies["1234"] = "Ankon";
    request(app)
      .get("/currentPlayer")
      .set("Cookie", ["gameId=5;playerId=1234"])
      .expect(200, done);
  });
});

describe("GET /updateCurrentPlayer", () => {
  it("should return response code 200 if cookie is present", done => {
    app.activeGames["5"] = new Game(2);
    app.cookies["1234"] = "Ankon";
    request(app)
      .get("/updateCurrentPlayer")
      .set("Cookie", ["gameId=5;playerId=1234"])
      .expect(200, done);
  });
});

describe("GET /getPowerplantDetails", () => {
  it("should give player powerplants details", done => {
    app.activeGames["5"] = new Game(3);
    app.cookies["2468"] = "Ankon";
    request(app)
      .get("/getPowerplantDetails")
      .set("Cookie", ["gameId=5;playerId=2468"])
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("POST /buyPowerplant", () => {
  it("should add powerplant details to current player", done => {
    app.activeGames["10"] = new Game(3);
    app.cookies["1111"] = "Ankon";
    const player = new Player("red", "Ankon");
    app.activeGames[10].addPlayer(player);
    request(app)
      .post("/buyPowerplant")
      .send("price=10")
      .set("Cookie", ["gameId=10;playerId=2468"])
      .expect(200, done);
  });
});

describe("POST /buyResources", function() {
  it("should return code 200 if rsource data is registered succesfully", done => {
    const player1 = new Player("green", "naman");
    app.activeGames["5"] = new Game(2);
    app.activeGames["5"].addPlayer(player1);
    app.cookies["1234"] = "Ankon";
    request(app)
      .post("/buyResources")
      .set("Cookie", ["gameId=5;playerId=1234"])
      .send("Coal=1&Uranium=1&Oil=1&Garbage=1")
      .expect(200, done);
  });
});
