class PlayingOrder {
  constructor(players) {
    this.players = players;
  }

  getOrder() {
    return this.players.sort((x, y) => y.cities - x.cities);
  }
}

module.exports = PlayingOrder;
