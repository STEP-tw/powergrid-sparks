class Bid {
  constructor(players, powerPlantCost) {
    this.players = players;
    this.currentBidAmount = powerPlantCost;
    this.action = null;
  }

  updateBidder() {
    this.players.push(this.players.shift());
    this.currentBidder = this.players[0];
  }

  makeBid(bid) {
    this.currentBidder = this.players[0];
    if (bid == "pass") {
      this.updatePlayers();
      this.action = `${this.currentBidder.name} has passed`;
      this.currentBidder = this.players[0];
      return this.isBidOver();
    }
    this.currentBidAmount = bid;
    this.action = `${this.currentBidder.name} has make the bid ${bid}`;
    this.updateBidder();
    return this.isBidOver();
  }

  updatePlayers() {
    this.players = this.players.filter(
      player => player.name != this.currentBidder.name
    );
  }

  isBidOver() {
    return this.players.length == 1;
  }

  getResult() {
    const winner = this.players[0];
    const biddingAmount = this.currentBidAmount;
    return { winner, biddingAmount };
  }
}

class Auction {
  constructor(players, powerPlantMarket) {
    this.players = players;
    this.powerPlantMarket = powerPlantMarket;
    this.currentPlayer = players[0];
    this.isBidOver = false;
    this.Action = null;
  }

  updatePlayer() {
    this.players.push(this.players.shift());
    this.currentPlayer = this.players[0];
  }

  selectPowerPlant(powerPlantCost, currentBidAmount) {
    this.biddingResult = undefined;
    this.isBidOver = false;
    if (currentBidAmount == "pass") {
      this.updatePlayers();
      this.isBidOver = true;
      this.action = `${this.currentPlayer.name} has passed`;
      this.currentPlayer = this.players[0];
      return this.isAuctionOver();
    }
    this.selectedPowerPlant = {
      value: powerPlantCost,
      resource: this.powerPlantMarket.cards[powerPlantCost].resource,
      city: this.powerPlantMarket.cards[powerPlantCost].city
    };
    this.action = `${this.currentPlayer.name} has selected the Power Plant `;
    this.currentBidAmount = currentBidAmount;
    this.start();
  }

  getOrder() {
    if (this.isBidOver) {
      return this.getPlayers();
    }
    return this.getBidPlayers();
  }

  getCurrentBid() {
    return this.currentBidAmount;
  }

  updatePlayers() {
    this.players = this.players.filter(
      player => player.name != this.currentPlayer.name
    );
  }

  start() {
    if (this.isOnePlayer()) {
      this.bid = new Bid([...this.players], this.currentBidAmount);
      this.continue(this.currentBidAmount);
      return;
    }
    this.bid = new Bid([...this.players], this.currentBidAmount);
    this.bid.makeBid(this.currentBidAmount);
  }

  continue(bid) {
    this.isBidOver = this.bid.makeBid(bid);
    this.action = this.bid.action;
    if (bid != "pass") {
      this.currentBidAmount = bid;
    }
    if (this.isBidOver) {
      this.biddingResult = this.bid.getResult();
      const winner = this.players.filter(
        player => player.name == this.biddingResult.winner.name
      );
      this.action = `${winner[0].name} has got the Power Plant`;
      winner[0].addPowerplant(this.selectedPowerPlant);
      winner[0].payMoney(this.biddingResult.biddingAmount);
      this.players.push(this.players.shift());
      this.players = this.players.filter(
        player => player.name != this.biddingResult.winner.name
      );
      
      this.currentPlayer = this.players[0];
      this.currentBidAmount = undefined;
    }
    return { isBidOver: this.isBidOver, value: this.selectedPowerPlant.value};
  }

  isBidDone() {
    return this.isBidOver;
  }

  isAuctionOver() {
    return this.players.length == 0;
  }

  isOnePlayer() {
    return this.players.length == 1;
  }

  getBidPlayers() {
    if (this.bid != undefined) {
      const playerIds = this.bid.players.map(player => player.id);
      return playerIds;
    }
    return this.players.map(player => player.id);
  }

  getPlayers() {
    const playerIds = this.players.map(player => player.id);
    return playerIds;
  }

  getAction() {
    return this.action;
  }
}

module.exports = { Auction, Bid };
