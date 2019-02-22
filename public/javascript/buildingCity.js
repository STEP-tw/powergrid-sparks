let selectedCities = [];

const updateCost = function() {
  const houseId = event.target.id.split("_");
  selectedCities.push(event.target);
  const cityCost = +houseId[houseId.length - 1];
  const currentCost = +document.getElementById("building-cost").innerText;
  if (event.target.className.baseVal == "highlighted") {
    event.target.className.baseVal = undefined;
    const totalCost = currentCost - cityCost;
    selectedCities = selectedCities.filter(selectedCity => {
      return selectedCity.id != event.target.id;
    });
    document.getElementById("building-cost").innerText = totalCost;
    const cities = [];
    selectedCities.forEach(selectedCity => cities.push(selectedCity.id));
    document.getElementById("city-names").innerText = cities;
    document.getElementById("city-count").innerText = totalCost / 10;
    return;
  }
  event.target.className.baseVal = "highlighted";
  const totalCost = cityCost + currentCost;
  const cities = [];
  selectedCities.forEach(selectedCity => cities.push(selectedCity.id));
  document.getElementById("building-cost").innerText = totalCost;
  document.getElementById("city-names").innerText = cities;
  document.getElementById("city-count").innerText = totalCost / 10;
};

const reset = function() {
  selectedCities.forEach(city => {
    city.className.baseVal = undefined;
  });
  document.getElementById("building-cost").innerText = 0;
  selectedCities = [];
  document.getElementById("city-count").innerText = 0;
  document.getElementById("city-names").innerText = "";
};

const buildCities = function() {
  const price = document.getElementById("building-cost").innerText;
  const cityCount = document.getElementById("city-count").innerText;
  const cityNames = document.getElementById("city-names").innerText;
  fetch("/buildCities", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `price=${price}&cityCount=${cityCount}&cityNames=${cityNames}`
  })
    .then(res => res.json())
    .then(player => {
      if (player.ispaymentSucess) {
        return updateMap(player.currentPlayer);
      }
      document.getElementById("payment-failed").innerText ="building failed try again"
      reset();
    });
};

const updateMap = function(player) {
  const playerColor = player.color;
  const cityNames = player.cityNames;
  cityNames.forEach(cityName => {
    document.getElementById(cityName).style.fill = playerColor;
    document.getElementById(cityName).onclick = "";
  });
  reset();
  updateCurrentPlayer();
};
