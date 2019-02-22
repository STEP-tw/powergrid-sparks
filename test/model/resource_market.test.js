const chai = require("chai");
const ResourceMarket = require("../../src/model/resource_market");

describe("ResourceMarket", () => {
  let resource_market = {};
  beforeEach(() => {
    resource_market = new ResourceMarket();
  });
  describe("getResources", () => {
    it("should return the resources", () => {
      const actualOutput = resource_market.getResources();
      const expectedOutput = {
        Coal: {
          "1": {
            "0": true,
            "1": true,
            "2": true
          },
          "2": {
            "0": true,
            "1": true,
            "2": true
          },
          "3": {
            "0": true,
            "1": true,
            "2": true
          },
          "4": {
            "0": true,
            "1": true,
            "2": true
          },
          "5": {
            "0": true,
            "1": true,
            "2": true
          },
          "6": {
            "0": true,
            "1": true,
            "2": true
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Garbage: {
          "1": {
            "0": false,
            "1": false,
            "2": false
          },
          "2": {
            "0": false,
            "1": false,
            "2": false
          },
          "3": {
            "0": false,
            "1": false,
            "2": false
          },
          "4": {
            "0": false,
            "1": false,
            "2": false
          },
          "5": {
            "0": false,
            "1": false,
            "2": false
          },
          "6": {
            "0": false,
            "1": false,
            "2": false
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Oil: {
          "1": {
            "0": false,
            "1": false,
            "2": false
          },
          "2": {
            "0": false,
            "1": false,
            "2": false
          },
          "3": {
            "0": true,
            "1": true,
            "2": true
          },
          "4": {
            "0": true,
            "1": true,
            "2": true
          },
          "5": {
            "0": true,
            "1": true,
            "2": true
          },
          "6": {
            "0": true,
            "1": true,
            "2": true
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Uranium: {
          "1": {
            "0": false
          },
          "2": {
            "0": false
          },
          "3": {
            "0": false
          },
          "4": {
            "0": false
          },
          "5": {
            "0": false
          },
          "6": {
            "0": false
          },
          "7": {
            "0": false
          },
          "8": {
            "0": false
          },
          "10": {
            "0": false
          },
          "12": {
            "0": false
          },
          "14": {
            "0": true
          },
          "16": {
            "0": true
          }
        }
      };
      chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
    });
  });

  describe("updateResources", () => {
    it("should update the resources", () => {
      const resources = { Coal: "4_1", Oil: "", Garbage: "", Uranium: "" };
      resource_market.updateResources(resources);
      const actualOutput = resource_market;
      const expectedOutput = {
        Coal: {
          "1": {
            "0": true,
            "1": true,
            "2": true
          },
          "2": {
            "0": true,
            "1": true,
            "2": true
          },
          "3": {
            "0": true,
            "1": true,
            "2": true
          },
          "4": {
            "0": true,
            "1": false,
            "2": true
          },
          "5": {
            "0": true,
            "1": true,
            "2": true
          },
          "6": {
            "0": true,
            "1": true,
            "2": true
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Garbage: {
          "1": {
            "0": false,
            "1": false,
            "2": false
          },
          "2": {
            "0": false,
            "1": false,
            "2": false
          },
          "3": {
            "0": false,
            "1": false,
            "2": false
          },
          "4": {
            "0": false,
            "1": false,
            "2": false
          },
          "5": {
            "0": false,
            "1": false,
            "2": false
          },
          "6": {
            "0": false,
            "1": false,
            "2": false
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Oil: {
          "1": {
            "0": false,
            "1": false,
            "2": false
          },
          "2": {
            "0": false,
            "1": false,
            "2": false
          },
          "3": {
            "0": true,
            "1": true,
            "2": true
          },
          "4": {
            "0": true,
            "1": true,
            "2": true
          },
          "5": {
            "0": true,
            "1": true,
            "2": true
          },
          "6": {
            "0": true,
            "1": true,
            "2": true
          },
          "7": {
            "0": true,
            "1": true,
            "2": true
          },
          "8": {
            "0": true,
            "1": true,
            "2": true
          }
        },
        Uranium: {
          "1": {
            "0": false
          },
          "2": {
            "0": false
          },
          "3": {
            "0": false
          },
          "4": {
            "0": false
          },
          "5": {
            "0": false
          },
          "6": {
            "0": false
          },
          "7": {
            "0": false
          },
          "8": {
            "0": false
          },
          "10": {
            "0": false
          },
          "12": {
            "0": false
          },
          "14": {
            "0": true
          },
          "16": {
            "0": true
          }
        }
      };
    });
  });
});
