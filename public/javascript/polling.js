const currentPhase = { phase: "buyPowerPlant" };
let gameEtag = 01;

const polling = function() {
  setInterval(() => {
    highlightPhase(currentPhase.phase);
    fetch("/getGameDetails", { headers: { "If-None-Match": gameEtag } })
      .then(res => {
        gameEtag = res.headers.get("ETag");
        if (res.status == 200) return res.json();
        return new Promise().reject();
      })
      .then(gameDetails => {
        const {
          player,
          players,
          resources,
          phase,
          playerStats,
          logs,
          winner
        } = gameDetails;
        handleTurn(player);
        showPlayerDetails(gameDetails.players);
        Object.keys(resources).forEach(resource => {
          Object.keys(resources[resource]).forEach(cost => {
            Object.keys(resources[resource][cost]).forEach(id => {
              displayResource(resources, resource, cost, id);
            });
          });
        });
        if (phase == "buyResources" && currentPhase.phase != "buyResources") {
          designResourceMarket();
          startBuyResourcePhase();
          currentPhase.phase = "buyResources";
        }
        if (phase == "buildCities") {
          players.forEach(player => updateMap(player));
          if (currentPhase.phase != "buildCities") {
            document.getElementById("map").innerHTML = getMapTemplate();
            displayMap();
            refreshMap();
            currentPhase.phase = "buildCities";
          }
        }
        if (phase == "bureaucracy" && currentPhase.phase != "bureaucracy") {
          getLightedCities();
          selectPowerplant();
          currentPhase.phase = "bureaucracy";
        }
        if (phase == "buyPowerPlant") {
          displayPowerPlants(gameDetails);
          if (currentPhase.phase != "buyPowerPlant") {
            displayMarket();
            currentPhase.phase = "buyPowerPlant";
          }
        }

        if (phase == "endGame") {
          currentPhase.phase = "endGame";
          displayWinningMessage(winner + " has won the game !");
        }

        updatePlayerStatsDiv(playerStats);
        displayLog(logs);
      })
      .catch();
  }, 500);
};
