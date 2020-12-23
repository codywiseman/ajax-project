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
var $rosterTable = document.querySelector('.roster-table');



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
  $teamForm.reset();
  $playerForm.reset();
  $suggestion.innerHTML = '';
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

var player;

$playerForm.addEventListener('submit', function(e){
  e.preventDefault();
  var playerXhr = new XMLHttpRequest();
  var idName = $playerSearch.value.toLowerCase();
  for(var i = 0; i < playerIds.length; i++) {
    if(playerIds[i].hasOwnProperty(idName)) {
      id = playerIds[i][idName]
      playerXhr.open('GET', 'https://statsapi.web.nhl.com/api/v1/people/' + id.toString());
      playerXhr.responseType = 'json';
      playerXhr.addEventListener('load', function (){
        player = playerXhr.response.people[0];
        $playerPageDiv.innerHTML = '';
        renderPlayerPage(player);
        var statsXhr = new XMLHttpRequest();
        statsXhr.open('GET', ' https://statsapi.web.nhl.com/api/v1/people/' + id.toString() + '/stats/?stats=yearByYear');
        statsXhr.responseType = 'json';
        statsXhr.addEventListener('load', function () {
          renderPlayerStats(statsXhr.response.stats[0].splits);
          dataview('player-page');
          $playerForm.reset();
        })
        statsXhr.send();
      })
      i = playerIds.length;
    }
  }
  playerXhr.send();
})


/*       Player seach bar suggestions        */

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

/*      Click on player on roster to be take to player page       */

document.addEventListener('click', function (e) {
  if (data.view === 'team-page' && e.target.tagName === 'TD') {
    var idName = e.target.closest('.player-row').innerHTML.toLowerCase();
    var playerXhr = new XMLHttpRequest();
    for (var i = 0; i < playerIds.length; i++) {
      if (playerIds[i].hasOwnProperty(idName)) {
        var id = playerIds[i][idName];
        playerXhr.open('GET', 'https://statsapi.web.nhl.com/api/v1/people/' + id.toString());
        playerXhr.responseType = 'json';
        playerXhr.addEventListener('load', function () {
          player = playerXhr.response.people[0];
          $playerPageDiv.innerHTML = '';
          renderPlayerPage(player);
          var statsXhr = new XMLHttpRequest();
          statsXhr.open('GET', ' https://statsapi.web.nhl.com/api/v1/people/' + id.toString() + '/stats/?stats=yearByYear');
          statsXhr.responseType = 'json';
          statsXhr.addEventListener('load', function () {
            renderPlayerStats(statsXhr.response.stats[0].splits);
            dataview('player-page');
            scroll(0, 0);
          })
          statsXhr.send();
        })
        i = playerIds.length;
      }
    }
    playerXhr.send();
  }
})

/*     Favorite Player listener   */

