const selectedCities = [];

const getInnerText = function(id) {
  return document.getElementById(id).innerText;
};

const setInnerText = function(id, text) {
  document.getElementById(id).innerText = text;
};

const setInnerHTML = function(id, cities) {
  document.getElementById(id).innerHTML = "";
  cities.forEach(city => {
    const cityName = city.split("_");
    cityName.pop();
    let formattedCityName = cityName
      .map(name => name.charAt(0).toUpperCase() + name.slice(1))
      .join(" ");
    document.getElementById(id).innerHTML += `<div>${formattedCityName}</div>`;
  });
};

const generateHTML = function(totalCost, cities) {
  setInnerText("building-cost", totalCost);
  setInnerHTML("selected-cities", cities);
  setInnerText("city-count", cities.length);
};

const deselectCity = function() {
  event.target.className.baseVal = undefined;
  selectedCities.splice(selectedCities.indexOf(event.target), 1);
  updateBildCityCost();
};

const selectCity = function() {
  selectedCities.push(event.target);
  event.target.className.baseVal = "highlighted";
};

const updateCost = function() {
  const selectedHouse = event.target.id.split("_");
  const cityCost = +selectedHouse[selectedHouse.length - 1];
  const currentCost = +getInnerText("building-cost");
  if (event.target.className.baseVal == "highlighted") {
    return deselectCity(currentCost, cityCost);
  }
  selectCity(cityCost, currentCost);
  updateBildCityCost();
};

const updateBildCityCost = function() {
  const cities = [];
  selectedCities.forEach(selectedCity => cities.push(selectedCity.id));
  fetch("/buildingCost", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `selectedCities=${JSON.stringify(cities)}`
  })
    .then(res => res.text())
    .then(cost => {
      generateHTML(cost, cities);
    });
};

const reset = function() {
  selectedCities.forEach(city => {
    city.className.baseVal = undefined;
  });
  selectedCities.splice(0);
  generateHTML(0, selectedCities);
};

const takeBuildAction = function(player) {
  if (player.isPaymentSuccess) {
    setInnerText("payment-failed", "");
    reset();
    updateCurrentPlayer();
    return;
  }
  setInnerText("payment-failed", "Building failed!!! Insuffient money");
  reset();
};

const getSelectedCitiesDetails = function() {
  const price = +getInnerText("building-cost");
  const cityCount = getInnerText("city-count");
  const cityNames =
    "Selected Cities: \n" + selectedCities.map(city => city.id).join("\n");
  return { price, cityCount, cityNames };
};

const buildCities = function() {
  const { price, cityCount, cityNames } = getSelectedCitiesDetails();
  const body = `price=${price}&cityCount=${cityCount}&cityNames=${cityNames}`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  fetch("/cities/build", { method: "POST", headers, body })
    .then(res => res.json())
    .then(takeBuildAction);
};

const updateCity = function(cityName, playerColor) {
  if (cityName.length < 2) return;
  document.querySelectorAll(`#${cityName}`).forEach(city => {
    city.style.fill = playerColor;
    city.onclick = "";
    city.style.cursor = "inherit";
  });
};

const updateMap = function(player) {
  const playerColor = "#" + player.color.slice(1);
  const cityNames = player.cityNames;
  cityNames.forEach(cityName => {
    updateCity(cityName, playerColor);
  });
};

const refreshMap = function() {
  fetch("/players")
    .then(res => res.json())
    .then(players => {
      players.forEach(player => updateMap(player));
    });
};

const passBuildingCities = function() {
  fetch("/passBuildingCities")
    .then(res => res.json())
    .then(res => updateCurrentPlayer());
};
