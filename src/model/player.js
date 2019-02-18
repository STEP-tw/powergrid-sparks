class Player {
  constructor(color, name) {
    this.name = name;
    this.resources = { coal: 0, garbage: 0, uranium: 0, oil: 0 };
    this.powerplants = {};
    this.money = 50;
    this.color = color;
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
    if (money > this.money) return { payment: "fail" };
    this.money -= money;
    return { payment: "success" };
  }
}

module.exports = Player;
