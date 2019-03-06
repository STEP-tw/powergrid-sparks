const fs = require("fs");
const url = require("url");
const _ = require("lodash");
const Game = require("./model/Game");
const PowerPlantMarket = require("./model/power_plant_cards");
const Player = require("./model/player");
const Bureaucracy = require("./model/bureaucracy");

const powerPlantCards = fs.readFileSync(
  "./private/data/card_details.json",
  "UTF8"
);

const paymentOrder = fs.readFileSync(
  "./private/data/payment_order.json",
  "UTF8"
);

const getGameID = function(req) {
  return req.cookies.gameId;
};

const initializeGame = function(req, res) {
  const gameId = getGameID(req);
  const game = res.app.activeGames[+gameId];
  return game;
};

const renderHome = function(req, res) {
  if (res.app.cookies[req.cookies.playerId]) {
    const gameId = getGameID(req);
    const game = res.app.activeGames[+gameId];
    if (game.getCurrentPlayersCount() == game.getMaxPlayersCount()) {
      return res.redirect("/gameplay");
    }
    return res.redirect("/waitingPage");
  }
  return res.render("index.html");
};

const generateGameId = function(activeGames, randomGenerator) {
  const gameId = Math.round(randomGenerator() * 1000);
  if (activeGames[gameId]) return generateGameId(activeGames, randomGenerator);
  return gameId;
};

const setCookie = function(res, gameId, player) {
  const cookie = Date.now();
  res.cookie("playerId", cookie);
  res.cookie("gameId", gameId);
  res.app.cookies[cookie] = player.getName();
  player.setId(cookie);
};

const createGame = function(req, res) {
  const gameId = generateGameId(res.app.activeGames, Math.random);
  const game = new Game(req.body.playerCount);
  const powerPlantMarket = new PowerPlantMarket(JSON.parse(powerPlantCards));
  res.app.activeGames[gameId] = game;
  res.app.activeGames[gameId].initializePowerPlantMarket(powerPlantMarket);
  const playerColor = game.getPlayerColor();
  const player = new Player(playerColor, req.body.hostName);
  setCookie(res, gameId, player);
  game.addPlayer(player);
  game.addLog("Game Started");
  res.redirect("/waitingPage");
};

const renderWaitingPage = function(req, res) {
  const gameId = getGameID(req);
  const game = res.app.activeGames[+gameId];
  res.render("createdGame.html", { users: game.getPlayers(), gameId });
};

const renderGamePage = function(req, res) {
  const gameId = url.parse(req.url, true).query.gameId;
  const game = res.app.activeGames[+gameId];
  if (game.getCurrentPlayersCount() == game.getMaxPlayersCount()) {
    game.decideOrder(_.shuffle);
    game.start();
  }
  res.send({ users: game.getPlayers(), gameState: game.hasStarted(), gameId });
};

const renderGameplay = function(req, res) {
  const gameId = getGameID(req);
  const game = res.app.activeGames[+gameId];
  res.render("gameplay.html", { players: game.getPlayers() });
};

const addPlayer = function(game, joinerName, res, gameId) {
  const playerColor = game.getPlayerColor();
  const player = new Player(playerColor, joinerName);
  setCookie(res, gameId, player);
  game.addPlayer(player);
};

const joinGame = function(req, res) {
  const { gameId, joinerName } = req.body;
  const game = res.app.activeGames[+gameId];
  if (game) {
    if (game.hasStarted()) {
      return res.send("game is already started!");
    }
    addPlayer(game, joinerName, res, gameId);
    return res.redirect("/waitingPage");
  }
  res.redirect("/invalidGameId");
};

const renderErrorPage = function(req, res) {
  res.render("joinPageWithErr.html");
};

const initializeMarket = function(req, res) {
  const game = initializeGame(req, res);
  const cardDetails = JSON.stringify(game.getPowerPlantMarket());
  game.shuffleDeck(_.shuffle);
  res.send(cardDetails);
};

const createBuyPowerPlantLog = function(game, turn, powerplant) {
  const playerName = turn.getCurrentPlayer().name;
  const logMsg = `${playerName} has bought power plant ${powerplant.value}.`;
  game.addLog(logMsg);
};

const createBuildCityLog = function(game, turn, cityCount) {
  const playerName = turn.getCurrentPlayer().name;
  const logMsg = `${playerName} has build ${cityCount} cities.`;
  game.addLog(logMsg);
};

const createBuyResourceLog = function(game, turn, resourcesDetail) {
  const playerName = turn.getCurrentPlayer().name;
  const cost = resourcesDetail.Cost;
  const logMsg = `${playerName} has bought resources of cost ${cost}.`;
  game.addLog(logMsg);
};

