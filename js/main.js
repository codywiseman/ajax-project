var $teamSelect = document.querySelector('#team-select');
var $viewClasses = document.querySelectorAll('.view');
var $teamForm = document.querySelector('.team-form')
var $teamPageDiv = document.querySelector('div[data-view="team-page');
var $teamSelectOptions = document.getElementsByClassName('team');
var $homeLogo = document.querySelector('.logo');


/*      Teams Request     */

var teamsList;

var teamsXhr = new XMLHttpRequest();
teamsXhr.open('GET', 'https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster');
teamsXhr.responseType = 'json';
teamsXhr.addEventListener('load', function() {
  teamsList = teamsXhr.response.teams;
  for (var i = 0; i < teamsList.length; i++) {
    var team = teamsList[i];
    var teamOption = document.createElement('option');
    teamOption.value = teamsList[i].teamName;
    teamOption.className = 'team';
    teamOption.textContent = teamsList[i].name;
    $teamSelect.appendChild(teamOption);
  }
})
teamsXhr.send();


/*      Go to Home Page     */

$homeLogo.addEventListener('click', function(){
  dataview('home-page');
})

/*      Submit Listeners      */

$teamForm.addEventListener('submit', function(e){
  e.preventDefault();
  if ($teamSelect.selectedIndex !== 0) {
    $teamPageDiv.innerHTML ='';
    renderTeamPage($teamSelectOptions[($teamSelect.selectedIndex - 1)].textContent);
    renderRoster($teamSelectOptions[($teamSelect.selectedIndex - 1)].textContent);
    dataview('team-page');
    $teamForm.reset();
  }
})

/*     Render Team Page     */

var teamLogoImages = {
  'New Jersey Devils': 'images/devils.png',
  'New York Islanders': 'images/islanders.png',
  'New York Rangers': 'images/rangers.png',
  'Philadelphia Flyers': 'images/flyers.png',
  'Pittsburgh Penguins': 'images/penguins.png',
  'Boston Bruins': 'images/bostonbruins.png',
  'Buffalo Sabres': 'images/sabres.png',
  'Montréal Canadiens': 'images/canadiens.png',
  'Ottawa Senators': 'images/senators.png',
  'Toronto Maple Leafs': 'images/mapleleafs.png',
  'Carolina Hurricanes':'images/canes.png',
  'Florida Panthers': 'images/panthers.png',
  'Tampa Bay Lightning': 'images/lightning.png',
  'Washington Capitals': 'images/capitals.png',
  'Chicago Blackhawks': 'images/blackhawks.png',
  'Detroit Red Wings': 'images/redwings.png',
  'Nashville Predators': 'images/predators.png',
  'St. Louis Blues': 'images/blues.png',
  'Calgary Flames': 'images/flames.png',
  'Colorado Avalanche': 'images/avalanche.png',
  'Edmonton Oilers': 'images/oilers.png',
  'Vancouver Canucks': 'images/canucks.png',
  'Anaheim Ducks': 'images/ducks.png',
  'Dallas Stars': 'images/stars.png',
  'Los Angeles Kings': 'images/kings.png',
  'San Jose Sharks': 'images/sharks.png',
  'Columbus Blue Jackets': 'images/jackets.png',
  'Minnesota Wild': 'images/wilds.png',
  'Winnipeg Jets': 'images/jets.png',
  'Arizona Coyotes': 'images/coyotes.png',
  'Vegas Golden Knights': 'images/knights.png'
}

function renderTeamPage(team) {
  for (var i = 0; i < teamsList.length; i++) {
    if (teamsList[i].name === team) {
      var divOne = document.createElement('div');
      divOne.setAttribute('class', 'row team-row-1');

      var teamLogo = document.createElement('img');
      teamLogo.setAttribute('src', teamLogoImages[team])
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

function renderRoster(team) {
  for(var i = 0; i < teamsList.length; i++) {
    if(teamsList[i].name === team) {
      var teamRoster = [];
      for (var x = 0; x < teamsList[i].roster.roster.length; x++) {
        teamRoster.push(teamsList[i].roster.roster[x])
      }
      var tableLabel = document.createElement('h3');
      tableLabel.textContent = 'Roster'

      var table = document.createElement('table')
      table.setAttribute('class', 'roster-table');

      var tableHead = document.createElement('thead');

      var headRow = document.createElement('tr');

      var tHeadOne = document.createElement('th');
      tHeadOne.setAttribute('class', 'col-one');
      tHeadOne.textContent = 'No.'

      var tHeadTwo = document.createElement('th');
      tHeadTwo.textContent = 'Player'

      var tHeadThree = document.createElement('th');
      tHeadThree.textContent = 'Position'

      var tableBody = document.createElement('tbody');

      headRow.appendChild(tHeadOne);
      headRow.appendChild(tHeadTwo);
      headRow.appendChild(tHeadThree);
      tableHead.appendChild(headRow);
      table.appendChild(tableHead);
      $teamPageDiv.appendChild(tableLabel);

      for(var rosterSpot = 0; rosterSpot < teamRoster.length; rosterSpot++) {
        var tableRow = document.createElement('tr')

        var tDataOne = document.createElement('td');
        tDataOne.textContent = teamRoster[rosterSpot].jerseyNumber;

        var tDataTwo = document.createElement('td');
        tDataTwo.textContent = teamRoster[rosterSpot].person.fullName;

        var tDataThree = document.createElement('td');
        tDataThree.textContent = teamRoster[rosterSpot].position.name;

        tableRow.appendChild(tDataOne);
        tableRow.appendChild(tDataTwo);
        tableRow.appendChild(tDataThree);
        tableBody.appendChild(tableRow);
        table.appendChild(tableBody);
        $teamPageDiv.appendChild(table);
      }
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
