let selectedCities = [];

const updateCost = function(){
  const houseId = event.target.id.split('_');
  selectedCities.push(event.target);
  if(event.target.className.baseVal == "highlighted"){
    event.target.className.baseVal = undefined;
    const cityCost =  +houseId[houseId.length-1];
    const currentCost = +document.getElementById('building-cost').innerText.split(' ')[2];
    document.getElementById('building-cost').innerText = `Building Cost: ${currentCost - cityCost}`
    return;
  }
  event.target.className.baseVal = 'highlighted';
  const cityCost =  +houseId[houseId.length-1];
  const currentCost = +document.getElementById('building-cost').innerText.split(' ')[2];
  document.getElementById('building-cost').innerText = `Building Cost: ${cityCost + currentCost}`
}

const reset = function(){
  selectedCities.forEach(city => {
    city.className.baseVal = undefined;
  });
  document.getElementById('building-cost').innerText = 'Building Cost: 0';
  selectedCities = [];
}