let selectedCities = [];

const updateCost = function() {
  const houseId = event.target.id.split("_");
  selectedCities.push(event.target);
  const cityCost = +houseId[houseId.length - 1];
  const currentCost = +getInnerText("building-cost");
  if (event.target.className.baseVal == "highlighted") {
    event.target.className.baseVal = undefined;
    const totalCost = currentCost - cityCost;
    selectedCities = selectedCities.filter(selectedCity => {
      return selectedCity.id != event.target.id;
    });
    const cities = [];
    selectedCities.forEach(selectedCity => cities.push(selectedCity.id));
    const cityCount = totalCost / 10;
    setInnerText("building-cost", totalCost);
    setInnerText("city-names", cities);
    setInnerText("city-count", cityCount);
    return;
  }
  event.target.className.baseVal = "highlighted";
  const totalCost = cityCost + currentCost;
  const cities = [];
  selectedCities.forEach(selectedCity => cities.push(selectedCity.id));
  const cityCount = totalCost / 10;
  setInnerText("city-names", cities);
  setInnerText("building-cost", totalCost);
  setInnerText("city-count", cityCount);
};

const reset = function() {
  selectedCities.forEach(city => {
    city.className.baseVal = undefined;
  });
  setInnerText("building-cost", 0);
  selectedCities = [];
  setInnerText("city-count", 0);
  setInnerText("city-names", "");
};

const buildCities = function() {
  const { price, cityCount, cityNames } = getSelectedCitiesDetails();
  const body = `price=${price}&cityCount=${cityCount}&cityNames=${cityNames}`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  fetch("/buildCities", { method: "POST", headers, body })
    .then(res => res.json())
    .then(player => {
      if (player.ispaymentSucess) {
        return updateMap(player.currentPlayer);
      }
      setTimeout(() => {
        setInnerText("payment-failed", "");
      }, 10000);
      setInnerText("payment-failed", "building failed try again");
      reset();
    });
};

const updateMap = function(player) {
  const playerColor = player.color;
  const cityNames = player.cityNames;
  cityNames.forEach(cityName => {
    updateCity(cityName, playerColor);
  });
  reset();
  updateCurrentPlayer();
};

const getInnerText = function(id) {
  return document.getElementById(id).innerText;
};

const setInnerText = function(id, text) {
  document.getElementById(id).innerText = text;
};

const updateCity = function(cityName, playerColor) {
  document.getElementById(cityName).style.fill = playerColor;
  document.getElementById(cityName).onclick = "";
};

const getSelectedCitiesDetails = function() {
  const price = +getInnerText("building-cost");
  const cityCount = getInnerText("city-count");
  const cityNames = getInnerText("city-names");
  return { price, cityCount, cityNames };
};
