const PowerPlantMarket = require('../../src/model/power_plant_cards');
const chai = require('chai');
const sinon = require('sinon');

describe('cards', function() {
  const cardDetails = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten'
  };

  const cards = new PowerPlantMarket(cardDetails);
  describe('cards.initializeMarket', function() {
    it('should return the first 8 cards', function() {
      const expectedOutput = {
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
        6: 'six',
        7: 'seven',
        8: 'eight'
      };

      const actualOutput = cards.initializeMarket();
      chai.assert.deepEqual(actualOutput, expectedOutput);
    });
  });

  describe('suffleDeck', () => {
    it('should shuffle the deck', () => {
      const expectedOutput = ['10', '9'];
      const shuffler = sinon.stub();
      shuffler.onFirstCall().returns(['10', '9']);
      cards.shuffleDeck(shuffler);
      const actualOutput = cards.deck;
      chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
    });
  });

  describe('removePowerPlant', () => {
    it('should remove given powerplant from the current market', () => {
      const expectedOutput = ['1', '2', '4', '5', '6', '7', '8'];
      cards.removePowerPlant('3');
      const actualOutput = cards.currentMarket;
      chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
    });
  });

  describe('getCurrentMarket', () => {
    it('should remove given powerplant from the current market', () => {
      const expectedOutput = {
        1: 'one',
        2: 'two',
        4: 'four',
        5: 'five',
        6: 'six',
        7: 'seven',
        8: 'eight',
        10: 'ten'
      };
      const actualOutput = cards.getCurrentMarket();
      chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
    });
  });
});
