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
      chai.expect(player.powerplants).has.key("10");
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
      chai.expect(player.powerplants).does.not.have.key("10");
    });
  });

  describe("earnMoney", () => {
    it("should add money to player account", () => {
      player.earnMoney(100);
      chai.expect(player.money).to.be.equal(150);
    });
  });

  describe("payMoney", () => {
    it("should add money to player account", () => {
      const { payment } = player.payMoney(25);
      chai.expect(payment).to.be.equal("success");
      chai.expect(player.money).to.be.equal(25);
    });

    it("should add money to player account", () => {
      const { payment } = player.payMoney(100);
      chai.expect(payment).to.be.equal("fail");
      chai.expect(player.money).to.be.equal(50);
    });
  });
  describe("addResources", function() {
    it("should add the resources to player account", function() {
      player.addResources({ Coal: 1, Oil: 2, Garbage: 3, Uranium: 4 });
      chai.assert.deepEqual(player.resources, {
        Coal: 1,
        Oil: 2,
        Garbage: 3,
        Uranium: 4
      });
    });
  });
});
