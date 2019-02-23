const selectedCities = [];

const updateCost = function() {
  const houseDetails = event.target.id.split('_');
  const cityCost = +houseDetails[houseDetails.length - 1];
  const currentCost = +getInnerText('building-cost');
  if (event.target.className.baseVal == 'highlighted') {
    return deselectCity(currentCost, cityCost);
  }
  selectCity(cityCost, currentCost);
};

const reset = function() {
  selectedCities.forEach(city => {
    city.className.baseVal = undefined;
  });
  selectedCities.splice(0);
  generateHTML(0, selectedCities);
};

const buildCities = function() {
  const { price, cityCount, cityNames } = getSelectedCitiesDetails();
  const body = `price=${price}&cityCount=${cityCount}&cityNames=${cityNames}`;
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  fetch('/buildCities', { method: 'POST', headers, body })
    .then(res => res.json())
    .then(player => {
      if (player.isPaymentSuccess) {
        updateMap(player.currentPlayer);
        reset();
        updateCurrentPlayer();
        return;
      }
      setInnerText('payment-failed', 'Building failed!!! Insuffient money');
      reset();
    });
};

const refreshMap = function(){
  fetch('/getPlayers')
    .then(res => res.json())
    .then(players => {
      players.forEach(player=> updateMap(player))
    })
}

const updateMap = function(player) {
  const playerColor = player.color;
  const cityNames = player.cityNames;
  cityNames.forEach(cityName => {
    updateCity(cityName, playerColor);
  });
};

const getInnerText = function(id) {
  return document.getElementById(id).innerText;
};

const setInnerText = function(id, text) {
  document.getElementById(id).innerText = text;
};

const setInnerHTML = function(id, cities) {
  document.getElementById(id).innerHTML = 'Selected Cities: ';
  cities.forEach(city => {
    document.getElementById(id).innerHTML += `&nbsp<div>${city}</div>`;
  });
};

const updateCity = function(cityName, playerColor) {
  if(cityName.length < 2) return;
  document.getElementById(cityName).style.fill = playerColor;
  document.getElementById(cityName).onclick = '';
};

const getSelectedCitiesDetails = function() {
  const price = +getInnerText('building-cost');
  const cityCount = getInnerText('city-count');
  const cityNames = getInnerText('selected-cities');
  return { price, cityCount, cityNames };
};

const deselectCity = function(currentCost, cityCost) {
  event.target.className.baseVal = undefined;
  const totalCost = currentCost - cityCost;
  selectedCities.splice(selectedCities.indexOf(event.target), 1);
  const cities = [];
  selectedCities.forEach(selectedCity => cities.push(selectedCity.id));
  generateHTML(totalCost, cities);
};

const selectCity = function(cityCost, currentCost) {
  selectedCities.push(event.target);
  event.target.className.baseVal = 'highlighted';
  const totalCost = cityCost + currentCost;
  const cities = [];
  selectedCities.forEach(selectedCity => cities.push(selectedCity.id));
  generateHTML(totalCost, cities);
};

const generateHTML = function(totalCost, cities) {
  setInnerText('building-cost', totalCost);
  setInnerHTML('selected-cities', cities);
  setInnerText('city-count', cities.length);
};
