const chai = require("chai");
const Player = require("../../src/model/player");

describe("Player", () => {
  let player;
  beforeEach(() => {
    player = new Player("red", "ankon");
  });
  describe("addPowerplant", () => {
    it("should add given powerplant to player powerplants", () => {
      const powerplant = {
        value: 10,
        resource: { type: "Oil", quantity: 1 },
        city: 1
      };
      player.addPowerplant(powerplant);
      const actualOutput = player.powerplants;
      chai.expect(actualOutput).has.key("10");
    });
  });

  describe("removePowerplant", () => {
    it("should remove given powerplant from player powerplants", () => {
      const powerplant = {
        value: 10,
        resource: { type: "Oil", quantity: 1 },
        city: 1
      };
      player.addPowerplant(powerplant);
      player.removePowerplant(powerplant);
      const expectedOutput = player.powerplants;
      chai.expect(expectedOutput).does.not.have.key("10");
    });
  });

  describe("earnMoney", () => {
    it("should add money to player account", () => {
      player.earnMoney(100);
      const actualOutput = player.money;
      const expectedOutput = 150;
      chai.expect(actualOutput).to.be.equal(expectedOutput);
    });
  });

  describe("payMoney", () => {
    it("should add money to player account", () => {
      const payment = player.payMoney(25);
      chai.expect(payment).to.be.equal(true);
      chai.expect(player.money).to.be.equal(25);
    });

    it("should add money to player account", () => {
      const payment = player.payMoney(100);
      chai.expect(payment).to.be.equal(false);
      chai.expect(player.money).to.be.equal(50);
    });
  });
  
  describe("addResources", function() {
    it("should add the resources to player account", function() {
      player.addResources({
        Coal: "1_1",
        Oil: "2_2",
        Garbage: "3_2",
        Uranium: "14_0"
      });
      chai.assert.deepEqual(player.resources, {
        Coal: 1,
        Oil: 1,
        Garbage: 1,
        Uranium: 1
      });
    });

    describe("getResources", () => {
      it("should return the resources of a player", () => {
        player.addResources({
          Coal: "1_1",
          Oil: "2_2",
          Garbage: "3_2",
          Uranium: "14_0"
        });
        const expectedOutput = { Coal: 1,
        Oil: 1,
        Garbage: 1,
        Uranium: 1};
        chai.expect(player.getResources()).to.be.deep.equal(expectedOutput);
      });
    });
    
    describe("getPowerplants", () => {
      it("should return the powerplants of the player", () => {
        player.powerplants = {"3": {
          resource: {
            type: "Oil",
            quantity: 2
          },
          city: 1,
          inDeck: true
        }}
        const expectedOutput = { "3": {
          resource: {
            type: "Oil",
            quantity: 2
          },
          city: 1,
          inDeck: true
        }};
        chai.expect(player.getPowerplants()).to.be.deep.equal(expectedOutput);
      });
    });

    describe("getMoney", () => {
      it("should return the money of the player", () => {
        const expectedOutput = 50;
        chai.expect(player.getMoney()).to.be.deep.equal(expectedOutput);
      });
    });

    describe("getCityCount", () => {
      it("should return the no of cities of the player", () => {
        player.cities = 2
        const expectedOutput = 2;
        chai.expect(player.getCityCount()).to.be.deep.equal(expectedOutput);
      });
    });

    describe("addCityNames", () => {
      it("should add money to player account", () => {
        player.addCityNames(['',"miami", "san-fransisco"]);
        chai.expect(player.cityNames).to.be.deep.equal(["miami", "san-fransisco"]);
      });
    });

    describe("addCityNames", () => {
      it("should add money to player account", () => {
        player.addCityNames(['',"miami", "san-fransisco"]);
        chai.expect(player.cityNames).to.be.deep.equal(["miami", "san-fransisco"]);
      });
    });

    describe("addCityNames", () => {
      it("should add money to player account", () => {
        player.addCityNames(['',"miami", "san-fransisco"]);
        chai.expect(player.cityNames).to.be.deep.equal(["miami", "san-fransisco"]);
      });
    });

    describe("addCityNames", () => {
      it("should add money to player account", () => {
        player.addCityNames(['',"miami", "san-fransisco"]);
        chai.expect(player.cityNames).to.be.deep.equal(["miami", "san-fransisco"]);
      });
    });
  });
});
