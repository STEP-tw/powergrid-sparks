const splitByHyphen = function(text) {
  return text.split("_");
};

const convertToNumber = function(element) {
  return +element;
};

const removeFirstTwoClasses = function(text) {
  const classes = text.split(" ");
  if (classes.length > 3)
    return text
      .split(" ")
      .slice(2)
      .join(" ");
  return text;
};

const displayMap = function() {
  document.getElementById("back-button").style.display = "flex";
  document.getElementById("display-map").style.display = "none";
  const map = document.getElementById("map");
  const market = document.getElementById("market");
  document.getElementById(
    "bidding-section"
  ).innerHTML = getBuildCitiesTemplate();
  map.style.display = "inherit";
  market.style.display = "none";
};

const appendChildren = function(parent, children) {
  parent.innerHTML = "";
  children.forEach(child => {
    parent.appendChild(child);
  });
};

const generateDiv = function(className, id) {
  const divElement = document.createElement("div");
  divElement.className = className;
  divElement.id = id;
  return divElement;
};
