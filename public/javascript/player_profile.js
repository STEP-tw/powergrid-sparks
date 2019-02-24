const resourceIcons = {
  Garbage: '<i class="fas fa-trash-alt"></i>',
  Coal: '<i class="fas fa-cubes"></i>',
  Oil: '<i class="fas fa-oil-can"></i>',
  Uranium: '<i class="fas fa-radiation-alt"></i>',
  Hybrid: '<i class="fas fa-hands-helping"></i>',
  arrow: '<i class="fas fa-arrow-right" ></i >',
  city: '<i class="fas fa-house-damage"></i>'
};

const generatePowerplantHTML = function(powerplants) {
  const powerplantValues = Object.keys(powerplants);
  let html = "";
  powerplantValues.forEach(powerplantValue => {
    html += `<div class='player-power-plant'>
      <div>${powerplantValue}</div>
      <div> ${resourceIcons[powerplants[powerplantValue].resource.type]}    ${
      powerplants[powerplantValue].resource.quantity
    }</div>
      <div>  ${resourceIcons.city}  ${powerplants[powerplantValue].city} </div>
      </div>`;
  });
  return html;
};

const generateResourcesHTML = function(playerResources) {
  const resources = Object.keys(playerResources);
  let html = "";
  resources.forEach(resource => {
    html += `<div class="player-resource">
      ${resourceIcons[resource]}:${playerResources[resource]}
    </div>`;
  });
  return html;
};

const updateCurrentPlayer = function() {
  fetch("/currentPlayer/update");
};

const displayCurrentPlayer = function(color) {
  const allPlayerElements = document.querySelectorAll(".player-profile");
  const currentPlayerElement = document.querySelector(`.player-color-${color}`);
  allPlayerElements.forEach(element => (element.style.borderBottom = "none"));
  currentPlayerElement.style.borderBottom = `10px solid ${color}`;
};

const handleInteraction = function(currentId, reqId) {
  document.querySelector(".freeze").style.visibility = "visible";
  if (currentId == reqId) {
    document.querySelector(".freeze").style.visibility = "hidden";
  }
};

const handleTurn = function(player) {
  const playerId = readCookie(document.cookie).playerId;
  displayCurrentPlayer(player.color);
  handleInteraction(player.id, playerId);
};

const getCurrentPlayer = function() {
  fetch("/currentPlayer")
    .then(res => res.json())
    .then(player => {
      handleTurn(player);
    });
};

const getPlayersDetails = function() {
  fetch("/players")
    .then(res => res.text())
    .then(players => {
      showPlayerDetails(players);
    });
};

const readCookie = text => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  text
    .split(";")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

const showPlayerAssets = function(players) {
  showPlayerDetails(players);
  polling();
};

const displayStat = function(elementId, position, value) {
  const element = document.getElementById(elementId);
  element.children[0].children[position].innerText = value;
};

const displayHTML = function(elementId, position, html) {
  document.getElementById(elementId).children[position].innerHTML = html;
};

const showPlayerDetails = function(players) {
  const users = JSON.parse(players);
  users.forEach(player => {
    const powerplantHTML = generatePowerplantHTML(player.powerplants);
    const resourceHTML = generateResourcesHTML(player.resources);
    const elementId = `${player.name}_${player.color}`;
    displayStat(elementId, 0, player.name);
    displayStat(elementId, 1, `$${player.money}`);
    displayHTML(elementId, 2, `<i class="fas fa-home"></i>${player.cities}`);
    displayHTML(elementId, 1, powerplantHTML);
    displayHTML(elementId, 2, resourceHTML);
  });
};
