const currentMarketCards = {};

const boughtResources = {
  resourcesID: []
};

const selectedPowerPlants = [];

const increaseBid = function() {
  const currentBid = document.getElementById("bid-amount").innerText;
  document.getElementById("bid-amount").innerText = +currentBid + 1;
};

const resources = {
  Garbage: '<i class="fas fa-trash-alt"></i>',
  Coal: '<i class="fas fa-cubes"></i>',
  Oil: '<i class="fas fa-oil-can"></i>',
  Uranium: '<i class="fas fa-radiation-alt"></i>',
  Hybrid: '<i class="fas fa-hands-helping"></i>',
  Ecological: '<i class="fas fa-bolt"></i>'
};

const market_resources = {
  Garbage: "fas fa-trash-alt filled resource",
  Coal: "fas fa-cubes filled resource",
  Oil: "fas fa-oil-can filled resource middle-resource",
  Uranium: "fas fa-radiation-alt filled last-uranium"
};
const hideSoldResource = function(resource) {
  let newClass = removeFirstTwoClasses(resource.className);
  resource.className = newClass;
  resource.onclick = "";
  resource.style.border = "1px solid #759cae";
};

const displayResource = function(resources, resource, cost, id) {
  const index = `${resource}_${cost}_${id}`;
  const element = document.getElementById(index);

  if (resources[resource][cost][id]) {
    element.className = `${market_resources[resource]}`;
    return;
  }
  hideSoldResource(element);
};

const showResourceMarket = function() {
  fetch("/resources")
    .then(res => res.json())
    .then(resources => {
      Object.keys(resources).forEach(resource => {
        Object.keys(resources[resource]).forEach(cost => {
          Object.keys(resources[resource][cost]).forEach(id => {
            displayResource(resources, resource, cost, id);
          });
        });
      });
    });
};

const resetTurn = function() {
  updateCurrentPlayer();
  document.getElementById("selected-resource-amount").style.visibility =
    "hidden";
  document.getElementById("resource-amount").innerText = 0;
  boughtResources.resourcesID = [];
};
const showFailedPaymentMessage = function() {
  const messageContainer = document.getElementById("insufficient-money");
  messageContainer.style.display = "inline";
  setTimeout(() => {
    messageContainer.innerText = "";
  }, 3000);
  messageContainer.innerText = "insufficient money";
};

const resetSelection = function(resource) {
  document.getElementById(resource).style.border = "1px solid #759cae";
};

const showFailedPayment = function() {
  document.getElementById("resource-amount").innerText = 0;
  showFailedPaymentMessage();
  boughtResources.resourcesID.forEach(resetSelection);
  boughtResources.resourcesID = [];
};

const handleSellResources = function(player) {
  const resourceMarket = document.querySelectorAll(".filled");
  if (!player.isPaymentSuccess) return showFailedPayment();
  resetTurn();
  resourceMarket.forEach(resource => (resource.onclick = ""));
};

const getResourceDetails = function() {
  const resourceDetails = { Coal: [], Oil: [], Uranium: [], Garbage: [] };
  const ids = boughtResources.resourcesID;
  ids.forEach(id => {
    let details = id.split("_");
    resourceDetails[details[0]].push(details.slice(1).join("_"));
  });
  return resourceDetails;
};

const buyResources = function() {
  const { Coal, Oil, Uranium, Garbage } = getResourceDetails();
  const cost = +document.getElementById("resource-amount").innerText;

  fetch("/resources/buy", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `Coal=${Coal}&Oil=${Oil}&Uranium=${Uranium}&Garbage=${Garbage}&Cost=${cost}`
  })
    .then(res => res.json())
    .then(handleSellResources);
};

