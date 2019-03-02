const polling = function() {
  setInterval(() => {
    getCurrentPlayer();
    getPlayersDetails();
    showResourceMarket();
    fetchCurrentPowerPlants();
    getPlayerStatsDiv();
    refreshMap();
    getActivityLogs();
  }, 800);
};
