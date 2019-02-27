const Turn = require("./turn");
const ResourceMarket = require("./resource_market");
const ActivityLog = require("./activityLog");
const PlayingOrder = require("./playing_order");
const { Auction } = require("./auction");

class Game {
  constructor(playerCount) {
    this.active = false;
    this.players = [];
    this.maxPlayerCount = playerCount;
    this.colors = ["red", "blue", "pink", "black", "orange", "yellow"];
    this.isShuffled = false;
    this.activityLog = new ActivityLog(Date);
    this.playerOrder = this.players;
  }

  conductAuction(cost) {
    if (this.auction == undefined) {
      this.auction = new Auction(this.players, this.powerPlantMarket);
      this.auction.selectPowerPlant(cost);
      return;
    }
    if (this.auction.biddingResult != undefined) {
      this.auction.selectPowerPlant(cost);
    }
    const { isBidOver, value } = this.auction.continue(cost);
    if (isBidOver) {
      this.sellPowerPlant(value);
      this.updatePowerPlants();
      // this.addLog();
    }
  }

  isAuctionOver() {
    if (this.auction == undefined) return false;
    return this.auction.isAuctionOver();
  }

  getPlayersOrder() {
    if (this.auction == undefined) {
      this.playerOrder = this.players;
      return this.playerOrder;
    }

    if (!this.auction.isAuctionOver()) {
      this.playerOrder = this.auction.getOrder();
    }
    return this.playerOrder;
  }

  isBidOver() {
    if (this.auction == undefined) return false;
    return this.auction.isBidDone();
  }

  getCurrentBid() {
    if (this.auction == undefined) return 0;
    return this.auction.getCurrentBid();
  }

  getBidPlayers() {
    if (this.auction == undefined) {
      const playerIds = this.players.map(player => player.id);
      return playerIds;
    }
    return this.auction.getBidPlayers();
  }

  getAuctionPlayers() {
    if (this.auction == undefined) {
      const playerIds = this.players.map(player => player.id);
      return playerIds;
    }
    return this.auction.getPlayers();
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

  shuffleDeck(shuffler) {
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

  addLog(log) {
    this.activityLog.addLog(log);
  }

  getLogs() {
    return this.activityLog.getLogs();
  }

  setPlayingOrder() {
    const playingOrder = new PlayingOrder(this.players);
    this.players = playingOrder.getOrder();
  }

  addSelectedPowerPlant(powerPlant) {
    this.powerPlantMarket.addSelectedPowerPlant(powerPlant);
  }

  rearrangePowerPlants() {
    this.powerPlantMarket.rearrange();
  }
}

module.exports = Game;
