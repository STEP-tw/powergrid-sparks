const resourceIcons = {
  garbage: '<i class="fas fa-trash-alt"></i>',
  coal: '<i class="fas fa-cubes"></i>',
  oil: '<i class="fas fa-oil-can"></i>',
  uranium: '<i class="fas fa-radiation-alt"></i>',
  hybrid: '<i class="fas fa-hands-helping"></i>',
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
  fetch("/updateCurrentPlayer");
};

const getCurrentPlayer = function() {
  setInterval(() => {
    fetch("/currentPlayer")
    .then(res => res.json())
    .then(player => {
      const playerId = readArgs(document.cookie).playerId;
        document
          .querySelectorAll(".player-profile")
          .forEach(element => (element.style.border = "none"));
        document.querySelector(`.player-color-${player.color}`).style.border =
          "10px solid white";
        document.querySelector(".freeze").style.visibility = "visible";
        if (player.id == playerId) {
          document.querySelector(".freeze").style.visibility = "hidden";
        }
      });
  }, 2000);
};

const startInteraction = function() {
  fetch("/currentPlayer")
    .then(res => res.json())
    .then(player => {
      setInterval(() => {
        document.querySelector(".freeze").style.visibility = "visible";
        if (player.id == playerId) {
          document.querySelector(".freeze").style.visibility = "hidden";
        }
      }, 2000);
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
  getCurrentPlayer();
  // document.querySelector('.freeze').style.visibility = 'hidden';
  const users = JSON.parse(players);
  users.forEach(player => {
    const powerplantHTML = generatePowerplantHTML(player.powerplants);
    const resourceHTML = generateResourcesHTML(player.resources);
    document.getElementById(
      `${player.name}_${player.color}`
    ).children[1].innerHTML = powerplantHTML;
    document.getElementById(
      `${player.name}_${player.color}`
    ).children[2].innerHTML = resourceHTML;
  });
};
