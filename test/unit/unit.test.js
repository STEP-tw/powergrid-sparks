const sinon = require('sinon');
const chai = require('chai');
const {
  generateGameId
} = require('../../src/handlers');

describe('generateGameId', () => {
  it('should return gameId which is not in the list', () => {
    const Math = {
      random: sinon.stub()
    }
    Math.random.onFirstCall().returns(1);
    Math.random.onSecondCall().returns(2);
    const activeGames = { 1000: [] };
    chai.expect(generateGameId(activeGames, Math.random)).to.be.equal(2000);
  });
});