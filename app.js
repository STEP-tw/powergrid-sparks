const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const view = require("ejs");
const logger = require("morgan");

app.activeGames = {};

const {
  renderHome,
  createGame,
  joinGame,
  renderGamePage,
  renderGameplay,
  renderWaitingPage
} = require("./src/handlers");

app.set("views", __dirname + "/public/html");
app.engine("html", view.renderFile);
app.set("view engine", "html");

app.use(logger("dev"));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", renderHome);
app.post("/createGame", createGame);
app.get('/createGame', renderGamePage);
app.post("/joinGame", joinGame);
app.get(/\/gameplay/,renderGameplay);
app.get(/\/waitingPage/, renderWaitingPage);

app.use(express.static("public/html"));
app.use(express.static("public/stylesheet"));
app.use(express.static("public/javascript"));
app.use(express.static("public/images"));

module.exports = app;
