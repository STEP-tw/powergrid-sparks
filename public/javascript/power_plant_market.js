const currentMarketCards = {};

const resources = {
  Garbage: '<i class="fas fa-trash-alt"></i>',
  Coal: '<i class="fas fa-cubes"></i>',
  Oil: '<i class="fas fa-oil-can"></i>',
  Uranium: '<i class="fas fa-radiation-alt"></i>',
  Hybrid: '<i class="fas fa-hands-helping"></i>'
};

const initialMarketCount = {
  coal: 24,
  oil: 18,
  garbage: 6,
  uranium: 2
};

const displayMarket = function() {
  const map = document.getElementById("map");
  map.onclick = "";
  fetch("/displayPowerPlantMarket")
    .then(res => res.text())
    .then(res => displayPowerPlantMarket(res));
};

const displayPowerPlantMarket = function(powerPlantCards) {
  const map = document.getElementById("map");
  map.innerHTML = "";
  map.appendChild(generatePowerPlantMarket(powerPlantCards));
  fillResources();
};

const fillResources = function() {
  fillResource("coal");
  fillResource("oil");
  fillResource("garbage");
  document.getElementById("uranium_14_0").className = "uranium";
  document.getElementById("uranium_16_0").className = "uranium";
};

const generateResource = function(resource, resourceCount) {
  let resourceId = `${resource}_${Math.ceil(
    resourceCount / 3
  )}_${resourceCount % 3}`;
  let resourceDiv = document.getElementById(resourceId);
  resourceDiv.className = resource;
};

const fillResource = function(resource) {
  const maxCount = 24;
  for (
    let resourceCount = maxCount;
    resourceCount > maxCount - initialMarketCount[resource];
    resourceCount--
  ) {
    generateResource(resource, resourceCount);
  }
};

const generatePowerPlantMarket = function(powerPlantCards) {
  const powerPlants = JSON.parse(powerPlantCards);
  const currentMarketDiv = generateCurrentMarket(powerPlants);
  const futureMarketDiv = generateFutureMarket(powerPlants);
  const resourceMarketDiv = generateResourceMarketDiv();
  const marketDiv = document.createElement("div");
  marketDiv.appendChild(currentMarketDiv);
  marketDiv.appendChild(futureMarketDiv);
  const biddingDiv = generateDiv("bidding-section");
  biddingDiv.innerHTML = getBiddingSectionTemplate();
  marketDiv.appendChild(biddingDiv);
  marketDiv.appendChild(resourceMarketDiv);
  return marketDiv;
};

const generateCurrentMarket = function(powerPlants) {
  const currentMarketDiv = generateDiv("single-market", "currentMarket");
  const currentMarket = Object.keys(powerPlants).slice(0, 4);
  currentMarket.map(powerPlant => {
    return arrangeCurrentMarket(
      currentMarketDiv,
      powerPlant,
      powerPlants[powerPlant]
    );
  });
  return currentMarketDiv;
};

const generateFutureMarket = function(powerPlants) {
  const futureMarketDiv = generateDiv("single-market", "futureMarket");
  const futureMarket = Object.keys(powerPlants).slice(4);
  futureMarket.map(powerPlant =>
    arrangeFutureMarket(futureMarketDiv, powerPlant, powerPlants[powerPlant])
  );
  return futureMarketDiv;
};

const generateResourceMarketDiv = function() {
  const resourceDiv = generateDiv("resource-market", "resourceMarket");
  resourceDiv.innerHTML = getResourceMarketTemplate();
  return resourceDiv;
};

const arrangeCurrentMarket = function(singleMarket, powerPlant, cardDetails) {
  const powerPlantCardId = `powerPlant_${powerPlant}`;
  const powerPlantCardDiv = generateDiv("unselectedCard", powerPlantCardId);
  powerPlantCardDiv.onclick = addFocus.bind(null, powerPlantCardDiv);
  const priceDiv = generatePriceDiv(powerPlant);
  const resourceDiv = generateResourceDiv(cardDetails);
  powerPlantCardDiv.appendChild(priceDiv);
  powerPlantCardDiv.appendChild(resourceDiv);
  singleMarket.appendChild(powerPlantCardDiv);
  currentMarketCards[powerPlant] = {
    isSelected: false,
    powerplant: powerPlantCardDiv
  };
};

const arrangeFutureMarket = function(singleMarket, powerPlant, cardDetails) {
  const powerPlantCardId = `powerPlant_${powerPlant}`;
  const powerPlantCardDiv = generateDiv("unselectedCard", powerPlantCardId);
  const priceDiv = generatePriceDiv(powerPlant);
  const resourceDiv = generateResourceDiv(cardDetails);
  powerPlantCardDiv.appendChild(priceDiv);
  powerPlantCardDiv.appendChild(resourceDiv);
  singleMarket.appendChild(powerPlantCardDiv);
};

const addFocus = function(element) {
  Object.keys(currentMarketCards).forEach(card => {
    currentMarketCards[card].isSelected = false;
    currentMarketCards[card].powerplant.className = "unselectedCard";
  });
  const id = element.id.slice(-1);
  currentMarketCards[id].isSelected = true;
  element.className = "selectedCard";
};

const generateResourceDiv = function(cardDetails) {
  const resourceDiv = document.createElement("div");
  resourceDiv.innerHTML = `${resources[cardDetails.resource.type]} 
                               ${cardDetails.resource.quantity} 
                               <i class='fas fa-arrow-right' ></i >  
                               <i class="fas fa-house-damage"></i>
                               ${cardDetails.city}`;
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
