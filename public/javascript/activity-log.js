const setDiplay = function(id,style){
  document.getElementById(id).style.display = style
}

const displayActivityLogs = function() {
  setDiplay("activity-log-overlay","flex");
  setDiplay("activity-log","flex");
};

const closeActivityLog = function() {
  setDiplay("activity-log-overlay","none");  
  setDiplay("activity-log","none");  
};

const showActivityLogs = function(logs) {
  const activityDiv = document.getElementById("logs");
  activityDiv.innerText = "";
  logs.forEach(log => {
    activityDiv.innerText += log.log + "\n";
  });
};

const getActivityLogs = function() {
  fetch("/logs")
    .then(res => res.json())
    .then(res => showActivityLogs(res));
};
