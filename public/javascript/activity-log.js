const displayActivityLogs = function() {
  document.getElementById("activity-log-overlay").style.display = "flex";
  document.getElementById("activity-log").style.display = "flex";
};

const closeActivityLog = function() {
  document.getElementById("activity-log-overlay").style.display = "none";
  document.getElementById("activity-log").style.display = "none";
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
