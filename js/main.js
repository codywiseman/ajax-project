var $teamSelect = document.querySelector('#team-select');
var $viewClasses = document.querySelectorAll('.view');
var $teamForm = document.querySelector('.team-form')
var $teamPageDiv = document.querySelector('div[data-view="team-page');
var $teamSelectOptions = document.getElementsByClassName('team');
var $homeLogo = document.querySelector('.logo');
var $playerPageDiv = document.querySelector('div[data-view="player-page');
var $playerForm = document.querySelector('.player-form');
var $playerSearch = document.querySelector('.player-search');
var $suggestion = document.querySelector('.suggestions');


/*      Teams Request     */

var teamsList;

var playerIds = [];

var playerNames = []

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
  for (var z = 0; z < teamsList.length; z++) {
    for (var x = 0; x < teamsList[z].roster.roster.length; x++) {
      var obj = {};
      var playerObj = {};
      obj[(teamsList[z].roster.roster[x].person.fullName).toLowerCase()] = teamsList[z].roster.roster[x].person.id;
      playerIds.push(obj);
      playerObj['name'] = (teamsList[z].roster.roster[x].person.fullName);
      playerNames.push(playerObj);
    }
  }
})
teamsXhr.send();

/*      Go to Home Page     */

$homeLogo.addEventListener('click', function(){
  dataview('home-page');
})

/*      Submit Listener for Team page      */

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

/*      Submit Listener for Player page      */

$playerForm.addEventListener('submit', function(e){
  e.preventDefault();
  var playerXhr = new XMLHttpRequest();
  var id = $playerSearch.value.toLowerCase();
  for(var i = 0; i < playerIds.length; i++) {
    if(playerIds[i].hasOwnProperty(id)) {
      playerXhr.open('GET', 'https://statsapi.web.nhl.com/api/v1/people/' + (playerIds[i][id]).toString());
      playerXhr.responseType = 'json';
      playerXhr.addEventListener('load', function (){
        var player = playerXhr.response.people[0];
        console.log(player)
        $playerPageDiv.innerHTML = '';
        renderPlayerPage(player);
        dataview('player-page');
        $playerForm.reset(player);
      })
    }
  }
  playerXhr.send();
})

$playerSearch.addEventListener('keyup', function(){
  var input = $playerSearch.value;
  $suggestion.innerHTML = '';
  var suggestions = playerNames.filter(function(player) {
    return player.name.toLowerCase().startsWith(input);
  })
  var condensedSuggestions = [];
  for (var i = 0; i < 6; i++){
    if(suggestions[i] !== undefined) {
      condensedSuggestions.push(suggestions[i]);
    }
  }
  condensedSuggestions.forEach(function(suggested) {
    var div = document.createElement('div');
    div.innerHTML = suggested.name;
    $suggestion.appendChild(div);
  })
  if (input === '') {
    $suggestion.innerHTML = ''
  }
})

$suggestion.addEventListener('click', function(e) {
  $playerSearch.value = e.target.innerHTML;
  $suggestion.innerHTML = '';
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

/*     Render Player Page     */

function renderPlayerPage(person) {
  var nameHeading = document.createElement('h2');
  nameHeading.setAttribute('class', 'player-name');
  nameHeading.textContent = person.fullName;

  var infoHeading = document.createElement('h4');
  infoHeading.setAttribute('class', 'player-info');
  infoHeading.textContent = person.primaryPosition.code + ' | ' + person.height + ' | ' +
  person.weight + 'lb' + ' | ' + 'Age ' + person.currentAge + ' | ' + person.currentTeam.name;

  var pOne = document.createElement('p')
  var spanOne = document.createElement('span')
  pOne.setAttribute('class', 'player-info');
  pOne.textContent = person.birthCity + ', ' + person.birthCountry;
  spanOne.setAttribute('class', 'bold');
  spanOne.textContent = 'Birthplace: '
  pOne.prepend(spanOne);


  var pTwo = document.createElement('p')
  var spanTwo = document.createElement('span')
  pTwo.setAttribute('class', 'player-info');
  pTwo.textContent = person.birthDate
  spanTwo.setAttribute('class', 'bold');
  spanTwo.textContent = 'Birthdate: '
  pTwo.prepend(spanTwo);

  var pThree = document.createElement('p')
  var spanThree = document.createElement('span')
  pThree.setAttribute('class', 'player-info');
  pThree.textContent = person.shootsCatches;
  spanThree.setAttribute('class', 'bold');
  if(person.primaryPosition.code === 'G') {
    spanThree.textContent = 'Catches: '
  } else {
    spanThree.textContent = 'Shoots: '
  }
  pThree.prepend(spanThree);

  $playerPageDiv.appendChild(nameHeading);
  $playerPageDiv.appendChild(infoHeading);
  $playerPageDiv.appendChild(pOne);
  $playerPageDiv.appendChild(pTwo);
  $playerPageDiv.appendChild(pThree);
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