const getCurrentPlayer = function(req, res) {
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  res.send(turn.getCurrentPlayer());
};

const updateCurrentPlayer = function(req, res) {
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  turn.updateCurrentPlayer();
  res.send("");
};

const buyPowerplant = function(req, res) {
  const price = req.body.price;
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  const currentPlayer = turn.getCurrentPlayer();
  const cardDetails = JSON.parse(powerPlantCards)[price];
  const powerplant = {
    value: price,
    resource: cardDetails.resource,
    city: cardDetails.city
  };
  currentPlayer.addPowerplant(powerplant);
  currentPlayer.payMoney(price);
  game.sellPowerPlant(price);
  game.updatePowerPlants();
  createBuyPowerPlantLog(game, turn, powerplant);
  res.send(players);
};

const buyResources = function(req, res) {
  const resourcesDetail = req.body;
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  const currentPlayer = turn.getCurrentPlayer();
  const playerPowerplants = currentPlayer.getPowerplants();
  const isLastPlayer = turn.isLastPlayer();
  const areValidType = areValidTypes(playerPowerplants, resourcesDetail);
  const areValidQuantities = isValidQuantity(
    playerPowerplants,
    resourcesDetail
  );
  if (!areValidType) {
    res.send({ currentPlayer, areValidType, isLastPlayer });
    return;
  }
  if (!areValidQuantities) {
    res.send({
      currentPlayer,
      areValidType,
      areValidQuantities,
      isLastPlayer
    });
    return;
  }
  const isPurchaseSuccess = currentPlayer.payMoney(resourcesDetail.Cost);
  if (isPurchaseSuccess) {
    currentPlayer.addResources(resourcesDetail);
    updateResourceMarket(resourcesDetail, game);
    createBuyResourceLog(game, turn, resourcesDetail);
    if (isLastPlayer) game.changePhaseTo("buildCities");
  }
  res.send({
    currentPlayer,
    isPurchaseSuccess,
    areValidType,
    areValidQuantities,
    isLastPlayer
  });
};

const getRequiredResDetails = function(powerPlants) {
  const requiredResDetails = {};
  const resources = Object.keys(powerPlants).map(powerPlant => {
    return powerPlants[powerPlant].resource;
  });
  resources.forEach(resource => {
    requiredResDetails[resource.type] = resource.quantity * 2;
  });
  return requiredResDetails;
};

const parseResourceDetails = function(selectedResourceDetails) {
  const selectedResources = {};
  ["Coal", "Oil", "Uranium", "Garbage"].filter(x => {
    if (selectedResourceDetails[x].length > 2) {
      selectedResources[x] = selectedResourceDetails[x].split(",").length;
    }
  });
  return selectedResources;
};

const areValidTypes = function(playerPowerplants, selectedResourceDetails) {
  const requiredResDetails = getRequiredResDetails(playerPowerplants);
  const selectedResources = parseResourceDetails(selectedResourceDetails);
  const selectedResourceTypes = Object.keys(selectedResources);
  const requiredResTypes = Object.keys(requiredResDetails);
  return selectedResourceTypes.every(resourceType =>
    requiredResTypes.includes(resourceType)
  );
};
const isValidQuantity = function(playerPowerplants, selectedResourceDetails) {
  const requiredResDetails = getRequiredResDetails(playerPowerplants);
  const selectedResources = parseResourceDetails(selectedResourceDetails);
  const selectedResourceTypes = Object.keys(selectedResources);
  return selectedResourceTypes.every(
    resourceType =>
      selectedResources[resourceType] <= requiredResDetails[resourceType]
  );
};

const buildCities = function(req, res) {
  const price = +req.body.price;
  const cityNames = req.body.cityNames.split("\n");
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  const currentPlayer = turn.getCurrentPlayer();
  const isPaymentSuccess = currentPlayer.payMoney(price);
  const isLastPlayer = turn.isLastPlayer();
  if (isPaymentSuccess) {
    const cities = cityNames.filter(city => city.length > 1);
    createBuildCityLog(game, turn, cities.length - 1);
    currentPlayer.addCityNames(cities);
    if (isLastPlayer) game.changePhaseTo("bureaucracy");
  }
  res.send({ isPaymentSuccess, currentPlayer });
};

const lightCities = function(req, res) {
  const game = initializeGame(req, res);
  const playerId = req.cookies.playerId;
  const currentPlayer = game.players.find(player => player.id == playerId);
  const cityCount = currentPlayer.getCityCount();
  const resources = currentPlayer.getResources();
  const powerplants = currentPlayer.getPowerplants();
  res.send({ powerplants, cityCount, resources });
};

