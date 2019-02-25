const getLightedCities = function(){
  const buildingPhase = document.getElementById("building-phase");
  buildingPhase.innerHTML = '<input type="text" name="select Lighted cities" id="lighted-cities" placeholder="enter number of cities to light">'
  buildingPhase.innerHTML += '<button onclick="lightCities()">Submit</button>'
  buildingPhase.innerHTML += '<div id="err-msg"></div>'
}

const validateLightedCities = function(bureaucracy) {
  if (bureaucracy.hasEnoughCities) {
    document.getElementById('building-phase').innerHTML = "";
    return;
  }
  document.getElementById("err-msg").innerText = " you dont have enough cities";
  document.getElementById("lighted-cities").value = "";
};

const lightCities = function() {
  const cityToLight = document.getElementById("lighted-cities").value;
  const body = `city=${cityToLight}`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  fetch("/cities/light", { method: "POST", headers, body })
    .then(res => res.json())
    .then(validateLightedCities)
};