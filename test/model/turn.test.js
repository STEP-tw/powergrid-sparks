const Turn = require("../../src/model/turn");
const Player = require("../../src/model/player");
const chai = require("chai");

describe("Turn", () => {
  let turn = {};
  beforeEach(() => {
    const player1 = new Player("green", "leela");
    const player2 = new Player("blue", "ankon");
    const players = [player1, player2];
    turn = new Turn(players);
  });

  describe("getCurrentPlayer", () => {
    it("should give the current player", () => {
      const actualOutput = turn.getCurrentPlayer();
      const expectedOutput = new Player("green", "leela");
      chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
    });
  });

  describe("updateCurrentPlayer", () => {
    it("should update the current player index", () => {
      turn.updateCurrentPlayer();
      const actualOutput = turn.currentPlayerIndex;
      const expectedOutput = 1;
      chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
    });
  });
});
