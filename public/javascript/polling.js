const polling = function() {
  setInterval(()=>{
    getCurrentPlayer()
    getPowerplantDetails();
    showResourceMarket();
    getCurrentPowerPlants();
    getPlayerStatsDiv();
    refreshMap();
    getActivityLogs();
  }, 500);
};