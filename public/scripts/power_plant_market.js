const resources = {
  Garbage: '<i class="fas fa-trash-alt"></i>',
  Coal: '<i class="fas fa-cubes"></i>',
  Oil: '<i class="fas fa-oil-can"></i>',
  Uranium: '<i class="fas fa-radiation-alt"></i>',
  Hybrid: '<i class="fas fa-hands-helping"></i>'
};

const displayMarket = function() {
  fetch("/displayPowerPlantMarket")
    .then(res => res.text())
    .then(res => displayPowerPlantMarket(res));
};

const displayPowerPlantMarket = function(powerPlantCards) {
  const map = document.getElementById("map");
  map.innerHTML = "";
  map.appendChild(generatePowerPlantMarket(powerPlantCards));
};

const generatePowerPlantMarket = function(powerPlantCards) {
  const powerPlants = JSON.parse(powerPlantCards);
  const currentMarketDiv = generateCurrentMarket(powerPlants);
  const futureMarketDiv = generateFutureMarket(powerPlants);
  const marketDiv = document.createElement("div");
  marketDiv.appendChild(currentMarketDiv);
  marketDiv.appendChild(futureMarketDiv);
  return marketDiv;
};

const generateCurrentMarket = function(powerPlants) {
  const currentMarketDiv = generateDiv("single-market", "currentMarket");
  const currentMarket = Object.keys(powerPlants).slice(0, 4);
  currentMarket.map(powerPlant =>
    appendPowerPlantCard(currentMarketDiv, powerPlant, powerPlants[powerPlant])
  );
  return currentMarketDiv;
};

const generateFutureMarket = function(powerPlants) {
  const futureMarketDiv = generateDiv("single-market", "futureMarket");
  const futureMarket = Object.keys(powerPlants).slice(4);
  futureMarket.map(powerPlant =>
    appendPowerPlantCard(futureMarketDiv, powerPlant, powerPlants[powerPlant])
  );
  return futureMarketDiv;
};

const appendPowerPlantCard = function(singleMarket, powerPlant, cardDetails) {
  const powerPlantCardId = `powerPlant_${powerPlant}`;
  const powerPlantCardDiv = generateDiv("power-plant-card", powerPlantCardId);
  const priceDiv = generatePriceDiv(powerPlant);
  const resourceDiv = generateResourceDiv(cardDetails);
  powerPlantCardDiv.appendChild(priceDiv);
  powerPlantCardDiv.appendChild(resourceDiv);
  singleMarket.appendChild(powerPlantCardDiv);
};

const generateResourceDiv = function(cardDetails) {
  const resourceDiv = document.createElement("div");
  resourceDiv.innerHTML = `${resources[cardDetails.type]} 
                               ${cardDetails.inputs} 
                               <i class='fas fa-arrow-right' ></i >  
                               <i class="fas fa-house-damage"></i>
                               ${cardDetails.output}`;
  return resourceDiv;
};

const generatePriceDiv = function(powerPlant) {
  const priceDiv = generateDiv("price-details");
  const price = generateDiv("price");
  price.innerHTML = powerPlant;
  priceDiv.appendChild(price);
  return priceDiv;
};

const generateDiv = function(className, id) {
  const divElement = document.createElement("div");
  divElement.className = className;
  divElement.id = id;
  return divElement;
};
