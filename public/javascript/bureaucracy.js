const selectedPowerPlant = [];

const getLightedCities = function() {
  const buildingPhase = document.getElementById("building-phase");
  buildingPhase.innerHTML =
    '<input class="city-count" autocomplete="off" type="text" id="lighted-cities" placeholder="Enter number of cities to light">';
  buildingPhase.innerHTML +=
    '<div class="select-powerplant" id="select-powerplant"></div>';
  buildingPhase.innerHTML += '<button class="bid-option" onclick="disableOnclick()">Done</button>';
  buildingPhase.innerHTML += '<button class="bid-option" id="submit">Submit</button>';
  buildingPhase.innerHTML += '<div id="err-msg"></div>';
  document.getElementById("submit").style.visibility = "hidden";
};

const disableOnclick = function() {
  const powerplantDiv = document.getElementById("select-powerplant");
  const allPowerplants = powerplantDiv.childNodes;
  allPowerplants.forEach(powerplant => (powerplant.onclick = null));
  fetch("/playerResources")
    .then(res => res.json())
    .then(validatePlayerResources);
};

const validateLightedCities = function(bureaucracy) {
  if (bureaucracy.hasEnoughCities) {
    document.getElementById("building-phase").innerHTML = "";
    return;
  }
  document.getElementById("err-msg").innerText = " you dont have enough cities";
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
  document.getElementById("submit").onclick = null;
  document.getElementById("err-msg").innerText = "unsufficient resources";
  const powerplantDiv = document.getElementById("select-powerplant");
  const allPowerplants = powerplantDiv.childNodes;
  allPowerplants.forEach(powerplant => (powerplant.onclick = selectDiv));
  return (isCityCountValid = false);
};

const DisplayPowerplantErrMsg = function(city) {
  const powerplantDiv = document.getElementById("select-powerplant");
  const allPowerplants = powerplantDiv.childNodes;
  allPowerplants.forEach(powerplant => (powerplant.onclick = selectDiv));
  const errMsg = `selected powerplant can not light more than ${city} city`;
  document.getElementById("submit").onclick = null;
  document.getElementById("err-msg").innerText = errMsg;
};

const validatePlayerResources = function(userInfo) {
  let isCityCountValid = true;
  const { powerplants, resources } = userInfo;
  const playerAssets = getPlayerAssets(powerplants);
  const allResources = Object.keys(playerAssets);
  const city = playerAssets[allResources.pop()];
  const hybridResource = playerAssets[allResources.pop()];
  const citiesToLight = document.getElementById("lighted-cities").value;
  if (citiesToLight > city) return DisplayPowerplantErrMsg(city);
  allResources.forEach(resource => {
    const hasResource = playerAssets[resource] > resources[resource];
    if (hasResource) isCityCountValid = displayUnsufficientResources();
    resources[resource] -= playerAssets[resource];
  });
  const hasHybridResource =
    resources["Oil"] < hybridResource && resources["Coal"] < hybridResource;
  if (hasHybridResource) isCityCountValid = displayUnsufficientResources();
  isCityCountValid && updateUserResources(resources, hybridResource);
};

const updateUserResources = function(resources, hybridResource) {
  let hasDeducted = false;
  document.getElementById("err-msg").innerText = "";
  document.getElementById("submit").style.visibility = "visible";
  document.getElementById("submit").onclick = lightCities;
  selectedPowerPlant.splice(0);
  if (resources.Coal >= hybridResource) {
    resources.Coal -= hybridResource;
    hasDeducted = true;
  }
  !hasDeducted && (resources.Oil -= hybridResource);
  const body = `resources=${JSON.stringify(resources)}`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  fetch("/returnResources", { method: "POST", headers, body });
};

const updatePowerplantInfo = function(powerplants) {
  let html = "";
  const powerplantVelue = Object.keys(powerplants);
  powerplantVelue.forEach(
    powerplant =>
      (html += `<div class="powerplant" onclick="selectDiv()">${powerplant}</div>`)
  );
  document.getElementById("select-powerplant").innerHTML = html;
};

const clickPowerplant = function(powerplantDiv) {
  const clickBorder = "2px solid black";
  const powerPlantValue = powerplantDiv.innerText;
  powerplantDiv.style.border = clickBorder;
  selectedPowerPlant.push(powerPlantValue);
};

const unclickPowerplant = function(powerplantDiv) {
  const unclickBorder = "1px solid #4c5061";
  const powerPlantValue = powerplantDiv.innerText;
  powerplantDiv.style.border = unclickBorder;
  const indexOfPowerPlant = selectedPowerPlant.indexOf(powerPlantValue);
  selectedPowerPlant.splice(indexOfPowerPlant, 1);
};

const selectDiv = function() {
  const clickBorder = "2px solid black";
  const powerplantDiv = event.target;
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
