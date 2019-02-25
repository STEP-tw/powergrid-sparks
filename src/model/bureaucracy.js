class Bureaucracy {
  constructor(player) {
    this.player = player;
    this.playerMoney = this.player.getMoney();
    this.getPowerplant = this.player.getPowerplants();
    this.resources = this.player.getResources();
    this.cityCount = this.player.getCityCount();
  }

  validateCityCount(citiesCount) {
    return citiesCount <= this.cityCount;
  }

  setLightedCity(citiesCount) {
    this.player.lightedCity = citiesCount;
  }

  payForLightedCities(paymentOrder) {
    const lightedCity = this.player.lightedCity
    const money = paymentOrder[lightedCity];
    this.player.earnMoney(money);
  }
}

module.exports = Bureaucracy;
