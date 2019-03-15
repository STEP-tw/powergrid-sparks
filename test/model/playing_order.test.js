const chai = require("chai");
const Player = require("../../src/model/player");
const PlayingOrder = require("../../src/model/playing_order");

describe("getOrder", () => {
  const player1 = new Player("red", "A");
  const player2 = new Player("red", "B");
  const player3 = new Player("red", "C");
  player1.cities = 2;
  player2.cities = 1;
  player3.cities = 3;
  it("should rearrange playing order based number of cities player has", () => {
    const playingOrder = new PlayingOrder([player1, player2, player3]);
    const expectedOutput = [player3, player1, player2];
    const actualOutput = playingOrder.getOrder();
    chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
  });
});
