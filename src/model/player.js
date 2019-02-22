class Player {
  constructor(color, name) {
    this.name = name;
    this.resources = { Coal: 0, Garbage: 0, Uranium: 0, Oil: 0 };
    this.powerplants = {};
    this.money = 50;
    this.color = color;
    this.cities = 0;
    this.cityNames = [];
  }

  getName() {
    return this.name;
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
    if (money > this.money) return false;
    this.money -= money;
    return true;
  }

  addCities(citiesCount) {
    this.cities += citiesCount;
  }

  addCityNames(cityNames) {
    this.cityNames = this.cityNames.concat(cityNames);
  }

  addResources(resources) {
    ["Coal", "Oil", "Uranium", "Garbage"].map(
      resource => (this.resources[resource] += +resources[resource])
    );
  }
}

module.exports = Player;
