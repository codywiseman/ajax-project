var $teamSelect = document.querySelector('#team-select');

var teamsXhr = new XMLHttpRequest();
teamsXhr.open('GET', 'https://statsapi.web.nhl.com/api/v1/teams');
teamsXhr.responseType = 'json';
teamsXhr.addEventListener('load', function() {
  console.log(teamsXhr.status);
  console.log(teamsXhr.response.teams);
  var teamsList = teamsXhr.response.teams;
  for (var i = 0; i < teamsList.length; i++) {
    var team = teamsList[i];
    var teamOption = document.createElement('option');
    teamOption.value = teamsList[i].teamName;
    teamOption.textContent = teamsList[i].name;
    $teamSelect.appendChild(teamOption);
  }
})
teamsXhr.send();
