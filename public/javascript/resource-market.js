const boughtResources = {
  resourcesID: []
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
  resource.style.border = "1px solid #a3a17f";
};

const displayResource = function(resources, resource, cost, id) {
  const index = `${resource}_${cost}_${id}`;
  const element = document.getElementById(index);
  addOnClick(element);

  if (resources[resource][cost][id]) {
    if (resource == "Uranium" && cost < 10) {
      element.className =
        "fas fa-radiation-alt filled resource middle-resource";
      return;
    }
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
  document.getElementById(resource).style.border = "1px solid #a3a17f ";
};

const showFailedPayment = function() {
  document.getElementById("resource-amount").innerText = 0;
  showFailedPaymentMessage();
  boughtResources.resourcesID.forEach(resetSelection);
  boughtResources.resourcesID = [];
};

const handleSellResources = function(player) {
  // const resourceMarket = document.querySelectorAll(".filled");
  if (!player.isPaymentSuccess) return showFailedPayment();
  resetTurn();
  resourceMarket.forEach(resource => (resource.onclick = ""));
  if (player.isLastPlayer) {
    displayMap();
  }
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

const addOnClick = resource => (resource.onclick = generateResourceValue);

const initializeResources = function(player) {
  const playerId = readCookie(document.cookie).playerId;
  const resourceMarket = document.querySelectorAll(".filled");
  if (player.id == playerId) resourceMarket.forEach(addOnClick);
};

const startBuyingResources = function() {
  const resourceDiv = getBuyResourceTemplate();
  document.getElementById("bidding-section").innerHTML = resourceDiv;
  fetch("/currentPlayer")
    .then(res => res.json())
    .then(initializeResources);
};

const generateResourceMarketDiv = function() {
  const resourceDiv = generateDiv("resource-market", "resourceMarket");
  resourceDiv.innerHTML = getResourceMarketTemplate();
  return resourceDiv;
};

const selectResource = function(resourceDiv, amount, resourceDetails) {
  const clickBorder = "2px solid black";
  resourceDiv.style.border = clickBorder;
  const amountDiv = document.getElementById("resource-amount");
  amountDiv.innerText = amount + convertToNumber(resourceDetails[1]);
  boughtResources.resourcesID.push(resourceDiv.id);
};

const unselectResource = function(resourceDiv, amount, resourceDetails) {
  const unclickBorder = "1px solid #a3a17f ";
  resourceDiv.style.border = unclickBorder;
  const amountDiv = document.getElementById("resource-amount");
  amountDiv.innerText = amount - convertToNumber(resourceDetails[1]);
  const resourceIndex = boughtResources.resourcesID.indexOf(resourceDiv.id);
  boughtResources.resourcesID.splice(resourceIndex, 1);
};

const generateResourceValue = function() {
  const resourceDiv = event.target;
  if (resourceDiv.id) {
    const clickBorder = "1px solid black";
    const resourceDetails = splitByHyphen(resourceDiv.id);
    const amountDiv = document.getElementById("resource-amount");
    const currentAmount = convertToNumber(amountDiv.innerText);
    if (resourceDiv.style.border != clickBorder) {
      return selectResource(resourceDiv, currentAmount, resourceDetails);
    }
    unselectResource(resourceDiv, currentAmount, resourceDetails);
  }
};

const getCurrentPhase = function() {
  fetch("/currentPhase")
    .then(res => res.text())
    .then(phase => {
      if (phase == "buyResources") startBuyResourcePhase();
      if (phase == "buildCities") displayMap();
    });
};
