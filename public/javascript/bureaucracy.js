const selectedPowerPlant = [];

const getLightedCities = function() {
  const buildingPhase = document.getElementById("bidding-section");
  const heading = "<span>Select No. Of Cites :</span>";
  buildingPhase.innerHTML =
    heading+'<input min="0" max="21" class="city-count" value="0" autocomplete="off" type="number" id="lighted-cities">';
  buildingPhase.innerHTML +=
    '<div class="select-powerplant" id="select-powerplant"></div>';
  buildingPhase.innerHTML += '<button class="bid-option" id="submit">Submit</button>';
  buildingPhase.innerHTML += '<div class="bureaucracy-err-msg" id="err-msg"></div>';
  document.getElementById("submit").onclick = validatePlayerAssets;
  document.getElementById("err-msg").style.visibility = "hidden";
};

const validatePlayerAssets = function() {
  fetch("/cities/light")
    .then(res => res.json())
    .then(validatePlayerResources)
};

const validateLightedCities = function(bureaucracy) {
  if (bureaucracy.hasEnoughCities) {
    document.getElementById("building-phase").innerHTML = "";
    return;
  }
  document.getElementById("err-msg").style.visibility = "visible";
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
  document.getElementById("err-msg").style.visibility = "visible";
  document.getElementById("err-msg").innerText = "insufficient resources";
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
  document.getElementById("err-msg").style.visibility = "visible";
  document.getElementById("err-msg").innerText = errMsg;
};

const displayCityErrMsg = function(){
  const errMsg = `You don't have enough cities`;
  document.getElementById("err-msg").style.visibility = "visible";
  document.getElementById("err-msg").innerText = errMsg;
}

const validatePlayerResources = function(userInfo) {
  let isCityCountValid = true;
  const { powerplants, cityCount, resources } = userInfo;
  const playerAssets = getPlayerAssets(powerplants);
  const allResources = Object.keys(playerAssets);
  const playerCities = playerAssets[allResources.pop()];
  const hybridResource = playerAssets[allResources.pop()];
  const cities = document.getElementById("lighted-cities").value;
  if(cities > cityCount) return displayCityErrMsg();
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
  const cities = {1:"city", 2:"cities"}
  const msg = `${cityCount} ${cities[cityCount] || cities} lighted successfully`;
  document.getElementById("err-msg").innerText = msg;
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

const displayLightedCities = function(city) {
  document.getElementById("err-msg").innerText = msg;
  setTimeout(() => {
    messageContainer.innerText = "";
  }, 5000);
  messageContainer.innerText = "insufficient money";
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
