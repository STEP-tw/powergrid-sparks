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