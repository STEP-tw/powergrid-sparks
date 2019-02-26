class PlayingOrder {
  constructor(players) {
    this.players = players;
  }

  getOrder() {
    return this.players.sort((x, y) => x.cities - y.cities);
  }
}

module.exports = PlayingOrder;
