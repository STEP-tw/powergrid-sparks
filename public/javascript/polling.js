const currentPhase = { phase: "buyPowerPlant" };

const polling = function() {
  setInterval(() => {
    highlightPhase(currentPhase.phase);
    fetch("/getGameDetails")
      .then(res => res.json())
      .then(gameDetails => {
        const {
          player,
          players,
          resources,
          phase,
          playerStats,
          logs
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
        displayPowerPlants(gameDetails);
        updatePlayerStatsDiv(playerStats);
        players.forEach(player => updateMap(player));
        showActivityLogs(logs);
        if (phase == "buyResources" && currentPhase.phase != "buyResources") {
          designResourceMarket();
          startBuyResourcePhase();
          currentPhase.phase = "buyResources";
        }
        if (phase == "buildCities" && currentPhase.phase != "buildCities") {
          displayMap();
          refreshMap();
          currentPhase.phase = "buildCities";
        }
        if (phase == "bureaucracy" && currentPhase.phase != "bureaucracy") {
          getLightedCities();
          selectPowerplant();
          currentPhase.phase = "bureaucracy";
        }
        if (phase == "buyPowerPlant" && currentPhase.phase != "buyPowerPlant") {
          displayMarket();
          currentPhase.phase = "buyPowerPlant";
        }
      });
  }, 500);
};
