const currentMarketCards = {};

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
  const currentBid = getInnerText("bid-amount");
  setInnerText("bid-amount", +currentBid + 1);
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
  setInnerText("bid-amount", price);
};

const selectPowerPlant = function(element) {
  const powerPlantCost = element.id.split("_")[1];
  fetch("/powerPlant/select", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `powerPlantCost=${powerPlantCost}`
  });
  selectedPowerPlants.pop();
  selectedPowerPlants.push(element.id);
  resetBidAmount();
  updatePriceDiv(powerPlantCost);
};

const handleMarketState = function(state, powerPlantDiv, powerPlantCost) {
  if (state == "currentMarket") {
    powerPlantDiv.onclick = selectPowerPlant.bind(null, powerPlantDiv);
    powerPlantDiv.style.cursor = "pointer";
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

const persistCardClass = function(powerPlants, currentMarketDiv) {
  const selectedPowerPlant = Object.keys(powerPlants).filter(
    powerPlantCost => powerPlants[powerPlantCost].isSelected
  );
  currentMarketDiv.childNodes.forEach(node => {
    if (node.id == `powerPlant_${selectedPowerPlant[0]}`) {
      node.className = "selected-card";
      document.getElementById("make-bid").onclick = makeBid;
      document.getElementById("make-bid").className = "bid-option-enabled";
    }
  });
  fetch("/currentBid")
    .then(res => res.json())
    .then(auction => {
      const {
        currentBid,
        players,
        phase,
        isBidOver,
        isAuctionStarted,
        hasMoreThenThreePowerplants,
        powerplants,
        currentPlayerId
      } = auction;
      if (hasMoreThenThreePowerplants && readCookie(document.cookie).playerId == currentPlayerId) {
        displayDiscardingPowerplantOption(powerplants);
        return;
      }

      if (phase == "buyResources") {
        designResourceMarket();
        startBuyResourcePhase();
        return;
      }
      const powerPlantCards = document.getElementById("currentMarket")
        .childNodes;
      if (!isBidOver && isAuctionStarted) {
        powerPlantCards.forEach(
          powerplantCard => (powerplantCard.onclick = null)
        );
      } else {
        powerPlantCards.forEach(
          powerPlantCard =>
            (powerPlantCard.onclick = selectPowerPlant.bind(
              null,
              powerPlantCard
            ))
        );
      }
      const cost = document.getElementById("bid-amount").innerText;
      fetch("/currentPlayer")
        .then(res => res.json())
        .then(player => {
          if (players.includes(+player.id)) {
            if (+currentBid >= +cost) return updatePriceDiv(currentBid);
            return;
          }
          document.getElementById("bid-amount").innerText = 0;
          updateCurrentPlayer();
        });
    });
};

const displayPowerPlants = function({ powerPlants, phase }) {
  powerPlants = JSON.parse(powerPlants);
  if (phase == "buyPowerPlant") {
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
  const logsDiv = generateDiv("one-line-log", "one-line-log");
  document.getElementById("info").appendChild(logsDiv);
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

const resetBidAmount = function() {
  document.getElementById("bid-amount").innerText = 0;
};

const addPowerPlantToPlayer = function(count, powerPlants, powerPlantCost) {
  const powerPlantDiv = document.getElementById(`powerplant-${count}`);
  powerPlantDiv.innerHTML = "";
  arrangeMarket(powerPlantDiv, powerPlantCost, powerPlants[powerPlantCost]);
};

const makeBid = function() {
  const bidAmount = getInnerText("bid-amount");
  const selectedPowerPlant = selectedPowerPlants[0];
  document.getElementsByClassName;
  fetch("/auction/bid", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `bidAmount=${bidAmount}&selectedPowerPlant=${selectedPowerPlant}`
  }).then(res => updateCurrentPlayer());
};

const pass = function() {
  fetch("/auction/bid", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `bidAmount=pass&selectedPowerPlant=`
  }).then(res => updateCurrentPlayer());
};

const displayLog = function(logs) {
  const log = document.getElementById("one-line-log");
  const latestActivityHeadDiv = generateDiv(
    "latest-activity-header",
    "latest-activity-header"
  );
  latestActivityHeadDiv.innerHTML = "Latest Activity";
  const latestActivityDiv = generateDiv("", "");
  latestActivityDiv.innerText = logs[0].log;
  log.innerText = "";
  log.appendChild(latestActivityHeadDiv);
  log.appendChild(latestActivityDiv);
};

const displayDiscardingPowerplantOption = function(powerplants) {
  document.getElementById("discarding-powerplant-popup").style.visibility =
    "visible";
  document.getElementById(
    "discarding-powerplant-popup"
  ).innerText = JSON.stringify(powerplants);

  const allPowerplants = generateMarket(powerplants, 0, 3, "map123");
  const bureaucracyDiv = document.getElementById("discarding-powerplant-popup");
  const heading = generateDiv("bureaucracy-heading", "");
  const discardingButton = document.createElement("button");
  discardingButton.className = "bid-option-enabled";
  discardingButton.style.width = "25%";
  discardingButton.innerText = "Discard";
  discardingButton.onclick = discardPowerplant;
  heading.innerText = "Select Powerplant to discard";
  bureaucracyDiv.innerHTML = "";
  const msgDiv = generateDiv("bureaucracy-err-msg", "err-msg");
  appendChildren(bureaucracyDiv, [heading, allPowerplants, msgDiv,discardingButton]);
  const market = bureaucracyDiv.childNodes;
  const playersPowerplant = market[1].childNodes;
  playersPowerplant.forEach(powerplant => {
    powerplant.onclick = selectDiv.bind(null, powerplant);
  });
};

const discardPowerplant = function(){
  fetch("/discardPowerplant", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `powerplant=${selectedPowerPlant[0]}`
  }).then(res=>{
    selectedPowerPlant.pop();
    document.getElementById("discarding-powerplant-popup").style.visibility =
      "hidden";
  })
}
