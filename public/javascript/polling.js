const polling = function() {
  setInterval(() => {
    getCurrentPlayer();
    getPlayersDetails();
    showResourceMarket();
    fetchCurrentPowerPlants();
    getPlayerStatsDiv();
    refreshMap();
    getActivityLogs();
    getCurrentPhase();
  }, 1100);
};
