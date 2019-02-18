const url = require("url");
const Game = require("./model/Game");

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
  game.addPlayer(req.body.hostName);
  res.render("createdGame.html", { users: game.getPlayers(), gameId });
};

const renderGamePage = function(req, res) {
  const gameId = url.parse(req.url, true).query.gameId;
  const game = res.app.activeGames[+gameId];
  if (game.getCurrentPlayersCount() == game.getMaxPlayersCount()) {
    game.start();
    return res.redirect("/gameplay");
  }
  res.render("createdGame.html", { users: game.getPlayers(), gameId });
};

const renderGameplay = function(req, res){
  res.render('gameplay.html');
}

const joinGame = function(req, res) {
  const { gameId, joinerName } = req.body;
  const game = res.app.activeGames[+gameId];
  if (game) {
    if (game.hasStarted()) {
      return res.send("game is already started!");
    }
    game.addPlayer(joinerName);
    return res.render("createdGame.html", { users: game.getPlayers(), gameId });
  }
  res.redirect("index.html");
};

module.exports = {
  renderHome,
  createGame,
  generateGameId,
  joinGame,
  renderGamePage,
  renderGameplay
};
