const Turn = require('./turn');
const ResourceMarket = require('./resource_market');

class Game {
  constructor(playerCount) {
    this.active = false;
    this.players = [];
    this.maxPlayerCount = playerCount;
    this.colors = ['red', 'blue', 'pink', 'black', 'orange', 'yellow'];
    this.isShuffled = false;
    this.powerPlantMarket;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getResourceMarket() {
    if (this.resourceMarket == undefined) {
      this.resourceMarket = new ResourceMarket();
    }
    return this.resourceMarket;
  }

  getTurn(players) {
    if (this.turn == undefined) {
      this.turn = new Turn(players);
    }
    return this.turn;
  }

  hasStarted() {
    return this.active;
  }

  start() {
    this.active = true;
  }

  getPlayers() {
    return this.players;
  }

  getPlayerColor() {
    return this.colors.shift();
  }

  decideOrder(shuffler) {
    !this.isShuffled && (this.players = shuffler(this.players));
    this.isShuffled = true;
  }

  getCurrentPlayersCount() {
    return this.players.length;
  }

  getMaxPlayersCount() {
    return this.maxPlayerCount;
  }

  initializePowerPlantMarket(market) {
    this.powerPlantMarket = market;
  }

  shuffleDeck(shuffler){
    this.powerPlantMarket.shuffleDeck(shuffler);
  }

  getPowerPlantMarket() {
    return this.powerPlantMarket.getCurrentPowerPlants();
  }

  sellPowerPlant(price) {
    this.powerPlantMarket.sellPowerPlant(price);
  }

  updatePowerPlants() {
    this.powerPlantMarket.updateCurrentMarket();
  }
}

module.exports = Game;