const getPowerplants = function(req, res) {
  const game = initializeGame(req, res);
  const playerId = req.cookies.playerId;
  const currentPlayer = game.players.find(player => player.id == playerId);
  const powerplants = currentPlayer.getPowerplants();
  res.send(powerplants);
};

const returnPlayerResources = function(req, res) {
  const game = initializeGame(req, res);
  const { cityCount, resources } = req.body;
  const playerId = req.cookies.playerId;
  const updatedResources = JSON.parse(resources);
  const currentPlayer = game.players.find(player => player.id == playerId);

  const players = game.getPlayers();
  const turn = game.getTurn(players);

  currentPlayer.resources = updatedResources;
  const bureaucracy = new Bureaucracy(currentPlayer);
  bureaucracy.setLightedCity(+cityCount);
  bureaucracy.payForLightedCities(JSON.parse(paymentOrder));
  refillResources(currentPlayer, game);
  turn.isLastPlayer() && game.changePhaseTo("buyPowerPlant");
  res.send();
};

const refillResources = function(currentPlayer, game) {
  const players = game.players;
  const lastPlayerIndex = players.length - 1;
  const lastPlayer = players[lastPlayerIndex].name;
  if (currentPlayer.name == lastPlayer) {
    const resourceMarket = game.getResourceMarket();
    resourceMarket.refillResourceStep1();
    game.setPlayingOrder();
    game.rearrangePowerPlants();
  }
};

const getPlayers = function(req, res) {
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  res.send(players);
};

const updateResourceMarket = function(resourcesDetail, game) {
  const resourceMarket = game.getResourceMarket();
  const { Coal, Oil, Garbage, Uranium } = resourcesDetail;
  resourceMarket.updateResources({ Coal, Oil, Garbage, Uranium });
};

const makeBid = function(req, res) {
  const bidAmount = req.body.bidAmount;
  const game = initializeGame(req, res);
  game.conductAuction(bidAmount);
  res.send("");
};

const selectPowerPlant = function(req, res) {
  const game = initializeGame(req, res);
  const powerPlantCost = req.body.powerPlantCost;
  game.addSelectedPowerPlant(powerPlantCost);
  res.send("");
};

const getCurrentBid = function(req, res) {
  const game = initializeGame(req, res);
  const currentBid = game.getCurrentBid();
  const isBidOver = game.isBidOver();
  const isAuctionOver = game.isAuctionOver();
  const bidPlayers = game.getBidPlayers();
  const auctionPlayers = game.getAuctionPlayers();
  const phase = game.currentPhase();
  const isAuctionStarted = game.isAuctionStarted;
  if (isAuctionOver) {
    game.resetTurn();
    game.changePhaseTo("buyResources");
    game.initiateAuction();
  }
  if (isBidOver) {
    return res.send(
      JSON.stringify({
        currentBid,
        isAuctionOver,
        isBidOver,
        phase,
        isAuctionStarted,
        players: auctionPlayers
      })
    );
  }
  res.send(
    JSON.stringify({
      currentBid,
      isAuctionOver,
      isBidOver,
      isAuctionStarted,
      players: bidPlayers
    })
  );
};

const getGameDetails = function(req, res) {
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  let player = turn.getCurrentPlayer();
  const resourceMarket = game.getResourceMarket();
  if (game.currentPhase() == "buyPowerPlant" && game.isAuctionStarted) {
    if (game.isBidOver()) {
      if (game.auction.players.length) {
        player = game.auction.players[0];
      }
    } else {
      player = game.auction.bid.currentBidder;
    }
  }
  const resources = resourceMarket.getResources();
  const powerPlants = game.getPowerPlantMarket();
  const playerId = req.cookies.playerId;
  const playerStats = game.players.find(player => player.id == playerId);
  res.send(
    JSON.stringify({
      player,
      players,
      resources,
      powerPlants: JSON.stringify(powerPlants),
      phase: game.currentPhase(),
      playerStats,
      logs: game.getLogs()
    })
  );
};

module.exports = {
  renderHome,
  createGame,
  generateGameId,
  joinGame,
  renderGamePage,
  renderGameplay,
  initializeMarket,
  renderWaitingPage,
  renderErrorPage,
  getCurrentPlayer,
  updateCurrentPlayer,
  buyPowerplant,
  buyResources,
  buildCities,
  getPlayers,
  updateResourceMarket,
  lightCities,
  getPowerplants,
  returnPlayerResources,
  makeBid,
  selectPowerPlant,
  getCurrentBid,
  returnPlayerResources,
  getGameDetails
};
