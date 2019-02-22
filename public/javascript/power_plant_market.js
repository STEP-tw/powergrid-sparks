const currentMarketCards = {};

const boughtResources = {
  resourcesID: []
};

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

const showResourceMarket = function() {
  fetch("/getResources")
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

const displayResource = function(resources, resource, cost, id) {
  const index = `${resource}_${cost}_${id}`;
  const element = document.getElementById(index);

  if (resources[resource][cost][id]) {
    element.className = `${market_resources[resource]}`;
    return;
  }
  let newClass = removeFirstTwoClasses(element.className);
  element.className = newClass;
  element.onclick = "";
  element.style.border = "1px solid #759cae";
};

const resetTurn = function() {
  updateCurrentPlayer();
  document.getElementById("selected-resource-amount").style.visibility =
    "hidden";
  document.getElementById("resource-amount").innerText = 0;
  boughtResources.resourcesID = [];
};

const buyResources = function() {
  let resourceDetails = { Coal: [], Oil: [], Uranium: [], Garbage: [] };
  const ids = boughtResources.resourcesID;
  ids.forEach(id => {
    let details = id.split("_");
    resourceDetails[details[0]].push(details.slice(1).join("_"));
  });

  const costDiv = document.getElementById("resource-amount");
  const cost = +costDiv.innerText;

  const { Coal, Oil, Uranium, Garbage } = resourceDetails;
  fetch("/buyResources", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `Coal=${Coal}&Oil=${Oil}&Uranium=${Uranium}&Garbage=${Garbage}&cost=${cost}`
  });
  resetTurn();
};

const displayMarket = function() {
  fetch("/displayPowerPlantMarket")
    .then(res => res.json())
    .then(res => {
      displayPowerPlantMarket(res);
      getPlayerStatsDiv();
    });
};

const displayPowerPlantMarket = function(powerPlantCards) {
  const market = document.getElementById("market");
  market.appendChild(generatePowerPlantMarket(powerPlantCards));
  showResourceMarket();
};

const startBuyingResources = function() {
  document.getElementById("selected-resource-amount").style.visibility =
    "visible";
  const resourceMarket = document.getElementsByClassName("filled");
  for (let resourceNo = 0; resourceNo < resourceMarket.length; resourceNo++) {
    resourceMarket[resourceNo].onclick = generateResourceValue;
  }
};

const generatePowerPlantMarket = function(powerPlantCards) {
  const powerPlants = powerPlantCards;
  const currentMarketDiv = generateCurrentMarket(powerPlants);
  const futureMarketDiv = generateFutureMarket(powerPlants);
  const resourceMarketDiv = generateResourceMarketDiv();
  const biddingDiv = generateBidDiv();
  const marketDiv = document.createElement("div");
  appendChildren(marketDiv, [
    currentMarketDiv,
    futureMarketDiv,
    biddingDiv,
    resourceMarketDiv
  ]);
  return marketDiv;
};

const generateBidDiv = function() {
  const biddingDiv = generateDiv("bidding-section");
  biddingDiv.innerHTML = getBiddingSectionTemplate();
  return biddingDiv;
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
  powerPlantCardDiv.onclick = addFocus.bind(
    null,
    powerPlantCardDiv,
    powerPlant
  );
  const priceDiv = generatePriceDiv(powerPlant);
  const resourceDiv = generateResourceDiv(cardDetails);
  appendChildren(powerPlantCardDiv, [priceDiv, resourceDiv]);
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
  appendChildren(powerPlantCardDiv, [priceDiv, resourceDiv]);
  singleMarket.appendChild(powerPlantCardDiv);
};

const addFocus = function(element, powerPlant) {
  Object.keys(currentMarketCards).forEach(card => {
    currentMarketCards[card].isSelected = false;
    currentMarketCards[card].powerplant.className = "unselectedCard";
  });
  const id = element.id.slice(-1);
  currentMarketCards[id].isSelected = true;
  element.className = "selectedCard";
  document.getElementById("current-bid-amount").innerText = powerPlant;
  document.getElementById("bid-amount").innerText = powerPlant;
};

const generateResourceDiv = function(cardDetails) {
  const resourceDiv = document.createElement("div");
  resourceDiv.className = "card-details";
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

const appendChildren = function(parent, children) {
  parent.innerHTML = "";
  children.forEach(child => {
    parent.appendChild(child);
  });
};

const displayMap = function() {
  fetch("/getPlayers")
    .then(res => res.json())
    .then(players => players.forEach(player => updateMap(player)));
  const map = document.getElementById("map");
  const market = document.getElementById("market");
  map.style.display = "inline";
  market.style.display = "none";
};

const splitByHyphen = function(text) {
  return text.split("_");
};

const selectResource = function(resourceDiv, amount, resourceDetails) {
  const clickBorder = "1px solid black";
  resourceDiv.style.border = clickBorder;
  document.getElementById("resource-amount").innerText =
    amount + +resourceDetails[1];
  boughtResources[resourceDetails[0]] += 1;
  boughtResources.resourcesID.push(resourceDiv.id);
};

const unselectResource = function(resourceDiv, amount, resourceDetails) {
  const unclickBorder = "1px solid #759cae";
  resourceDiv.style.border = unclickBorder;
  document.getElementById("resource-amount").innerText =
    amount - resourceDetails[1];
  boughtResources[resourceDetails[0]] -= 1;
  const resourceIndex = boughtResources.resourcesID.indexOf(resourceDiv.id);
  boughtResources.resourcesID.splice(resourceIndex, 1);
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

const generateResourceValue = function(event) {
  const resourceDiv = event.target;
  const clickBorder = "1px solid black";
  const resourceDetails = splitByHyphen(resourceDiv.id);
  const currentAmount = +document.getElementById("resource-amount").innerText;
  if (resourceDiv.id && resourceDiv.style.border != clickBorder) {
    return selectResource(resourceDiv, currentAmount, resourceDetails);
  }
  unselectResource(resourceDiv, currentAmount, resourceDetails);
};

const buyPowerplant = function() {
  const price = document.getElementById("current-bid-amount").innerText;
  fetch("/buyPowerplant", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `price=${price}`
  });
  fetch("/getCurrentPowerPlantMarket", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `price=${price}`
  })
    .then(res => res.json())
    .then(res => {
      displayPowerPlantMarket(res);
    });
  updateCurrentPlayer();
};

const getPlayerStatsDiv = function() {
  fetch('/getPlayerStats')
    .then(res => res.json())
    .then(res => {
      updatePlayerStatsDiv(res);
    });
};

const updatePlayerStatsDiv = function({ name, resources, powerplants, money }) {
  let count = 1;
  document.getElementById('player-name').innerText = name;
  ['Coal', 'Oil', 'Garbage', 'Uranium'].forEach(
    resource => (document.getElementById(resource).innerText = resources[resource])
  );
  const powerplantsCost = Object.keys(powerplants);
  powerplantsCost.forEach(powerplant => {
    const powerPlantDiv = document.getElementById(`powerplant-${count++}`);
    arrangeFutureMarket(powerPlantDiv, powerplant, powerplants[powerplant]);
  });
  document.getElementById('player-money').innerText = money;
};
