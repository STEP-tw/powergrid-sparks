const Game = require('./model/Game');

const renderHome = function (req, res) {
  res.render("index.html");
};

const generateGameId = function (activeGames, randomGenerator) {
  const gameId = Math.round(randomGenerator() * 1000);
  if (activeGames[gameId]) return generateGameId(activeGames, randomGenerator);
  return gameId;
};

const createGame = function (req, res) {
  const gameId = generateGameId(res.app.activeGames, Math.random);
  const game = new Game(req.body.playerCount);
  res.app.activeGames[gameId] = game;
  game.addPlayer(req.body.hostName);
  res.render("createdGame.html", { users: game.getPlayers(), gameId });
};

module.exports = {
  renderHome,
  generateGameId,
  createGame
}