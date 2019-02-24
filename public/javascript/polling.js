const polling = function() {
  setInterval(()=>{
    getCurrentPlayer()
    getPlayersDetails();
    showResourceMarket();
    getCurrentPowerPlants();
    getPlayerStatsDiv();
    refreshMap();
    getActivityLogs();
  }, 500);
};