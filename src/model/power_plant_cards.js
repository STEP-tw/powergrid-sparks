class PowerPlantMarket {
  constructor(cards) {
    this.cards = cards;
    this.deck = Object.keys(this.cards);
    this.currentMarket = this.deck.splice(0, 8);
  }

  initializeMarket() {
    const currentCards = {};
    this.currentMarket.map(card => (currentCards[card] = this.cards[card]));
    return currentCards;
  }

  shuffleDeck(shuffler) {
    this.deck = shuffler(this.deck);
  }

  removePowerPlant(powerplant) {
    this.currentMarket.splice(this.currentMarket.indexOf(powerplant), 1);
  }

  getCurrentPowerPlants(){
    const currentCards = {};
    this.currentMarket.map(card => (currentCards[card] = this.cards[card]));
    return currentCards;
  }

  getCurrentMarket() {
    const currentCards = {};
    const newPowerPlant = this.deck.splice(0, 1);
    this.currentMarket.push(newPowerPlant);
    this.currentMarket = this.currentMarket.sort((x, y) => x - y);
    this.currentMarket.map(card => (currentCards[card] = this.cards[card]));
    return currentCards;
  }
}

module.exports = PowerPlantMarket;
