const chai = require("chai");
const { Auction, Bid } = require("../../src/model/auction");
const Player = require("../../src/model/player");

describe("Bid", () => {
  let bid;
  beforeEach(() => {
    bid = new Bid([{ name: "B" }, { name: "C" }, { name: "A" }], 10);
  });

  describe("makeBid", () => {
    it("should update the players if we pass the turn", () => {
      bid.makeBid("pass");
      chai
        .expect(bid.players)
        .to.be.an("array")
        .to.eql([{ name: "C" }, { name: "A" }]);
    });
  });

  describe("makeBid", () => {
    it("should update the current bid amount if it not pass", () => {
      bid.makeBid(13);
      chai.expect(bid.currentBidAmount).to.be.equal(13);
    });
  });
});

describe("Auction", () => {
  let auction;
  const player1 = new Player("red", "A");
  player1.id = 1;
  const player2 = new Player("green", "B");
  player2.id = 2;
  const player3 = new Player("yellow", "C");
  player3.id = 3;
  beforeEach(() => {
    auction = new Auction([player1, player2, player3], {
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
    });
  });

  describe("selectPowerplant", () => {
    it("should update the players if we pass the turn", () => {
      const expectedOutput = [
        {
          cities: 0,
          cityNames: [],
          color: "green",
          money: 50,
          name: "B",
          powerplants: {},
          id: 2,
          lightedCity: 0,
          resources: {
            Coal: 0,
            Garbage: 0,
            Oil: 0,
            Uranium: 0
          }
        },
        {
          cities: 0,
          cityNames: [],
          color: "yellow",
          money: 50,
          name: "C",
          id: 3,
          lightedCity: 0,
          powerplants: {},
          resources: {
            Coal: 0,
            Garbage: 0,
            Oil: 0,
            Uranium: 0
          }
        }
      ];
      auction.selectPowerPlant("","pass");
      const actualOutput = auction.players;
      chai
        .expect(actualOutput)
        .to.be.an("array")
        .to.eql(expectedOutput);
    });

    it("should start the auction if one selects powerplant", () => {
      auction.selectPowerPlant("13","13");
      const expectedOutput = {
        value: "13",
        resource: { type: "Oil", quantity: 2 },
        city: 1
      };
      const actualOutput = auction.selectedPowerPlant;
      chai.expect(actualOutput).to.be.eql(expectedOutput);
    });
  });

  describe("getPlayers", function() {
    it("should return the players currently present in the auction", function() {
      const actualOutput = auction.getPlayers();
      const expectedOutput = [1, 2, 3];
      chai.expect(actualOutput).to.be.eql(expectedOutput);
    });
  });

  describe("getBidPlayers", function() {
    it("should return the players present in the bid", function() {
      auction.start();
      const actualOutput = auction.getBidPlayers();
      const expectedOutput = [2, 3, 1];
      chai.expect(actualOutput).to.be.eql(expectedOutput);
    });
  });

  describe("isOnePlayer", function() {
    it("should return false if there is only one player", function() {
      const actualOutput = auction.isOnePlayer();
      const expectedOutput = false;
      chai.expect(actualOutput).to.be.eql(expectedOutput);
    });
  });

  describe("isBidDone", function() {
    it("should return false if bid is not done", function() {
      const actualOutput = auction.isBidDone();
      const expectedOutput = false;
      chai.expect(actualOutput).to.be.eql(expectedOutput);
    });
  });

  describe("continue", function() {
    it("should return auction details", function() {
      auction.start();
      auction.selectedPowerPlant = {
        value: "13",
        resource: { type: "Oil", quantity: 2 },
        city: 1
      };
      const actualOutput = auction.continue(14);
      const expectedOutput = { isBidOver: false, value: "13" };
      chai.expect(actualOutput).to.be.eql(expectedOutput);
    });

    it("should return auction details", function() {
      auction.start();
      auction.selectedPowerPlant = {
        value: "13",
        resource: { type: "Oil", quantity: 2 },
        city: 1
      };
      auction.continue("pass");
      const actualOutput = auction.continue("pass");
      const expectedOutput = { isBidOver: true, value: "13" };
      chai.expect(actualOutput).to.be.eql(expectedOutput);
    });

    describe("getOrder", function() {
      it("should return the playing order", function() {
        auction.start();
        const actualOutput = auction.getOrder();
        const expectedOutput = [2, 3, 1];
        chai.expect(actualOutput).to.be.eql(expectedOutput);
      });

      it("should return the playing order", function() {
        auction.start();
        auction.selectedPowerPlant = {
          value: "13",
          resource: { type: "Oil", quantity: 2 },
          city: 1
        };
        auction.continue("pass");
        auction.continue("pass");
        const actualOutput = auction.getOrder();
        const expectedOutput = [2, 3];
        chai.expect(actualOutput).to.be.eql(expectedOutput);
      });
    });
  });

  describe("getCurrentBid", function() {
    it("should return the current bid", function() {
      const actualOutput = auction.getCurrentBid();
      const expectedOutput = undefined;
      chai.expect(actualOutput).to.be.eql(expectedOutput);
    });
  });

  describe("updatePlayer", function() {
    it("should update the playing order", function() {
      auction.updatePlayer();
      const actualOutput = auction.currentPlayer;
      const expectedOutput = {
        name: "B",
        resources: { Coal: 0, Garbage: 0, Uranium: 0, Oil: 0 },
        powerplants: {},
        money: 50,
        color: "green",
        cities: 0,
        lightedCity: 0,
        cityNames: [],
        id: 2
      };
      chai.expect(actualOutput).to.be.eql(expectedOutput);
    });
  });

  describe("getBidPlayers", function() {
    it("should update the playing order", function() {
      auction.getBidPlayers();
      const actualOutput = auction.getBidPlayers();
      const expectedOutput = [1, 2, 3];
      chai.expect(actualOutput).to.be.eql(expectedOutput);
    });
  });
});
