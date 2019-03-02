class Phase {
  constructor() {
    this.buyPowerPlant = true;
    this.buyResources = false;
    this.buildCities = false;
    this.bureaucracy = false;
  }

  changePhaseTo(currentPhase) {
    Object.keys(this).forEach(phase => {
      this[phase] = false;
    });
    this[currentPhase] = true;
  }

  currentPhase() {
    const activePhase = Object.keys(this).filter(phase => this[phase]);
    return activePhase[0];
  }
}

module.exports = Phase;
