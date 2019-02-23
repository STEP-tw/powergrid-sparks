const fs = require('fs');
const url = require('url');
const _ = require('lodash');
const Game = require('./model/Game');
const PowerPlantMarket = require('./model/power_plant_cards');
const Player = require('./model/player');

const powerPlantCards = fs.readFileSync('./private/data/card_details.json', 'UTF8');

const initializeGame = function(req, res) {
  const gameId = req.cookies.gameId;
  const game = res.app.activeGames[+gameId];
  return game;
};

const renderHome = function(req, res) {
  if (res.app.cookies[req.cookies.playerId]) {
    const gameId = req.cookies.gameId;
    const game = res.app.activeGames[+gameId];
    if (game.getCurrentPlayersCount() == game.getMaxPlayersCount()) {
      return res.redirect(
        `/gameplay?gameId=${+Object.keys(res.app.activeGames)[0]}`
      );
    }
    return res.redirect(`/waitingPage?gameId=${gameId}`);
  }
  return res.render('index.html');
};

const generateGameId = function(activeGames, randomGenerator) {
  const gameId = Math.round(randomGenerator() * 1000);
  if (activeGames[gameId]) return generateGameId(activeGames, randomGenerator);
  return gameId;
};

const setCookie = function(res, gameId, player) {
  const cookie = Date.now();
  res.cookie('playerId', cookie);
  res.cookie('gameId', gameId);
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
  res.redirect(`/waitingPage?gameId=${gameId}`);
};

const renderWaitingPage = function(req, res) {
  const gameId = url.parse(req.url, true).query.gameId;
  const game = res.app.activeGames[+gameId];
  res.render('createdGame.html', { users: game.getPlayers(), gameId });
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
  const gameId = url.parse(req.url, true).query.gameId;
  const game = res.app.activeGames[+gameId];
  res.render('gameplay.html', { players: game.getPlayers() });
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
      return res.send('game is already started!');
    }
    addPlayer(game, joinerName, res, gameId);
    return res.redirect(`/waitingPage?gameId=${gameId}`);
  }
  res.redirect('/invalidGameId');
};

const renderErrorPage = function(req, res) {
  res.render('joinPageWithErr.html');
};

const initializeMarket = function(req, res) {
  const game = initializeGame(req, res);
  const cardDetails = JSON.stringify(game.getPowerPlantMarket());
  game.shuffleDeck(_.shuffle);
  res.send(cardDetails);
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
  res.send(turn.updateCurrentPlayer());
};

const buyPowerplant = function(req, res) {
  const price = +req.body.price;
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
  res.send(players);
};

const getPowerplantDetails = function(req, res) {
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  res.send(players);
};

const buyResources = function(req, res) {
  const resourcesDetail = req.body;
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  const currentPlayer = turn.getCurrentPlayer();
  currentPlayer.payMoney(resourcesDetail.cost);
  currentPlayer.addResources(resourcesDetail);
  updateResourceMarket(resourcesDetail, game);
  res.send(currentPlayer);
};

const updateCurrentPowerPlantMarket = function(req, res) {
  const game = initializeGame(req, res);
  const price = req.body.price;
  game.sellPowerPlant(price);
  game.updatePowerPlants();
  const currentMarket = game.getPowerPlantMarket();
  res.send(JSON.stringify(currentMarket));
};

const buildCities = function(req, res) {
  const price = +req.body.price;
  const cityNames = req.body.cityNames.split('\n');
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  const turn = game.getTurn(players);
  const currentPlayer = turn.getCurrentPlayer();
  const isPaymentSuccess = currentPlayer.payMoney(price);
  if (isPaymentSuccess) {
    currentPlayer.addCityNames(cityNames.filter(city => city.length > 1));
  }
  res.send({ isPaymentSuccess, currentPlayer });
};

const getPlayers = function(req, res) {
  const game = initializeGame(req, res);
  const players = game.getPlayers();
  res.send(players);
};

const getPlayerStats = function(req, res) {
  const game = initializeGame(req, res);
  const playerId = req.cookies.playerId;
  const playerStats = game.players.filter(player => player.id == playerId);
  res.send(playerStats[0]);
};

const getCurrentPowerPlants = function(req, res) {
  const game = initializeGame(req, res);
  const powerPlants = game.getPowerPlantMarket();
  res.send(JSON.stringify(powerPlants));
};

const getResources = function(req, res) {
  const game = initializeGame(req, res);
  const resourceMarket = game.getResourceMarket();
  const resources = resourceMarket.getResources();
  res.send(JSON.stringify(resources));
};

const updateResourceMarket = function(resourcesDetail, game) {
  const resourceMarket = game.getResourceMarket();
  const { Coal, Oil, Garbage, Uranium } = resourcesDetail;
  resourceMarket.updateResources({ Coal, Oil, Garbage, Uranium });
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
  getPowerplantDetails,
  buyResources,
  updateCurrentPowerPlantMarket,
  buildCities,
  getPlayers,
  getPlayerStats,
  getResources,
  updateResourceMarket,
  getCurrentPowerPlants
};
