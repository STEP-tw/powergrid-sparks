const fs = require("fs");
const url = require("url");
const _ = require("lodash");
const Game = require("./model/Game");
const PowerPlantMarket = require("./model/power_plant_cards");
const Player = require("./model/player");
const Bureaucracy = require("./model/bureaucracy");
const Graph = require("node-dijkstra");

const powerPlantCards = fs.readFileSync(
  "./private/data/card_details.json",
  "UTF8"
);

const paymentOrder = fs.readFileSync(
  "./private/data/payment_order.json",
  "UTF8"
);

const travellingCostData = fs.readFileSync(
  "./private/data/travelling_costs.json",
  "UTF8"
);

const graph = new Graph(JSON.parse(travellingCostData));

const getGameId = function(req) {
  return req.cookies.gameId;
};

const getPlayerId = function(req) {
  return req.cookies.playerId;
};

const initializeGame = function(req, res) {
  const gameId = getGameId(req);
  const game = res.app.activeGames[+gameId];
  return game;
};

const renderHome = function(req, res) {
  if (res.app.cookies[req.cookies.playerId]) {
    const gameId = getGameId(req);
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
  const gameId = getGameId(req);
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
  try {
    const gameId = getGameId(req);
    const game = res.app.activeGames[+gameId];
    res.render("gameplay.html", { players: game.getPlayers() });
  } catch (error) {
    res.send("");
  }
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
  const currentPlayer = turn.getCurrentPlayer();
  res.send(currentPlayer);
};

const updateCurrentPlayer = function(req, res) {
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  turn.updateCurrentPlayer();
  res.send("");
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
  const areValidQuantities = hasCapacity(playerPowerplants, resourcesDetail);
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

const getStorageCapacity = function(powerPlants) {
  const storageCapacity = {};
  storageCapacity["Coal"] = 0;
  storageCapacity["Oil"] = 0;
  storageCapacity["Garbage"] = 0;
  storageCapacity["Uranium"] = 0;
  storageCapacity["Hybrid"] = 0;
  Object.keys(powerPlants).forEach(powerPlant => {
    storageCapacity[powerPlants[powerPlant].resource.type] +=
      powerPlants[powerPlant].resource.quantity * 2;
  });
  return storageCapacity;
};

const parseResourceDetails = function(selectedResourceDetails) {
  const selectedResources = {};
  const resources = ["Coal", "Oil", "Uranium", "Garbage"];
  resources.filter(resource => {
    if (selectedResourceDetails[resource].length > 2) {
      selectedResources[resource] = selectedResourceDetails[resource].split(
        ","
      ).length;
    }
  });
  return selectedResources;
};

const areValidTypes = function(playerPowerplants, selectedResourceDetails) {
  const storageCapacity = getStorageCapacity(playerPowerplants);
  const selectedResources = parseResourceDetails(selectedResourceDetails);
  const selectedResourceTypes = Object.keys(selectedResources);
  if (storageCapacity["Hybrid"]) {
    storageCapacity["Coal"] += storageCapacity["Hybrid"];
    storageCapacity["Oil"] += storageCapacity["Hybrid"];
  }
  const requiredTypes = Object.keys(storageCapacity).filter(
    type => storageCapacity[type] != 0
  );
  return selectedResourceTypes.every(resourceType =>
    requiredTypes.includes(resourceType)
  );
};

const hasCapacity = function(playerPowerplants, selectedResourceDetails) {
  const storageCapacity = getStorageCapacity(playerPowerplants);
  const selectedResources = parseResourceDetails(selectedResourceDetails);
  const selectedResourceTypes = Object.keys(selectedResources);
  if (storageCapacity["Hybrid"]) {
    storageCapacity["Coal"] += storageCapacity["Hybrid"] / 2;
    storageCapacity["Oil"] += storageCapacity["Hybrid"] / 2;
  }
  return selectedResourceTypes.every(
    resourceType =>
      selectedResources[resourceType] <= storageCapacity[resourceType]
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
  const playerId = getPlayerId(req);
  const currentPlayer = game.players.find(player => player.id == playerId);
  const cityCount = currentPlayer.getCityCount();
  game.addLog(`${currentPlayer.name} has lighted ${cityCount} cities`);
  const resources = currentPlayer.getResources();
  const powerplants = currentPlayer.getPowerplants();
  res.send({ powerplants, cityCount, resources });
};

const getPowerplants = function(req, res) {
  const game = initializeGame(req, res);
  const playerId = getPlayerId(req);
  const currentPlayer = game.players.find(player => player.id == playerId);
  const powerplants = currentPlayer.getPowerplants();
  res.send(powerplants);
};

const returnPlayerResources = function(req, res) {
  const game = initializeGame(req, res);
  const { cityCount, resources } = req.body;
  const playerId = getPlayerId(req);
  const updatedResources = JSON.parse(resources);
  const currentPlayer = game.players.find(player => player.id == playerId);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  currentPlayer.resources = updatedResources;
  const bureaucracy = new Bureaucracy(currentPlayer);
  bureaucracy.setLightedCity(+cityCount);
  bureaucracy.payForLightedCities(JSON.parse(paymentOrder));
  refillResources(currentPlayer, game);
  const winner = getWinner(game.getPlayers());
  if (turn.isLastPlayer() && winner.length > 0) {
    game.changePhaseTo("endGame");
    game.setWinner(winner[0].name);
    return res.send("");
  }
  console.log(turn.isLastPlayer());
  turn.isLastPlayer() && game.changePhaseTo("buyPowerPlant");
  res.send("");
};

const getWinner = function(players) {
  return players.filter(player => player.getLightedCity() > 8);
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
  let selectedPowerPlant = game.currentPowerPlant;
  const selectedPowerPlantDetails = req.body.selectedPowerPlant;
  if (!selectedPowerPlantDetails.length == 0) {
    selectedPowerPlant = req.body.selectedPowerPlant.split("_")[1];
  }
  game.conductAuction(bidAmount, selectedPowerPlant);
  const action = game.getAuctionAction();
  game.addLog(action);
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
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  const player = turn.getCurrentPlayer();
  const currentBid = game.getCurrentBid();
  const isBidOver = game.isBidOver();
  const isAuctionOver = game.isAuctionOver();
  const bidPlayers = game.getBidPlayers();
  const auctionPlayers = game.getAuctionPlayers();
  const phase = game.currentPhase();
  const isAuctionStarted = game.isAuctionStarted;
  if (isAuctionOver) {
    game.sellPowerPlant(game.currentPowerPlant);
    game.updatePowerPlants();
    game.resetTurn();
    game.changePhaseTo("buyResources");
    return res.send("");
  }

  if (isBidOver) {
    return res.send(
      JSON.stringify({
        currentBid,
        isBidOver,
        phase,
        isAuctionStarted,
        players: auctionPlayers,
        hasMoreThenThreePowerplants:
          Object.keys(player.getPowerplants()).length > 3,
        currentPlayerId: player.id,
        powerplants: player.getPowerplants()
      })
    );
  }
  res.send(
    JSON.stringify({
      currentBid,
      isBidOver,
      isAuctionStarted,
      players: bidPlayers
    })
  );
};

const getGameDetails = function(req, res) {
  try {
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
    const playerId = getPlayerId(req);
    const playerStats = game.players.find(player => player.id == playerId);
    res.send(
      JSON.stringify({
        player,
        players,
        resources,
        powerPlants: JSON.stringify(powerPlants),
        phase: game.currentPhase(),
        playerStats,
        logs: game.getLogs(),
        winner: game.getWinner()
      })
    );
  } catch (error) {
    res.send("");
  }
};

const formatCityNames = function(cityNames) {
  return cityNames.map(city => city.substr(0, city.length - 3));
};

const getBuildingCost = function(req, res) {
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  const player = turn.getCurrentPlayer();
  const playerCities = formatCityNames(player.cityNames);
  const selectedCities = formatCityNames(JSON.parse(req.body.selectedCities));

  if (playerCities.length == 0) {
    playerCities.push(selectedCities[0]);
  }

  const getMinCost = getMinimumCost.bind(null, playerCities);
  const minCosts = selectedCities.map(city => {
    const minCost = getMinCost(city);
    playerCities.push(city);
    return minCost;
  });
  const totalCost = _.sum(minCosts) + 10 * selectedCities.length;
  res.send("" + totalCost);
};

const getMinimumCost = function(playerCities, selectedCity) {
  const allPossiblePaths = playerCities.map(playerCity =>
    Math.floor(graph.path(playerCity, selectedCity, { cost: true }).cost)
  );
  return _.min(allPossiblePaths);
};

const passBuyingResources = function(req, res) {
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  const currentPlayer = turn.getCurrentPlayer().name;
  const isLastPlayer = turn.isLastPlayer();
  if (isLastPlayer) game.changePhaseTo("buildCities");
  const logMsg = `${currentPlayer} has passed in buying resources`;
  game.addLog(logMsg);
  res.send({ isLastPlayer });
};

const sendLogs = function(req, res) {
  const game = initializeGame(req, res);
  res.send(game.getLogs());
};

const passBuildingCities = function(req, res) {
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  const currentPlayer = turn.getCurrentPlayer().name;
  const isLastPlayer = turn.isLastPlayer();
  if (isLastPlayer) game.changePhaseTo("bureaucracy");
  const logMsg = `${currentPlayer} has passed in building cities`;
  game.addLog(logMsg);
  res.send({ isLastPlayer });
};

const discardPowerplant = function(req, res) {
  const powerplantValue = req.body.powerplant;
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  const player = turn.getCurrentPlayer();
  players[0].discardPowerplant(powerplantValue);
  res.send("");
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
  buyResources,
  buildCities,
  passBuildingCities,
  getPlayers,
  updateResourceMarket,
  lightCities,
  getPowerplants,
  returnPlayerResources,
  makeBid,
  passBuyingResources,
  selectPowerPlant,
  getCurrentBid,
  returnPlayerResources,
  getGameDetails,
  getBuildingCost,
  sendLogs,
  discardPowerplant
};
