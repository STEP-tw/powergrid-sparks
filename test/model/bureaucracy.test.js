const chai = require("chai");
const Player = require("../../src/model/player");
const Bureaucracy = require("../../src/model/bureaucracy");

describe("Player", () => {
  let bureaucracy;
  let player;
  beforeEach(() => {
    player = new Player("red", "gaurav");
    bureaucracy = new Bureaucracy(player);
  });

  describe("validateCityCount", () => {
    it("should validate the city count of a player", () => {
      player.addCityNames(["miami", "san-fransisco"]);
      const expectedOutput = false;
      chai
        .expect(bureaucracy.validateCityCount(5))
        .to.be.deep.equal(expectedOutput);
    });
  });

  describe("setLightedCity", () => {
    it("should set the lighted city of player", () => {
      bureaucracy.setLightedCity(5);
      const expectedOutput = 5;
      chai.expect(player.lightedCity).to.be.deep.equal(expectedOutput);
    });
  });

  describe("payForLightedCities", () => {
    const paymentOrder = {
      "0": 10,
      "1": 22,
      "2": 33,
      "3": 44,
      "4": 54,
      "5": 64
    };
    it("should add the money to the players money according to their lighted cities", () => {
      bureaucracy.payForLightedCities(paymentOrder);
      const expectedOutput = 60;
      chai
        .expect(bureaucracy.player.getMoney())
        .to.be.deep.equal(expectedOutput);
    });
  });
});
