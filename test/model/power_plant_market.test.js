const PowerPlantMarket = require("../../src/model/power_plant_cards");
const chai = require("chai");

describe("cards", function() {
  const cardDetails = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten"
  };

  const cards = new PowerPlantMarket(cardDetails);
  describe("cards.initializeMarket", function() {
    it("should return the first 8 cards", function() {
      const expectedOutput = {
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight"
      };

      const actualOutput = cards.initializeMarket();
      chai.assert.deepEqual(actualOutput, expectedOutput);
    });
  });
});
