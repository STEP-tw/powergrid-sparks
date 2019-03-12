class Player {
  constructor(color, name) {
    this.name = name;
    this.resources = { Coal: 0, Garbage: 0, Uranium: 0, Oil: 0 };
    this.powerplants = {};
    this.money = 50;
    this.color = color;
    this.cities = 0;
    this.cityNames = [];
    this.lightedCity = 0;
  }

  getName() {
    return this.name;
  }

  getLightedCity() {
    return this.lightedCity;
  }

  getResources() {
    return this.resources;
  }

  getPowerplants() {
    return this.powerplants;
  }

  getMoney() {
    return this.money;
  }

  getCityCount() {
    return this.cities;
  }

  setId(id) {
    this.id = id;
  }

  addPowerplant({ value, resource, city }) {
    this.powerplants[value] = { resource, city };
  }

  removePowerplant(powerplant) {
    delete this.powerplants[powerplant.value];
  }

  earnMoney(money) {
    this.money += money;
  }

  payMoney(money) {
    if (+money > this.money) return false;
    this.money -= +money;
    return true;
  }

  addCityNames(cityNames) {
    cityNames.shift();
    this.cityNames = this.cityNames.concat(cityNames);
    this.cities = this.cityNames.length;
  }

  addResources(resources) {
    const totalResorces = ["Coal", "Oil", "Uranium", "Garbage"];
    totalResorces.map(resource => {
      const resourceDetails = resources[resource].match(/_/g);
      if (resourceDetails != null) {
        const resourceCount = resourceDetails.length;
        this.resources[resource] += resourceCount;
      }
    });
  }
}

module.exports = Player;
