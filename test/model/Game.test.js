const chai = require('chai');
const Game = require('../../src/model/Game');

describe('Game', () => {
  let game;
  beforeEach(() => {
    game = new Game(6);
  })
  describe('addPlayer', () => {
    it('should return empty list if initially', () => {
      const expectedOutput = [];
      const actualOutput = game.players;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });

    it('should add player to players list', () => {
      game.addPlayer('ankon')
      const expectedOutput = ['ankon'];
      const actualOutput = game.players;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe('hasStarted', () => {
    it('should return false initially', () => {
      const expectedOutput = false;
      const actualOutput = game.hasStarted();
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe('start', () => {
    it('should start the game', () => {
      game.start();
      const expectedOutput = true;
      const actualOutput = game.active;
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe('getPlayers', () => {
    it('should return empty array initially', () => {
      const expectedOutput = [];
      const actualOutput = game.getPlayers();
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe('getCurrentPlayersCount', () => {
    it('should return 0 initially', () => {
      const expectedOutput = 0;
      const actualOutput = game.getCurrentPlayersCount();
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });

  describe('getMaxPlayersCount', () => {
    it('should return 6 initially', () => {
      const expectedOutput = 6;
      const actualOutput = game.getMaxPlayersCount();
      chai.expect(expectedOutput).to.be.deep.equal(actualOutput);
    });
  });
});