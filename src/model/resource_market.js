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
}

module.exports = ResourceMarket;
