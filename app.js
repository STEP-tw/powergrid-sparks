const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const view = require('ejs');
const logger = require('morgan');

const {
  renderHome,
  createGame
} = require('./src/handlers');

app.activeGames = {};

app.set('views', __dirname + '/public/html');
app.engine('html', view.renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', renderHome);
app.post('/createGame', createGame);

app.use(express.static('public/html'));
app.use(express.static('public/stylesheet'));
app.use(express.static('public/javascript'));

module.exports = app;
