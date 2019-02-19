const resourceIcons = {
  garbage: '<i class="fas fa-trash-alt"></i>',
  coal: '<i class="fas fa-cubes"></i>',
  oil: '<i class="fas fa-oil-can"></i>',
  uranium: '<i class="fas fa-radiation-alt"></i>',
  hybrid: '<i class="fas fa-hands-helping"></i>',
  arrow:'<i class="fas fa-arrow-right" ></i >',
  city:'<i class="fas fa-house-damage"></i>'
};

const generatePowerplantHTML = function(powerplants){
  const powerplantValues = Object.keys(powerplants);
  let html = '';
  powerplantValues.forEach(powerplantValue => {
    html += `<div class='player-power-plant'>
      <div>${powerplantValue}</div>
      <div> ${resourceIcons[powerplants[powerplantValue].resource.type]}    ${powerplants[powerplantValue].resource.quantity}</div>
      <div>  ${resourceIcons.city}  ${powerplants[powerplantValue].city} </div>
      </div>`
  })
  return html;
}

const generateResourcesHTML = function(playerResources){
  const resources = Object.keys(playerResources);
  let html = '';
  resources.forEach(resource => {
    html += `<div class="player-resource">
      ${resourceIcons[resource]}:${playerResources[resource]}
    </div>`
  });
  return html;
}

const showPlayerAssets = function(players){
  const users = JSON.parse(players);
  users.forEach(player => {
    const powerplantHTML = generatePowerplantHTML(player.powerplants);
    const resourceHTML = generateResourcesHTML(player.resources);
    document.getElementById(`${player.name}_${player.color}`).children[1].innerHTML=powerplantHTML;
    document.getElementById(`${player.name}_${player.color}`).children[2].innerHTML=resourceHTML;
  })
}