$playerPageDiv.addEventListener('click', function (e) {
  var $star =document.getElementById('favorite');
  if (e.target === $star && $star.className ==='far fa-star') {
    $star.className = 'fas fa-star'
  } else {
    $star.className = 'far fa-star'
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
      divOne.setAttribute('class', 'flex-col my-2');

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
      tableBody.setAttribute('id', 'rosterBody')

      headRow.appendChild(tHeadOne);
      headRow.appendChild(tHeadTwo);
      headRow.appendChild(tHeadThree);
      tableHead.appendChild(headRow);
      table.appendChild(tableHead);
      $teamPageDiv.appendChild(tableLabel);

      for(var rosterSpot = 0; rosterSpot < teamRoster.length; rosterSpot++) {
        var tableRow = document.createElement('tr');

        var tDataOne = document.createElement('td');
        tDataOne.textContent = teamRoster[rosterSpot].jerseyNumber;

        var tDataTwo = document.createElement('td');
        tDataTwo.setAttribute('class', 'player-row')
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

  var star = document.createElement('i');
  star.setAttribute('class', 'far fa-star');
  star.setAttribute('id', 'favorite');
  nameHeading.prepend(star);

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

function renderPlayerStats(stats) {
  var statsTitle = document.createElement('h4');
  statsTitle.textContent = 'Statistics';

  var tableDiv = document.createElement('div');
  tableDiv.setAttribute('class', 'stats-table-div table-responsive');

  var table  = document.createElement('table');
  table.setAttribute('class', 'stats-table');

  var thead = document.createElement('thead');

  var trowOne = document.createElement('tr');
  trowOne.setAttribute('class', 'stats-row');

  var th1 = document.createElement('th');
  th1.textContent = 'YR'

  var th2 = document.createElement('th');
  th2.textContent = 'TM'

  var th3 = document.createElement('th');
  th3.textContent = 'LG'

  var th4 = document.createElement('th');
  th4.textContent = 'GP'

  $playerPageDiv.appendChild(statsTitle);
  $playerPageDiv.appendChild(tableDiv);
  tableDiv.appendChild(table);
  table.appendChild(thead);
  thead.appendChild(trowOne);
  trowOne.appendChild(th1);
  trowOne.appendChild(th2);
  trowOne.appendChild(th3);
  trowOne.appendChild(th4);

  if(player.primaryPosition.code === 'G') {
    var goalieHeadingOne = document.createElement('th');
    goalieHeadingOne.textContent = 'W'

    var goalieHeadingTwo = document.createElement('th');
    goalieHeadingTwo.textContent = 'L'

    var goalieHeadingThree = document.createElement('th');
    goalieHeadingThree.textContent = 'GA'

    var goalieHeadingFour = document.createElement('th');
    goalieHeadingFour.textContent = 'GAA'

    var goalieHeadingFive = document.createElement('th');
    goalieHeadingFive.textContent = 'SO'

    var goalieHeadingSix = document.createElement('th');
    goalieHeadingSix.textContent = 'SAVES'

    var goalieHeadingSeven = document.createElement('th');
    goalieHeadingSeven.textContent = 'SV%'

    var tbody = document.createElement('tbody');

    trowOne.appendChild(goalieHeadingOne);
    trowOne.appendChild(goalieHeadingTwo);
    trowOne.appendChild(goalieHeadingThree);
    trowOne.appendChild(goalieHeadingFour);
    trowOne.appendChild(goalieHeadingFive);
    trowOne.appendChild(goalieHeadingSix);
    trowOne.appendChild(goalieHeadingSeven);
    table.appendChild(tbody);

    for (var x = (stats.length - 1); x > 0; x--) {
      var tbrow = document.createElement('tr');
      tbrow.setAttribute('class', 'stats-row');

      var td1 = document.createElement('td');
      td1.textContent = stats[x].season;

      var td2 = document.createElement('td');
      td2.textContent = stats[x].team.name;

      var td3 = document.createElement('td');
      if (stats[x].league.name === 'National Hockey League') {
        td3.textContent = 'NHL'
      } else {
        td3.textContent = stats[x].league.name;
      }

      var td4 = document.createElement('td');
      td4.textContent = stats[x].stat.games;

      var td5 = document.createElement('td');
      td5.textContent = stats[x].stat.wins;

      var td6 = document.createElement('td');
      td6.textContent = stats[x].stat.losses;

      var td7 = document.createElement('td');
      td7.textContent = stats[x].stat.goalsAgainst;

      var td8 = document.createElement('td');
      td8.textContent = stats[x].stat.goalAgainstAverage;

      var td9 = document.createElement('td');
      td9.textContent = stats[x].stat.shutouts;

      var td10 = document.createElement('td');
      td10.textContent = stats[x].stat.saves;

      var td11 = document.createElement('td');
      td11.textContent = stats[x].stat.savePercentage;

      tbrow.appendChild(td1);
      tbrow.appendChild(td2);
      tbrow.appendChild(td3);
      tbrow.appendChild(td4);
      tbrow.appendChild(td5);
      tbrow.appendChild(td6);
      tbrow.appendChild(td7);
      tbrow.appendChild(td8);
      tbrow.appendChild(td9);
      tbrow.appendChild(td10);
      tbrow.appendChild(td11);
      tbody.appendChild(tbrow);
    }
  }
  else {

  var th5 = document.createElement('th');
  th5.textContent = 'G'

  var th6 = document.createElement('th');
  th6.textContent = 'A'

  var th7 = document.createElement('th');
  th7.textContent = 'PTS'

  var th8 = document.createElement('th');
  th8.textContent = 'S'

  var th9 = document.createElement('th');
  th9.textContent = 'S%'

  var th10 = document.createElement('th');
  th10.textContent = '+/-'

  var th11 = document.createElement('th');
  th11.textContent = 'PIM'

  var th12 = document.createElement('th');
  th12.textContent = 'SHG'

  var th13 = document.createElement('th');
  th13.textContent = 'PPG'

  var th14 = document.createElement('th');
  th14.textContent = 'GWG'

  var th15 = document.createElement('th');
  th15.textContent = 'OTG'

  var th16 = document.createElement('th');
  th16.textContent = 'TOI'

  var th18 = document.createElement('th');
  th18.textContent = 'FO%'

  var th19 = document.createElement('th');
  th19.textContent = 'BLK'

  var th20 = document.createElement('th');
  th20.textContent = 'HITS'

  var tbody = document.createElement('tbody');

  trowOne.appendChild(th5);
  trowOne.appendChild(th6);
  trowOne.appendChild(th7);
  trowOne.appendChild(th8);
  trowOne.appendChild(th9);
  trowOne.appendChild(th10);
  trowOne.appendChild(th11);
  trowOne.appendChild(th12);
  trowOne.appendChild(th13);
  trowOne.appendChild(th14);
  trowOne.appendChild(th15);
  trowOne.appendChild(th16);
  trowOne.appendChild(th18);
  trowOne.appendChild(th19);
  trowOne.appendChild(th20);
  table.appendChild(tbody);

  for (var i = (stats.length - 1); i > 0; i--) {
    var tbrow = document.createElement('tr');
    tbrow.setAttribute('class', 'stats-row');

    var td1 = document.createElement('td');
    td1.textContent = stats[i].season;

    var td2 = document.createElement('td');
    td2.textContent = stats[i].team.name;

    var td3 = document.createElement('td');
    if (stats[i].league.name === 'National Hockey League') {
      td3.textContent = 'NHL'
    } else {
      td3.textContent = stats[i].league.name;
    }

    var td4 = document.createElement('td');
    td4.textContent = stats[i].stat.games;

    var td5 = document.createElement('td');
    td5.textContent = stats[i].stat.goals;

    var td6 = document.createElement('td');
    td6.textContent = stats[i].stat.assists;

    var td7 = document.createElement('td');
    td7.textContent = stats[i].stat.points;

    var td8 = document.createElement('td');
    td8.textContent = stats[i].stat.shots;

    var td9 = document.createElement('td');
    td9.textContent = stats[i].stat.shotPct;

    var td10 = document.createElement('td');
    td10.textContent = stats[i].stat.plusMinus;

    var td11 = document.createElement('td');
    td11.textContent = stats[i].stat.penaltyMinutes;

    var td12 = document.createElement('td');
    td12.textContent = stats[i].stat.shortHandedGoals;

    var td13 = document.createElement('td');
    td13.textContent = stats[i].stat.powerPlayGoals;

    var td14 = document.createElement('td');
    td14.textContent = stats[i].stat.gameWinningGoals;

    var td15 = document.createElement('td');
    td15.textContent = stats[i].stat.overTimeGoals;

    var td16 = document.createElement('td');
    td16.textContent = stats[i].stat.timeOnIce;

    var td18 = document.createElement('td');
    td18.textContent = stats[i].stat.faceOffPct;

    var td19 = document.createElement('td');
    td19.textContent = stats[i].stat.blocked;

    var td20 = document.createElement('td');
    td20.textContent = stats[i].stat.hits;

    tbrow.appendChild(td1);
    tbrow.appendChild(td2);
    tbrow.appendChild(td3);
    tbrow.appendChild(td4);
    tbrow.appendChild(td5);
    tbrow.appendChild(td6);
    tbrow.appendChild(td7);
    tbrow.appendChild(td8);
    tbrow.appendChild(td9);
    tbrow.appendChild(td10);
    tbrow.appendChild(td11);
    tbrow.appendChild(td12);
    tbrow.appendChild(td13);
    tbrow.appendChild(td14);
    tbrow.appendChild(td15);
    tbrow.appendChild(td16);
    tbrow.appendChild(td18);
    tbrow.appendChild(td19);
    tbrow.appendChild(td20);
    tbody.appendChild(tbrow)
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
