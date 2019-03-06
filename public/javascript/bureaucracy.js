const selectedPowerPlant = [];

const getLightedCities = function() {
  const buildingPhase = document.getElementById("bidding-section");
  const heading = "<span>Select No. Of Cites :</span>";
  buildingPhase.innerHTML =
    heading +
    '<input min="0" max="21" class="city-count" value="0" autocomplete="off" type="number" id="lighted-cities">';
  buildingPhase.innerHTML +=
    '<button class="bid-option" id="submit">Submit</button>';
  document.getElementById("submit").onclick = validatePlayerAssets;
};

const validatePlayerAssets = function() {
  fetch("/cities/light")
    .then(res => res.json())
    .then(validatePlayerResources);
};

const validateLightedCities = function(bureaucracy) {
  if (bureaucracy.hasEnoughCities) {
    document.getElementById("building-phase").innerHTML = "";
    return;
  }
  setInnerText("err-msg", " you dont have enough cities");
  document.getElementById("lighted-cities").value = "";
};

const getPlayerAssets = function(powerplants) {
  const details = {
    Coal: 0,
    Garbage: 0,
    Oil: 0,
    Uranium: 0,
    Hybrid: 0,
    cities: 0
  };
  selectedPowerPlant.forEach(powerplant => {
    const resourceType = powerplants[powerplant].resource.type;
    const quantity = powerplants[powerplant].resource.quantity;
    details[resourceType] += quantity;
    details.cities += powerplants[powerplant].city;
  });
  return details;
};

const displayUnsufficientResources = function(isCityCountValid) {
  setInnerText("err-msg", "insufficient resources");
  const powerplantDiv = document.getElementById("select-powerplant");
  const allPowerplants = powerplantDiv.childNodes;
  allPowerplants.forEach(powerplant => (powerplant.onclick = selectDiv));
  return (isCityCountValid = false);
};

const DisplayPowerplantErrMsg = function(city) {
  const errMsg = `selected powerplant can not light more than ${city} city`;
  setInnerText("err-msg", errMsg);
};

const displayCityErrMsg = function() {
  const errMsg = `You don't have enough cities`;
  setInnerText("err-msg", errMsg);
};

const validatePlayerResources = function(userInfo) {
  let isCityCountValid = true;
  const { powerplants, cityCount, resources } = userInfo;
  const playerAssets = getPlayerAssets(powerplants);
  const allResources = Object.keys(playerAssets);
  const playerCities = playerAssets[allResources.pop()];
  const hybridResource = playerAssets[allResources.pop()];
  const cities = document.getElementById("lighted-cities").value;
  if (cities > cityCount) return displayCityErrMsg();
  if (cities > playerCities) return DisplayPowerplantErrMsg(playerCities);
  allResources.forEach(resource => {
    const hasResource = playerAssets[resource] > resources[resource];
    if (hasResource) isCityCountValid = displayUnsufficientResources();
    resources[resource] -= playerAssets[resource];
  });
  const hasHybridResource =
    resources["Oil"] < hybridResource && resources["Coal"] < hybridResource;
  if (hasHybridResource) isCityCountValid = displayUnsufficientResources();
  isCityCountValid && updateUserResources(resources, hybridResource, cities);
};

const updateUserResources = function(resources, hybridResource, cityCount) {
  let hasDeducted = false;
  const msg = `${cityCount} cities lighted successfully`;
  setInnerText("err-msg", msg);
  selectedPowerPlant.splice(0);
  if (resources.Coal >= hybridResource) {
    resources.Coal -= hybridResource;
    hasDeducted = true;
  }
  !hasDeducted && (resources.Oil -= hybridResource);
  const body = `resources=${JSON.stringify(resources)}&cityCount=${cityCount}`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  fetch("/returnResources", { method: "POST", headers, body });
  updateCurrentPlayer();
};

const updatePowerplantInfo = function(powerplants) {
  const allPowerplants = generateMarket(powerplants, 0, 3, "map123");
  const bureaucracyDiv = document.getElementById("map");
  const heading = generateDiv("bureaucracy-heading", "");
  heading.innerText = "Select powerplant to light cities";
  bureaucracyDiv.innerHTML = "";
  const msgDiv = generateDiv("bureaucracy-err-msg", "err-msg");
  appendChildren(bureaucracyDiv, [heading, allPowerplants, msgDiv]);
  const market = bureaucracyDiv.childNodes;
  const playersPowerplant = market[1].childNodes;
  playersPowerplant.forEach(powerplant => {
    powerplant.onclick = selectDiv.bind(null, powerplant);
  });
};

const clickPowerplant = function(powerplantDiv) {
  const clickBorder = "2px solid black";
  const powerPlantValue = powerplantDiv.childNodes[0].childNodes[0].innerText;
  powerplantDiv.style.border = clickBorder;
  selectedPowerPlant.push(powerPlantValue);
};

const unclickPowerplant = function(powerplantDiv) {
  const powerPlantValue = powerplantDiv.childNodes[0].childNodes[0].innerText;
  powerplantDiv.style.border = null;
  const indexOfPowerPlant = selectedPowerPlant.indexOf(powerPlantValue);
  selectedPowerPlant.splice(indexOfPowerPlant, 1);
};

const selectDiv = function(powerplantDiv) {
  const clickBorder = "2px solid black";
  if (powerplantDiv.style.border == clickBorder) {
    return unclickPowerplant(powerplantDiv);
  }
  clickPowerplant(powerplantDiv);
};

const createPowerplantDiv = function(powerplants) {
  let html = "";
  powerplants.forEach(powerplant => {
    html += `<div class="powerplant">${powerplant}</div>`;
  });
  return html;
};

const selectPowerplant = function() {
  fetch("/player/powerplants")
    .then(res => res.json())
    .then(updatePowerplantInfo);
};

const lightCities = function() {
  const cityToLight = document.getElementById("lighted-cities").value;
  const body = `city=${cityToLight}`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  fetch("/cities/light", { method: "POST", headers, body })
    .then(res => res.json())
    .then(validateLightedCities);
};
