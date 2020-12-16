var $teamSelect = document.querySelector('#team-select');
var $viewClasses = document.querySelectorAll('.view');
var $teamForm = document.querySelector('.team-form')
var $teamPageDiv = document.querySelector('div[data-view="team-page');



/*      Teams Request     */

var teamsList;

var teamsXhr = new XMLHttpRequest();
teamsXhr.open('GET', 'https://statsapi.web.nhl.com/api/v1/teams');
teamsXhr.responseType = 'json';
teamsXhr.addEventListener('load', function() {
  console.log(teamsXhr.response.teams)
  teamsList = teamsXhr.response.teams;
  for (var i = 0; i < teamsList.length; i++) {
    var team = teamsList[i];
    var teamOption = document.createElement('option');
    teamOption.value = teamsList[i].teamName;
    teamOption.textContent = teamsList[i].name;
    $teamSelect.appendChild(teamOption);
  }
})
teamsXhr.send();




/*      Submit Listeners      */




/*     Render Team Page     */

function renderTeamPage(team) {
  for (var i = 0; i < teamsList.length; i++) {
    if (teamsList[i].name === team) {
      var divOne = document.createElement('div');
      divOne.setAttribute('class', 'row team-row-1');

      var teamLogo = document.createElement('img');
      teamLogo.setAttribute('src', '')
      teamLogo.setAttribute('class', 'logo')

      var divTwo = document.createElement('div');
      divTwo.setAttribute('class', 'team-info');

      var pOne = document.createElement('p')
      var spanOne = document.createElement('span')
      pOne.textContent = teamsList[i].name;
      spanOne.setAttribute('class', 'bold');
      spanOne.textContent = 'Team Name: ';
      pOne.prepend(spanOne);

      var pTwo = document.createElement('p')
      var spanTwo = document.createElement('span')
      pTwo.textContent = teamsList[i].abbreviation;
      spanTwo.setAttribute('class', 'bold');
      spanTwo.textContent = 'Abbreviation: ';
      pTwo.prepend(spanTwo);

      var pThree = document.createElement('p')
      var spanThree = document.createElement('span')
      pThree.textContent = teamsList[i].firstYearOfPlay;
      spanThree.setAttribute('class', 'bold');
      spanThree.textContent = 'Inaugural Season: ';
      pThree.prepend(spanThree);

      var pFour = document.createElement('p')
      var spanFour = document.createElement('span')
      pFour.textContent = teamsList[i].conference.name;
      spanFour.setAttribute('class', 'bold');
      spanFour.textContent = 'Conference: ';
      pFour.prepend(spanFour);

      var pFive = document.createElement('p')
      var spanFive = document.createElement('span')
      pFive.textContent = teamsList[i].division.name;
      spanFive.setAttribute('class', 'bold');
      spanFive.textContent = 'Division: ';
      pFive.prepend(spanFive);

      $teamPageDiv.appendChild(divOne);
      divOne.appendChild(teamLogo);
      divOne.appendChild(divTwo);
      divTwo.appendChild(pOne);
      divTwo.appendChild(pTwo);
      divTwo.appendChild(pThree);
      divTwo.appendChild(pFour);
      divTwo.appendChild(pFive);
    }
  }
}





 /*    View Swapping      */

function dataview(viewName) {
  for(var i = 0; i < $viewClasses.length; i++) {
    if ($viewClasses[i].getAttribute('data-view') === viewName) {
      $viewClasses[i].className = 'view';
      data.view = viewName;
    } else {
      $viewClasses[i].className = 'view hidden';
    }
  }
}
