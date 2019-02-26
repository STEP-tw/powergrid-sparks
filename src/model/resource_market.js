class Resource {
  constructor() {}

  update(resource) {
    resource.forEach(id => {
      if (id != "") {
        const cost = id.split("_")[0];
        const index = id.split("_")[1];
        this[cost][index] = false;
      }
    });
  }
}

class Coal extends Resource {
  constructor() {
    super();
    this["1"] = { 0: true, 1: true, 2: true };
    this["2"] = { 0: true, 1: true, 2: true };
    this["3"] = { 0: true, 1: true, 2: true };
    this["4"] = { 0: true, 1: true, 2: true };
    this["5"] = { 0: true, 1: true, 2: true };
    this["6"] = { 0: true, 1: true, 2: true };
    this["7"] = { 0: true, 1: true, 2: true };
    this["8"] = { 0: true, 1: true, 2: true };
  }
}

class Oil extends Resource {
  constructor() {
    super();
    this["1"] = { 0: false, 1: false, 2: false };
    this["2"] = { 0: false, 1: false, 2: false };
    this["3"] = { 0: true, 1: true, 2: true };
    this["4"] = { 0: true, 1: true, 2: true };
    this["5"] = { 0: true, 1: true, 2: true };
    this["6"] = { 0: true, 1: true, 2: true };
    this["7"] = { 0: true, 1: true, 2: true };
    this["8"] = { 0: true, 1: true, 2: true };
  }
}
class Garbage extends Resource {
  constructor() {
    super();
    this["1"] = { 0: false, 1: false, 2: false };
    this["2"] = { 0: false, 1: false, 2: false };
    this["3"] = { 0: false, 1: false, 2: false };
    this["4"] = { 0: false, 1: false, 2: false };
    this["5"] = { 0: false, 1: false, 2: false };
    this["6"] = { 0: false, 1: false, 2: false };
    this["7"] = { 0: true, 1: true, 2: true };
    this["8"] = { 0: true, 1: true, 2: true };
  }
}
class Uranium extends Resource {
  constructor() {
    super();
    this["1"] = { 0: false };
    this["2"] = { 0: false };
    this["3"] = { 0: false };
    this["4"] = { 0: false };
    this["5"] = { 0: false };
    this["6"] = { 0: false };
    this["7"] = { 0: false };
    this["8"] = { 0: false };
    this["10"] = { 0: false };
    this["12"] = { 0: false };
    this["14"] = { 0: true };
    this["16"] = { 0: true };
  }
}

class ResourceMarket {
  constructor() {
    this.Coal = new Coal();
    this.Uranium = new Uranium();
    this.Garbage = new Garbage();
    this.Oil = new Oil();
  }

  getResources() {
    return this;
  }

  updateResources(resources) {
    Object.keys(resources).forEach(resource => {
      this[resource].update(resources[resource].split(","));
    });
  }

  refill(refillCount, resource) {
    const costs = Object.keys(this[resource]).sort((x, y) => y - x);
    costs.forEach(cost => {
      Object.keys(this[resource][cost]).forEach(index => {
        let state = this[resource][cost][index];
        if (!state && refillCount) {
          this[resource][cost][index] = true;
          refillCount--;
        }
      });
    });
  }

  refillResourceStep1() {
    this.refill(7, "Coal");
    this.refill(5, "Oil");
    this.refill(3, "Garbage");
    this.refill(2, "Uranium");
  }
}

module.exports = ResourceMarket;
