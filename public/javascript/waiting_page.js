const createHTML = function(elements) {
  let div = "";
  elements.forEach(element => {
    div += element.name + "  has joined game\n";
  });
  return div;
};

const updateJoinedPlayers = function(response, interval) {
  if (response.gameState) {
    clearInterval(interval);
    window.location.href = `/gameplay`;
  }
  document.getElementById("players").innerText = createHTML(response.users);
};

window.onload = function() {
  const gameId = document.getElementById('gameId').value;
  const interval = setInterval(() => {
    fetch(`/createGame?gameId=${gameId}`)
      .then(res => res.json())
      .then(response => updateJoinedPlayers(response, interval));
  }, 2000);
};