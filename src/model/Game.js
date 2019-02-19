class Game {
  constructor(playerCount) {
    this.active = false;
    this.players = [];
    this.maxPlayerCount = playerCount;
    this.colors = ["red", "blue", "pink", "black", "orange", "yellow"];
    this.isShuffled = false;
  }

  addPlayer(player) {
    this.players.push(player);
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
}

module.exports = Game;