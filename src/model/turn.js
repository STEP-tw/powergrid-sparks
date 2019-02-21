class Turn{
  constructor(players,index = 0){
    this.players = players;
    this.currentPlayerIndex = index;
  }

  getCurrentPlayer(){
    return this.players[this.currentPlayerIndex%this.players.length];
  }
  
  updateCurrentPlayer(){
    this.currentPlayerIndex++;
  }
}

module.exports = Turn;