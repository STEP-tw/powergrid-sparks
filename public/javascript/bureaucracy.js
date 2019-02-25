const selectedPowerPlant = [];

const getLightedCities = function() {
  const buildingPhase = document.getElementById("building-phase");
  buildingPhase.innerHTML =
    '<input type="text" name="select Lighted cities" id="lighted-cities" placeholder="enter number of cities to light">';
  buildingPhase.innerHTML +=
    '<div class="select-powerplant" id="select-powerplant"></div>';
  buildingPhase.innerHTML += '<button onclick="lightCities()">Submit</button>';
  buildingPhase.innerHTML += '<div id="err-msg"></div>';
};

const validateLightedCities = function(bureaucracy) {
  if (bureaucracy.hasEnoughCities) {
    document.getElementById("building-phase").innerHTML = "";
    return;
  }
  document.getElementById("err-msg").innerText = " you dont have enough cities";
  document.getElementById("lighted-cities").value = "";
};

const updatePowerplantInfo = function(userInfo) {
  const { powerplants, resources } = userInfo;
  let html = "";
  const powerplantVelue = Object.keys(powerplants);
  powerplantVelue.forEach(
    powerplant =>
      (html += `<div class="powerplant" onclick="selectDiv()">${powerplant}</div>`)
  );
  document.getElementById("select-powerplant").innerHTML = html;
  console.log(selectedPowerPlant);
};

const clickPowerplant = function(powerplantDiv) {
  const clickBorder = "2px solid white";
  const powerPlantValue = powerplantDiv.innerText;
  powerplantDiv.style.border = clickBorder;
  selectedPowerPlant.push(powerPlantValue);
};

const unclickPowerplant = function(powerplantDiv){
  const unclickBorder = "2px solid #4c5061";
  const powerPlantValue = powerplantDiv.innerText;
  powerplantDiv.style.border = unclickBorder;
  const indexOfPowerPlant = selectedPowerPlant.indexOf(powerPlantValue);
  selectedPowerPlant.splice(indexOfPowerPlant, 1);
}

const selectDiv = function() {
  const unclickBorder = "2px solid rgb(76, 80, 97)";
  const powerplantDiv = event.target;
  if (powerplantDiv.style.border == unclickBorder){
    return clickPowerplant(powerplantDiv);
  }
  unclickPowerplant(powerplantDiv);
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