const displayMarket = function() {
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

const addFocus = function(element) {
  const price = element.id.split("_")[1];
  selectedPowerPlants.pop();
  selectedPowerPlants.push(element.id);
  currentMarketCards[price].isSelected = true;
  element.className = "selected-card";
  updatePriceDiv(price);
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
  persistCardClass(currentMarketDiv);
  const market = document.getElementById("market").children[0];
  market.replaceChild(currentMarketDiv, market.childNodes[0]);
  market.replaceChild(futureMarketDiv, market.childNodes[1]);
};

const fetchCurrentPowerPlants = function() {
  fetch("/currentPowerPlants")
    .then(res => res.json())
    .then(displayPowerPlants);
};

const addOnClick = resource => (resource.onclick = generateResourceValue);

const initializeResources = function(player) {
  const playerId = readCookie(document.cookie).playerId;
  const resourceMarket = document.querySelectorAll(".filled");
  if (player.id == playerId) resourceMarket.forEach(addOnClick);
};

const startBuyingResources = function() {
  const resourceCostDiv = document.getElementById("selected-resource-amount");
  resourceCostDiv.style.visibility = "visible";
  fetch("/currentPlayer")
    .then(res => res.json())
    .then(initializeResources);
};

const generateDiv = function(className, id) {
  const divElement = document.createElement("div");
  divElement.className = className;
  divElement.id = id;
  return divElement;
};

const generateResourceMarketDiv = function() {
  const resourceDiv = generateDiv("resource-market", "resourceMarket");
  resourceDiv.innerHTML = getResourceMarketTemplate();
  return resourceDiv;
};

const generateBidDiv = function() {
  const biddingDiv = generateDiv("bidding-section");
  biddingDiv.innerHTML = getBiddingSectionTemplate();
  return biddingDiv;
};

const generatePowerPlantMarket = function(powerPlantCards) {
  const powerPlants = powerPlantCards;
  const currentMarketDiv = generateMarket(powerPlants, 0, 4);
  const futureMarketDiv = generateMarket(powerPlants, 4, 8);
  const resourceMarketDiv = generateResourceMarketDiv();
  const biddingDiv = generateBidDiv();
  const marketDiv = document.createElement("div");
  marketDiv.className = "market-div";
  appendChildren(marketDiv, [
    currentMarketDiv,
    futureMarketDiv,
    biddingDiv,
    resourceMarketDiv
  ]);
  return marketDiv;
};

const generatePowerPlantPriceDiv = function(powerPlantCost) {
  const priceDiv = generateDiv("price-details");
  const price = generateDiv("price");
  price.innerHTML = powerPlantCost;
  priceDiv.appendChild(price);
  return priceDiv;
};

const appendChildren = function(parent, children) {
  parent.innerHTML = "";
  children.forEach(child => {
    parent.appendChild(child);
  });
};

const displayMap = function() {
  document.getElementById("building-phase").style.visibility = "visible";
  const map = document.getElementById("map");
  const market = document.getElementById("market");
  map.style.display = "inline";
  market.style.display = "none";
};

const splitByHyphen = function(text) {
  return text.split("_");
};

const convertToNumber = function(element) {
  return +element;
};

const selectResource = function(resourceDiv, amount, resourceDetails) {
  const clickBorder = "1px solid black";
  resourceDiv.style.border = clickBorder;
  const amountDiv = document.getElementById("resource-amount");
  amountDiv.innerText = amount + convertToNumber(resourceDetails[1]);
  boughtResources.resourcesID.push(resourceDiv.id);
};

const unselectResource = function(resourceDiv, amount, resourceDetails) {
  const unclickBorder = "1px solid #759cae";
  resourceDiv.style.border = unclickBorder;
  const amountDiv = document.getElementById("resource-amount");
  amountDiv.innerText = amount - convertToNumber(resourceDetails[1]);
  const resourceIndex = boughtResources.resourcesID.indexOf(resourceDiv.id);
  boughtResources.resourcesID.splice(resourceIndex, 1);
};

const generateResourceValue = function() {
  const resourceDiv = event.target;
  const clickBorder = "1px solid black";
  const resourceDetails = splitByHyphen(resourceDiv.id);
  const amountDiv = document.getElementById("resource-amount");
  const currentAmount = convertToNumber(amountDiv.innerText);
  if (resourceDiv.style.border != clickBorder) {
    return selectResource(resourceDiv, currentAmount, resourceDetails);
  }
  unselectResource(resourceDiv, currentAmount, resourceDetails);
};

const removeFirstTwoClasses = function(text) {
  const classes = text.split(" ");
  if (classes.length > 3)
    return text
      .split(" ")
      .slice(2)
      .join(" ");
  return text;
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

const updatePlayerStatsDiv = function({ name, resources, powerplants, money }) {
  let count = 1;
  document.getElementById("player-name").innerText = name;
  ["Coal", "Oil", "Garbage", "Uranium"].forEach(
    resource =>
      (document.getElementById(resource).innerText = resources[resource])
  );
  const powerplantsCost = Object.keys(powerplants).slice(0, 3);
  powerplantsCost.forEach(addPowerPlantToPlayer.bind(null,count,powerplants));
  document.getElementById("player-money").innerText = money;
};

const getPlayerStatsDiv = function() {
  fetch("/players/stats")
    .then(res => res.json())
    .then(playerStats => {
      updatePlayerStatsDiv(playerStats);
    });
};

const showActivityLogs = function(logs) {
  const activityDiv = document.getElementById("logs");
  activityDiv.innerText = "";
  logs.forEach(log => {
    activityDiv.innerText += log.log + "\n";
  });
};

const getActivityLogs = function() {
  fetch("/logs")
    .then(res => res.json())
    .then(res => showActivityLogs(res));
};
