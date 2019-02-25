const currentMarketCards = {};

const selectedPowerPlants = [];

const resources = {
  Garbage: '<i class="fas fa-trash-alt"></i>',
  Coal: '<i class="fas fa-cubes"></i>',
  Oil: '<i class="fas fa-oil-can"></i>',
  Uranium: '<i class="fas fa-radiation-alt"></i>',
  Hybrid: '<i class="fas fa-hands-helping"></i>',
  Ecological: '<i class="fas fa-bolt"></i>'
};

const increaseBid = function() {
  const currentBid = document.getElementById("bid-amount").innerText;
  document.getElementById("bid-amount").innerText = +currentBid + 1;
};

const fetchMarket = function() {
  fetch("/powerPlantMarket")
    .then(res => res.json())
    .then(powerPlantCards => {
      displayPowerPlantMarket(powerPlantCards);
    });
};

const displayPowerPlantMarket = function(powerPlantCards) {
  const market = document.getElementById("market");
  market.appendChild(generatePowerPlantMarket(powerPlantCards));
};

const persistCardClass = function(currentMarketDiv) {
  const id = selectedPowerPlants[0];
  currentMarketDiv.childNodes.forEach(node => {
    if (node.id == id) {
      node.className = "selected-card";
    }
  });
};

const updatePriceDiv = function(price) {
  document.getElementById("current-bid-amount").innerText = price;
  document.getElementById("bid-amount").innerText = price;
};

const handleMarketState = function(state, powerPlantDiv, powerPlantCost) {
  if (state == "currentMarket") {
    powerPlantDiv.onclick = addFocus.bind(null, powerPlantDiv);
    currentMarketCards[powerPlantCost] = {
      isSelected: false,
      powerplant: powerPlantDiv
    };
  }
};

const generatePowerPlantInfo = function(powerPlantDetails) {
  const infoDiv = document.createElement("div");
  infoDiv.className = "card-details";
  infoDiv.innerHTML = `${resources[powerPlantDetails.resource.type]} 
                               ${powerPlantDetails.resource.quantity} 
                               <i class='fas fa-arrow-right' ></i >  
                               <i class="fas fa-house-damage"></i>
                               ${powerPlantDetails.city}`;
  return infoDiv;
};

const arrangeMarket = function(market, powerPlantCost, powerPlantDetails) {
  const powerPlantId = `powerPlant_${powerPlantCost}`;
  const powerPlantDiv = generateDiv("unselected-card", powerPlantId);
  const priceDiv = generatePowerPlantPriceDiv(powerPlantCost);
  const resourceDiv = generatePowerPlantInfo(powerPlantDetails);
  appendChildren(powerPlantDiv, [priceDiv, resourceDiv]);
  market.appendChild(powerPlantDiv);
  handleMarketState(market.id, powerPlantDiv, powerPlantCost);
};

const generateMarket = function(powerPlants, startingIndex, endingIndex, id) {
  const marketDiv = generateDiv("single-market", id);
  const market = Object.keys(powerPlants).slice(startingIndex, endingIndex);
  market.forEach(powerPlant =>
    arrangeMarket(marketDiv, powerPlant, powerPlants[powerPlant])
  );
  return marketDiv;
};

const displayPowerPlants = function(powerPlants) {
  const currentMarketDiv = generateMarket(powerPlants, 0, 4, "currentMarket");
  const futureMarketDiv = generateMarket(powerPlants, 4, 8, "futureMarket");
  const powerPlantDiv = generateDiv("power-plant-cards", "power-plant-cards");
  appendChildren(powerPlantDiv, [currentMarketDiv, futureMarketDiv]);
  persistCardClass(currentMarketDiv);
  const market = document.getElementById("market").children[0];
  market.replaceChild(powerPlantDiv, market.childNodes[0]);
};

const fetchCurrentPowerPlants = function() {
  fetch("/currentPowerPlants")
    .then(res => res.json())
    .then(displayPowerPlants);
};

const generateBidDiv = function() {
  const biddingDiv = generateDiv("bidding-section", "bidding-section");
  biddingDiv.innerHTML = getBiddingSectionTemplate();
  return biddingDiv;
};

const generatePowerPlantMarket = function(powerPlantCards) {
  const powerPlants = powerPlantCards;
  const powerPlantDiv = generateDiv("power-plant-cards", "power-plant-cards");
  const currentMarketDiv = generateMarket(powerPlants, 0, 4);
  const futureMarketDiv = generateMarket(powerPlants, 4, 8);
  appendChildren(powerPlantDiv, [currentMarketDiv, futureMarketDiv]);
  const resourceMarketDiv = generateResourceMarketDiv();
  const biddingDiv = generateBidDiv();
  const marketDiv = document.createElement("div");
  marketDiv.className = "market-div";
  appendChildren(marketDiv, [powerPlantDiv, biddingDiv, resourceMarketDiv]);
  return marketDiv;
};

const generatePowerPlantPriceDiv = function(powerPlantCost) {
  const priceDiv = generateDiv("price-details");
  const price = generateDiv("price");
  price.innerHTML = powerPlantCost;
  priceDiv.appendChild(price);
  return priceDiv;
};

const buyPowerplant = function() {
  const price = document.getElementById("current-bid-amount").innerText;
  document.getElementById("current-bid-amount").innerText = 0;
  document.getElementById("bid-amount").innerText = 0;
  fetch("/powerPlant/buy", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `price=${price}`
  });
  updateCurrentPlayer();
};

const addPowerPlantToPlayer = function(count, powerPlants, powerPlantCost) {
  const powerPlantDiv = document.getElementById(`powerplant-${count++}`);
  powerPlantDiv.innerHTML = "";
  arrangeMarket(powerPlantDiv, powerPlantCost, powerPlants[powerPlantCost]);
};
