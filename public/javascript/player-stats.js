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