const Turn = require('./turn');

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

  getPowerPlantMarket() {
    return this.powerPlantMarket;
  }
}

module.exports = Game;
