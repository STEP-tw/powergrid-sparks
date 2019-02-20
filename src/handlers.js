const fs = require("fs");
const url = require("url");
const _ = require("lodash");
const Game = require("./model/Game");
const PowerPlantMarket = require("./model/power_plant_cards");
const Player = require("./model/player");

const powerPlantCards = fs.readFileSync(
  "./private/data/card_details.json",
  "UTF8"
);
const renderHome = function(req, res) {
  res.render("index.html");
};

const generateGameId = function(activeGames, randomGenerator) {
  const gameId = Math.round(randomGenerator() * 1000);
  if (activeGames[gameId]) return generateGameId(activeGames, randomGenerator);
  return gameId;
};

const createGame = function(req, res) {
  const gameId = generateGameId(res.app.activeGames, Math.random);
  const game = new Game(req.body.playerCount);
  res.app.activeGames[gameId] = game;
  const playerColor = game.getPlayerColor();
  const player = new Player(playerColor, req.body.hostName);
  game.addPlayer(player);
  res.redirect(`/waitingPage?gameId=${gameId}`);
};

const renderWaitingPage = function(req, res) {
  const gameId = url.parse(req.url, true).query.gameId;
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
  const gameId = url.parse(req.url, true).query.gameId;
  const game = res.app.activeGames[+gameId];
  res.render("gameplay.html", { players: game.getPlayers() });
};

const joinGame = function(req, res) {
  const { gameId, joinerName } = req.body;
  const game = res.app.activeGames[+gameId];
  if (game) {
    if (game.hasStarted()) {
      return res.send("game is already started!");
    }
    const playerColor = game.getPlayerColor();
    const player = new Player(playerColor, joinerName);
    game.addPlayer(player);
    return res.redirect(`/waitingPage?gameId=${gameId}`);
  }
  res.redirect("/invalidGameId");
};

const renderErrorPage = function(req, res){
  res.render('joinPageWithErr.html');
}

const initializeMarket = function(req, res) {
  const powerPlantMarket = new PowerPlantMarket(JSON.parse(powerPlantCards));
  const cardDetails = JSON.stringify(powerPlantMarket.initializeMarket());
  res.send(cardDetails);
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
  renderErrorPage
};
