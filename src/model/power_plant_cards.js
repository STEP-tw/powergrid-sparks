class PowerPlantMarket {
  constructor(cards) {
    this.cards = cards;
  }

  initializeMarket() {
    const currentCards = {};
    const currentCardPrices = Object.keys(this.cards).slice(0, 8);
    currentCardPrices.map(card => (currentCards[card] = this.cards[card]));
    return currentCards;
  }
}

module.exports = PowerPlantMarket;
