const chai = require("chai");
const sinon = require("sinon");
const Game = require("../../src/model/Game");
const Player = require("../../src/model/player");
const PowerPlantMarket = require("../../src/model/power_plant_cards");
const playingOrder = require("../../src/model/playing_order");

describe("Game", () => {
  let game;
  beforeEach(() => {
    game = new Game(6);
  });
  describe("addPlayer", () => {
    it("should return empty list if initially", () => {
      const expectedOutput = [];
      const actualOutput = game.players;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it("should add player to players list", () => {
      game.addPlayer("ankon");
      const expectedOutput = ["ankon"];
      const actualOutput = game.players;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("hasStarted", () => {
    it("should return false initially", () => {
      const expectedOutput = false;
      const actualOutput = game.hasStarted();
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("start", () => {
    it("should start the game", () => {
      game.start();
      const expectedOutput = true;
      const actualOutput = game.active;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getPlayers", () => {
    it("should return empty array initially", () => {
      const expectedOutput = [];
      const actualOutput = game.getPlayers();
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getCurrentPlayersCount", () => {
    it("should return 0 initially", () => {
      const expectedOutput = 0;
      const actualOutput = game.getCurrentPlayersCount();
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("setPlayingOrder", () => {
    it("should change the playing order", () => {
      const playersOrder = new playingOrder(game.players);
      const expectedOutput = game.player;
      const actualOutput = game.player;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getMaxPlayersCount", () => {
    it("should return 6 initially", () => {
      const expectedOutput = 6;
      const actualOutput = game.getMaxPlayersCount();
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getPlayerColor", () => {
    it("It should return a color", () => {
      const actualOutput = game.getPlayerColor();
      const expectedOutput = "gd55a11d1";
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("decideOrder", () => {
    it("should decide the random order of players", () => {
      game.decideOrder(() => {});
      const actualOutput = game.isShuffled;
      const expectedOutput = true;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it("should give the shuffled order", () => {
      const shuffler = sinon.stub();
      shuffler.onFirstCall().returns(["chandan", "ankon", "gaurav"]);
      game.decideOrder(shuffler);
      const expectedOutput = ["chandan", "ankon", "gaurav"];
      const actualOutput = game.players;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getTurn", () => {
    it("should create a turn if the game doesnt have a turn", () => {
      const player1 = new Player("green", "leela");
      const player2 = new Player("blue", "ankon");
      const players = [player1, player2];
      const actualOutput = game.getTurn(players);
      game.resetTurn();
      const expectedOutput = { players, currentPlayerIndex: 0 };
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it("should create a turn if the game doesnt have a turn", () => {
      const player1 = new Player("green", "leela");
      const player2 = new Player("blue", "ankon");
      const players = [player1, player2];
      game.getTurn(players);
      game.turn.updateCurrentPlayer();
      const actualOutput = game.getTurn(players);
      const expectedOutput = { players, currentPlayerIndex: 1 };
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getCurrentBid", () => {
    it("should return the current bid a,ount", () => {
      const player1 = new Player("green", "leela");
      const player2 = new Player("blue", "ankon");
      const players = [player1, player2];
      const powerPlantMarket = new PowerPlantMarket({
        "13": {
          resource: { type: "Oil", quantity: 2 },
          city: 1,
          inDeck: true,
          isSelected: false
        },
        "19": {
          resource: { type: "Garbage", quantity: 1 },
          city: 3,
          inDeck: true,
          isSelected: false
        }
      });
      game.powerPlantMarket = powerPlantMarket;
      game.conductAuction("13");
      const actualOutput = game.getCurrentBid();
      chai.expect("13").to.be.deep.equal(actualOutput);
    });
  });

  describe("getResourceMarket", () => {
    it("should create a resource market if the game doesn't have a resource market", () => {
      const actualOutput = game.getResourceMarket();
      const expectedOutput = {
        Coal: {
          "1": {
            "0": true,
            "1": true,
            "2": true
          },
          "2": {
            "0": true,
            "1": true,
            "2": true
          },
          "3": {
            "0": true,
            "1": true,
            "2": true
          },
          "4": {
            "0": true,
            "1": true,
            "2": true
          },
          "5": {
            "0": true,
            "1": true,
            "2": true
          },
          "6": {
            "0": true,
            "1": true,
            "2": true
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Garbage: {
          "1": {
            "0": false,
            "1": false,
            "2": false
          },
          "2": {
            "0": false,
            "1": false,
            "2": false
          },
          "3": {
            "0": false,
            "1": false,
            "2": false
          },
          "4": {
            "0": false,
            "1": false,
            "2": false
          },
          "5": {
            "0": false,
            "1": false,
            "2": false
          },
          "6": {
            "0": false,
            "1": false,
            "2": false
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Oil: {
          "1": {
            "0": false,
            "1": false,
            "2": false
          },
          "2": {
            "0": false,
            "1": false,
            "2": false
          },
          "3": {
            "0": true,
            "1": true,
            "2": true
          },
          "4": {
            "0": true,
            "1": true,
            "2": true
          },
          "5": {
            "0": true,
            "1": true,
            "2": true
          },
          "6": {
            "0": true,
            "1": true,
            "2": true
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Uranium: {
          "1": {
            "0": false
          },
          "2": {
            "0": false
          },
          "3": {
            "0": false
          },
          "4": {
            "0": false
          },
          "5": {
            "0": false
          },
          "6": {
            "0": false
          },
          "7": {
            "0": false
          },
          "8": {
            "0": false
          },
          "10": {
            "0": false
          },
          "12": {
            "0": false
          },
          "14": {
            "0": true
          },
          "16": {
            "0": true
          }
        }
      };
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it("shouldn't create a resource market if the game already have it", () => {
      game.getResourceMarket();
      const actualOutput = game.getResourceMarket();

      const expectedOutput = {
        Coal: {
          "1": {
            "0": true,
            "1": true,
            "2": true
          },
          "2": {
            "0": true,
            "1": true,
            "2": true
          },
          "3": {
            "0": true,
            "1": true,
            "2": true
          },
          "4": {
            "0": true,
            "1": true,
            "2": true
          },
          "5": {
            "0": true,
            "1": true,
            "2": true
          },
          "6": {
            "0": true,
            "1": true,
            "2": true
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Garbage: {
          "1": {
            "0": false,
            "1": false,
            "2": false
          },
          "2": {
            "0": false,
            "1": false,
            "2": false
          },
          "3": {
            "0": false,
            "1": false,
            "2": false
          },
          "4": {
            "0": false,
            "1": false,
            "2": false
          },
          "5": {
            "0": false,
            "1": false,
            "2": false
          },
          "6": {
            "0": false,
            "1": false,
            "2": false
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Oil: {
          "1": {
            "0": false,
            "1": false,
            "2": false
          },
          "2": {
            "0": false,
            "1": false,
            "2": false
          },
          "3": {
            "0": true,
            "1": true,
            "2": true
          },
          "4": {
            "0": true,
            "1": true,
            "2": true
          },
          "5": {
            "0": true,
            "1": true,
            "2": true
          },
          "6": {
            "0": true,
            "1": true,
            "2": true
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Uranium: {
          "1": {
            "0": false
          },
          "2": {
            "0": false
          },
          "3": {
            "0": false
          },
          "4": {
            "0": false
          },
          "5": {
            "0": false
          },
          "6": {
            "0": false
          },
          "7": {
            "0": false
          },
          "8": {
            "0": false
          },
          "10": {
            "0": false
          },
          "12": {
            "0": false
          },
          "14": {
            "0": true
          },
          "16": {
            "0": true
          }
        }
      };

      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getPlayersOrder", function() {
    it("should return the playing order", function() {
      const actualOutput = game.getPlayersOrder();
      const expectedOutput = [];
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it("should return the playing order", function() {
      const powerPlantMarket = {
        cards: {
          "13": {
            resource: { type: "Oil", quantity: 2 },
            city: 1,
            inDeck: true,
            isSelected: false
          },
          "19": {
            resource: { type: "Garbage", quantity: 1 },
            city: 3,
            inDeck: true,
            isSelected: false
          }
        }
      };
      const player1 = new Player("red", "A");
      player1.id = 1;
      const player2 = new Player("green", "B");
      player2.id = 2;
      const player3 = new Player("yellow", "C");
      player3.id = 3;
      game.players = [player1, player2, player3];
      game.powerPlantMarket = powerPlantMarket;
      game.conductAuction("13");
      const actualOutput = game.getPlayersOrder();
      const expectedOutput = [2, 3, 1];
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it("should return the playing order", function() {
      const powerPlantMarket = new PowerPlantMarket({
        "13": {
          resource: { type: "Oil", quantity: 2 },
          city: 1,
          inDeck: true,
          isSelected: false
        },
        "19": {
          resource: { type: "Garbage", quantity: 1 },
          city: 3,
          inDeck: true,
          isSelected: false
        }
      });
      const player1 = new Player("red", "A");
      player1.id = 1;
      const player2 = new Player("green", "B");
      player2.id = 2;
      const player3 = new Player("yellow", "C");
      player3.id = 3;
      game.powerPlantMarket = powerPlantMarket;
      game.players = [player1, player2, player3];
      game.conductAuction("13");
      game.conductAuction("pass");
      game.conductAuction("pass");
      const actualOutput = game.getPlayersOrder();
      const expectedOutput = [2, 3];
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it("should return the playing order", function() {
      const powerPlantMarket = new PowerPlantMarket({
        "13": {
          resource: { type: "Oil", quantity: 2 },
          city: 1,
          inDeck: true,
          isSelected: false
        },
        "19": {
          resource: { type: "Garbage", quantity: 1 },
          city: 3,
          inDeck: true,
          isSelected: false
        }
      });
      const player1 = new Player("red", "A");
      player1.id = 1;
      const player2 = new Player("green", "B");
      player2.id = 2;
      const player3 = new Player("yellow", "C");
      player3.id = 3;
      game.powerPlantMarket = powerPlantMarket;
      game.players = [player1, player2, player3];
      game.conductAuction("13");
      game.conductAuction("pass");
      game.conductAuction("pass");
      const actualOutput = game.getPlayersOrder();
      const expectedOutput = [2, 3];
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it("should return the playing order", function() {
      const powerPlantMarket = new PowerPlantMarket({
        "13": {
          resource: { type: "Oil", quantity: 2 },
          city: 1,
          inDeck: true,
          isSelected: false
        },
        "19": {
          resource: { type: "Garbage", quantity: 1 },
          city: 3,
          inDeck: true,
          isSelected: false
        }
      });
      const game = new Game(2);
      const player1 = new Player("red", "A");
      player1.id = 1;
      const player2 = new Player("green", "B");
      player2.id = 2;
      game.powerPlantMarket = powerPlantMarket;
      game.players = [player1, player2];
      game.conductAuction("13");
      game.conductAuction("pass");
      game.conductAuction("19");
      const actualOutput = game.getPlayersOrder();
      const expectedOutput = [];
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getBidPlayers", function() {
    it("should return the players in the bidding", function() {
      const player1 = new Player("red", "A");
      player1.id = 1;
      const player2 = new Player("green", "B");
      player2.id = 2;
      const player3 = new Player("yellow", "C");
      player3.id = 3;
      game.players = [player1, player2, player3];
      const actualOutput = game.getBidPlayers();
      const expectedOutput = [1, 2, 3];
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it("should return the players in the bidding", function() {
      const player1 = new Player("red", "A");
      player1.id = 1;
      const player2 = new Player("green", "B");
      player2.id = 2;
      const player3 = new Player("yellow", "C");
      player3.id = 3;
      game.conductAuction("pass");
      game.players = [player1, player2, player3];
      const actualOutput = game.getBidPlayers();
      const expectedOutput = [];
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getAuctionPlayers", function() {
    it("should return the players in the bidding", function() {
      const player1 = new Player("red", "A");
      player1.id = 1;
      const player2 = new Player("green", "B");
      player2.id = 2;
      const player3 = new Player("yellow", "C");
      player3.id = 3;
      game.players = [player1, player2, player3];
      const actualOutput = game.getAuctionPlayers();
      const expectedOutput = [1, 2, 3];
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getAuctionPlayers", function() {
    it("should return the players in the bidding", function() {
      const player1 = new Player("red", "A");
      player1.id = 1;
      game.players = [player1];
      game.conductAuction("pass");
      game.conductAuction("pass");
      const actualOutput = game.getAuctionPlayers();
      const expectedOutput = [];
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("getPlayersOrder", function() {
    it("should return playing order of current players", function() {
      const player1 = new Player("red", "A");
      player1.id = 1;
      game.players = [];
      game.conductAuction("pass");
      game.conductAuction("pass");
      const actualOutput = game.getPlayersOrder();
      const expectedOutput = [];
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe("isAuctionOver", function() {
    it("should return false if the auction is not over", function() {
      const player1 = new Player("red", "A");
      const player2 = new Player("green", "B");
      player1.id = 1;
      player2.id = 2;
      game.players = [player1, player2];
      game.conductAuction("pass");

      const actualOutput = game.isAuctionOver();
      const expectedOutput = false;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it("should return true if the auction is  over", function() {
      game.players = [];
      game.conductAuction("pass");
      const actualOutput = game.isAuctionOver();
      const expectedOutput = true;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });
});
