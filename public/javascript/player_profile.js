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

const getCurrentPlayer = function() {
  setInterval(() => {
    fetch("/currentPlayer")
      .then(res => res.json())
      .then(player => {
        handleTurn(player);
      });
    getPowerplantDetails();
    showResourceMarket();
    getCurrentPowerPlants();
    getPlayerStatsDiv();
    refreshMap();
    getActivityLogs();
  }, 500);
};

const handleTurn = function(player) {
  const playerId = readArgs(document.cookie).playerId;
  document
    .querySelectorAll(".player-profile")
    .forEach(element => (element.style.borderBottom = "none"));
  document.querySelector(
    `.player-color-${player.color}`
  ).style.borderBottom = `10px solid ${player.color}`;
  document.querySelector(".freeze").style.visibility = "visible";
  if (player.id == playerId) {
    document.querySelector(".freeze").style.visibility = "hidden";
  }
};

const getPowerplantDetails = function() {
  fetch("/powerPlantDetails")
    .then(res => res.text())
    .then(players => {
      showPlayerDetails(players);
    });
};

const readArgs = text => {
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
  getCurrentPlayer();
};

const showPlayerDetails = function(players) {
  const users = JSON.parse(players);
  users.forEach(player => {
    const powerplantHTML = generatePowerplantHTML(player.powerplants);
    const resourceHTML = generateResourcesHTML(player.resources);
    document.getElementById(
      `${player.name}_${player.color}`
    ).children[0].children[0].innerText = `${player.name}`;
    document.getElementById(
      `${player.name}_${player.color}`
    ).children[0].children[1].innerText = `$${player.money}`;
    document.getElementById(
      `${player.name}_${player.color}`
    ).children[0].children[2].innerHTML = `<i class="fas fa-home"></i>${
      player.cities
    }`;
    document.getElementById(
      `${player.name}_${player.color}`
    ).children[1].innerHTML = powerplantHTML;
    document.getElementById(
      `${player.name}_${player.color}`
    ).children[2].innerHTML = resourceHTML;
  });
};
