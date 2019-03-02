const currentMarketCards = {};
const phases = {
  buyPowerPlant: true,
  buyResource: false,
  buildCities: false,
  bureaucracy: false
};

const makePhaseActive = function(currentPhase) {
  Object.keys(phases).forEach(phase => {
    phases[phase] = false;
  });
  phases[currentPhase] = true;
};

const isBuyPowerPlantPhase = () => phases.buyPowerPlant;
const isBuyResourcePhase = () => phases.buyResource;
const isBuildCitiesPhase = () => phases.buildCities;
const isBureaucracyPhase = () => phases.bureaucracy;

const selectedPowerPlants = [];

let hasBought = false;

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

const updatePriceDiv = function(price) {
  document.getElementById("current-bid-amount").innerText = price;
  document.getElementById("bid-amount").innerText = price;
};

const selectPowerPlant = function(element) {
  const powerPlantCost = element.id.split("_")[1];
  fetch("/powerPlant/select", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `powerPlantCost=${powerPlantCost}`
  });
  updatePriceDiv(powerPlantCost);
};

const handleMarketState = function(state, powerPlantDiv, powerPlantCost) {
  if (state == "currentMarket") {
    powerPlantDiv.onclick = selectPowerPlant.bind(null, powerPlantDiv);
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

const startBuyResourcePhase = function() {
  // document.getElementById("buy-resources-button").style.visibility = "visible";
  document.getElementById("power-plant-cards").style.display = "none";
  document.getElementById("market-div").style.width = "100%";
  const auction = document.querySelectorAll(".auction");
  // const powerPlants = document.querySelectorAll(".unselected-card");
  auction.forEach(element => {
    element.style.visibility = "hidden";
  });
  startBuyingResources();
  // powerPlants.forEach(powerPlant => (powerPlant.onclick = ""));
};

const designResourceMarket = function() {
  const resourceMarket = document.getElementById("resourceMarket");
  resourceMarket.className += " resource-market-phase";
  const resourceGrids = document.getElementsByClassName("resource-grid");
  Object.keys(resourceGrids).forEach(index => {
    resourceGrids[index].className += " new-resource-grid";
  });
};

const persistCardClass = function(powerPlants, currentMarketDiv) {
  const selectedPowerPlant = Object.keys(powerPlants).filter(
    powerPlantCost => powerPlants[powerPlantCost].isSelected
  );
  currentMarketDiv.childNodes.forEach(node => {
    if (node.id == `powerPlant_${selectedPowerPlant[0]}`) {
      node.className = "selected-card";
    }
  });
  fetch("/currentBid")
    .then(res => res.json())
    .then(auction => {
      const { currentBid, isAuctionOver, players } = auction;
      if (isAuctionOver) {
        makePhaseActive("buyResource");
        designResourceMarket();
        startBuyResourcePhase();
        return;
      }
      const cost = document.getElementById("bid-amount").innerText;
      fetch("/currentPlayer")
        .then(res => res.json())
        .then(player => {
          if (players.includes(+player.id)) {
            if (+currentBid >= +cost) return updatePriceDiv(currentBid);
            return updatePriceDiv(cost);
          }
          updateCurrentPlayer();
        });
    });
};

const displayPowerPlants = function(powerPlants) {
  if (isBuyPowerPlantPhase()) {
    const currentMarketDiv = generateMarket(powerPlants, 0, 4, "currentMarket");
    const futureMarketDiv = generateMarket(powerPlants, 4, 8, "futureMarket");
    const powerPlantDiv = generateDiv("power-plant-cards", "power-plant-cards");
    appendChildren(powerPlantDiv, [currentMarketDiv, futureMarketDiv]);
    persistCardClass(powerPlants, currentMarketDiv);
    const market = document.getElementById("market").children[0];
    market.replaceChild(powerPlantDiv, market.childNodes[0]);
  }
};

const fetchCurrentPowerPlants = function() {
  fetch("/currentPowerPlants")
    .then(res => res.json())
    .then(displayPowerPlants);
};

const generateBidDiv = function() {
  const biddingDiv = generateDiv("bidding-section", "bidding-section");
  biddingDiv.innerHTML = getBiddingSectionTemplate();
  document.getElementById("info").appendChild(biddingDiv);
};

const generatePowerPlantMarket = function(powerPlantCards) {
  const powerPlants = powerPlantCards;
  const powerPlantDiv = generateDiv("power-plant-cards", "power-plant-cards");
  const currentMarketDiv = generateMarket(powerPlants, 0, 4);
  const futureMarketDiv = generateMarket(powerPlants, 4, 8);
  appendChildren(powerPlantDiv, [currentMarketDiv, futureMarketDiv]);
  const resourceMarketDiv = generateResourceMarketDiv();
  generateBidDiv();
  const marketDiv = document.createElement("div");
  marketDiv.className = "market-div";
  marketDiv.id = "market-div";
  appendChildren(marketDiv, [powerPlantDiv, resourceMarketDiv]);
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
};

const addPowerPlantToPlayer = function(count, powerPlants, powerPlantCost) {
  const powerPlantDiv = document.getElementById(`powerplant-${count}`);
  powerPlantDiv.innerHTML = "";
  arrangeMarket(powerPlantDiv, powerPlantCost, powerPlants[powerPlantCost]);
};

const makeBid = function() {
  const bidAmount = document.getElementById("bid-amount").innerText;
  fetch("/auction/bid", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `bidAmount=${bidAmount}`
  });
  updateCurrentPlayer();
};

const pass = function() {
  fetch("/auction/bid", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `bidAmount=pass`
  }).then(res => updateCurrentPlayer());
};
