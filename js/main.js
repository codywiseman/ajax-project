const $playerPageDiv = document.querySelector('div[data-view="player-page');
const $teamSelect = document.getElementById('team-select');
const $viewClasses = document.querySelectorAll('.view');
const $teamForm = document.querySelector('.team-form')
const $teamPageDiv = document.querySelector('div[data-view="team-page');
const $teamSelectOptions = document.getElementsByClassName('team');
const $homeLogo = document.querySelector('.logo');
const $playerForm = document.querySelector('.player-form');
const $playerSearch = document.querySelector('.player-search');
const $suggestion = document.querySelector('.suggestions');
const $rosterTable = document.querySelector('.roster-table');
const $favoritePage = document.querySelector('div[data-view="favorite-page');
const $btnFav = document.querySelector('.btn-fav');
const $searchBox = document.getElementById('search-box')
const $errorPage = document.querySelector('div[data-view="error-page"]');
let $star = null;


let teamsList = null;

const playerIds = [];

const playerNames = []

let player = null;

let thisSeasonStats = null;


// Click NHL logo to clear page content

$homeLogo.addEventListener('click', () => {
  $teamForm.reset();
  $playerForm.reset();
  $suggestion.innerHTML = '';
  dataview('landing-page');
})


// Request for Teams

const teamsXhr = new XMLHttpRequest();
teamsXhr.open('GET', 'https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster');
teamsXhr.responseType = 'json';
teamsXhr.addEventListener('load', () => {
  teamsList = teamsXhr.response.teams;
  for (let i = 0; i < teamsList.length; i++) {
    const team = teamsList[i];
    const teamOption = document.createElement('option');
    teamOption.value = teamsList[i].teamName;
    teamOption.className = 'team';
    teamOption.textContent = teamsList[i].name;
    $teamSelect.appendChild(teamOption);
  }
  for (let z = 0; z < teamsList.length; z++) {
    for (let x = 0; x < teamsList[z].roster.roster.length; x++) {
      const obj = {};
      const playerObj = {};
      obj[(teamsList[z].roster.roster[x].person.fullName).toLowerCase()] = teamsList[z].roster.roster[x].person.id;
      playerIds.push(obj);
      playerObj['name'] = (teamsList[z].roster.roster[x].person.fullName);
      playerNames.push(playerObj);
    }
  }
})
teamsXhr.send();

teamsXhr.addEventListener('error', () => {
  const reload = document.createElement('i')
  reload.className = 'fas fa-redo'

  $errorPage.appendChild(reload)

  dataview('error-page')
  reload.addEventListener('click', () => {
    console.log('reloaded')
  })
})


//Select team and submit to be take to team page

$teamForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if ($teamSelect.selectedIndex !== 0) {
    $teamPageDiv.innerHTML = '';
    renderTeamPage($teamSelectOptions[($teamSelect.selectedIndex - 1)].textContent);
    renderRoster($teamSelectOptions[($teamSelect.selectedIndex - 1)].textContent);
    dataview('team-page');
    $teamForm.reset();
  }
})

// Enter player name and submit to be taken to player page

$playerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const playerXhr = new XMLHttpRequest();
  let idName = $playerSearch.value.toLowerCase();
  for (let i = 0; i < playerIds.length; i++) {
    if (playerIds[i].hasOwnProperty(idName)) {
      id = playerIds[i][idName]
      playerXhr.open('GET',  `https://statsapi.web.nhl.com/api/v1/people/${id.toString()}`);
      playerXhr.responseType = 'json';
      playerXhr.addEventListener('load', () => {
        player = playerXhr.response.people[0];
        $playerPageDiv.innerHTML = '';
        renderPlayerPage(player);
        const statsXhr = new XMLHttpRequest();
        statsXhr.open('GET', `https://statsapi.web.nhl.com/api/v1/people/${id.toString()}/stats/?stats=yearByYear`);
        statsXhr.responseType = 'json';
        statsXhr.addEventListener('load', () => {
          allStats = statsXhr.response.stats[0].splits;
          thisSeasonStats = allStats[allStats.length - 1]
          renderPlayerStats(allStats);
          $star = document.getElementById('favorite');
          for (let x = 0; x < savedPlayer.length; x++) {
            if (savedPlayer[x].player === player.fullName) {
              $star.className = 'fas fa-star';
            }
          }
          dataview('player-page');
          $playerForm.reset();
        })
        statsXhr.send();
      })
      i = playerIds.length;
      playerXhr.send();
    }
    else if (i === (playerIds.length - 1)) {
      dataview('not-found');
    }
  }
})


// Player seach bar suggestions

$playerSearch.addEventListener('keyup', playerSuggestions);

function playerSuggestions() {
  let input = $playerSearch.value;
  $suggestion.innerHTML = '';
  const startsWith = [];
  playerNames.forEach((player) => {
    if (player.name.toLowerCase().startsWith(input.toLowerCase())) {
      startsWith.push(player.name);
    }
  });
  const condensedSuggestions = [];
  for (let i = 0; i < 6; i++) {
    if (startsWith[i] !== undefined) {
      condensedSuggestions.push(startsWith[i]);
    }
  }
  condensedSuggestions.forEach((suggested) => {
    const div = document.createElement('div');
    div.innerHTML = suggested;
    $suggestion.appendChild(div);
  })
  if (input === '') {
    $suggestion.innerHTML = ''
  }
}

$suggestion.addEventListener('click', (e) => {
  $playerSearch.value = e.target.innerHTML;
  $suggestion.innerHTML = '';
})

// Click on player on roster table to be taken to player page

document.addEventListener('click', (e) => {
  if (data.view === 'team-page' && e.target.tagName === 'TD') {
    let idName = e.target.closest('.player-row').innerHTML.toLowerCase();
    const playerXhr = new XMLHttpRequest();
    for (let i = 0; i < playerIds.length; i++) {
      if (playerIds[i].hasOwnProperty(idName)) {
        let id = playerIds[i][idName];
        playerXhr.open('GET', `https://statsapi.web.nhl.com/api/v1/people/${id.toString()}`);
        playerXhr.responseType = 'json';
        playerXhr.addEventListener('load', () => {
          player = playerXhr.response.people[0];
          $playerPageDiv.innerHTML = '';
          renderPlayerPage(player);
          const statsXhr = new XMLHttpRequest();
          statsXhr.open('GET', `https://statsapi.web.nhl.com/api/v1/people/${id.toString()}/stats/?stats=yearByYear`);
          statsXhr.responseType = 'json';
          statsXhr.addEventListener('load', () => {
            allStats = statsXhr.response.stats[0].splits;
            thisSeasonStats = allStats[allStats.length - 1]
            renderPlayerStats(allStats);
            $star = document.getElementById('favorite');
            for (let x = 0; x < savedPlayer.length; x++) {
              if (savedPlayer[x].player === player.fullName) {
                $star.className = 'fas fa-star';
              }
            }
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

// Click on team name on player page to be taken to team page

document.addEventListener('click', (e) => {
  if (data.view === 'player-page' && e.target.tagName === 'TD') {
    let idName = e.target.closest('.team').innerHTML
    $teamPageDiv.innerHTML = '';
    renderTeamPage(idName);
    renderRoster(idName);
    dataview('team-page');
    if ($teamPageDiv.innerHTML === '') {
      const noTeamData = document.createElement('h5')
      noTeamData.textContent = 'Oops! Sorry, Center Ice only has information for NHL Teams'

      $teamPageDiv.appendChild(noTeamData);
    }
  }
})

// Click on star to favorite player / unfavorite player

$playerPageDiv.addEventListener('click', (e) => {
  $star = document.getElementById('favorite');
  if (e.target === $star && $star.className === 'far fa-star') {
    $star.className = 'fas fa-star';
    const playerSaveObj = {};
    playerSaveObj['player'] = player.fullName;
    playerSaveObj['seasonStats'] = thisSeasonStats;
    savedPlayer.push(playerSaveObj);
  } else {
    for (let i = 0; i < savedPlayer.length; i++) {
      if (savedPlayer[i].player === player.fullName) {
        savedPlayer.splice(i, 1);
      }
      $star.className = 'far fa-star';
    }
  }
})

// Click on view tracked players

$btnFav.addEventListener('click', () => {
  $favoritePage.innerHTML = '';
  renderFavorites(savedPlayer);
  dataview('favorite-page');
});

//Render team info on team page

const teamLogoImages = {
  'New Jersey Devils': 'Images/devils.png',
  'New York Islanders': 'Images/islanders.png',
  'New York Rangers': 'Images/rangers.png',
  'Philadelphia Flyers': 'Images/flyers.png',
  'Pittsburgh Penguins': 'Images/penguins.png',
  'Boston Bruins': 'Images/bostonbruins.png',
  'Buffalo Sabres': 'Images/sabres.png',
  'Montréal Canadiens': 'Images/canadiens.png',
  'Ottawa Senators': 'Images/senators.png',
  'Toronto Maple Leafs': 'Images/mapleleafs.png',
  'Carolina Hurricanes': 'Images/canes.png',
  'Florida Panthers': 'Images/panthers.png',
  'Tampa Bay Lightning': 'Images/lightning.png',
  'Washington Capitals': 'Images/capitals.png',
  'Chicago Blackhawks': 'Images/blackhawks.png',
  'Detroit Red Wings': 'Images/redwings.png',
  'Nashville Predators': 'Images/predators.png',
  'St. Louis Blues': 'Images/blues.png',
  'Calgary Flames': 'Images/flames.png',
  'Colorado Avalanche': 'Images/avalanche.png',
  'Edmonton Oilers': 'Images/oilers.png',
  'Vancouver Canucks': 'Images/canucks.png',
  'Anaheim Ducks': 'Images/ducks.png',
  'Dallas Stars': 'Images/stars.png',
  'Los Angeles Kings': 'Images/kings.png',
  'San Jose Sharks': 'Images/sharks.png',
  'Columbus Blue Jackets': 'Images/jackets.png',
  'Minnesota Wild': 'Images/wilds.png',
  'Winnipeg Jets': 'Images/jets.png',
  'Arizona Coyotes': 'Images/coyotes.png',
  'Vegas Golden Knights': 'Images/knights.png'
}

function renderTeamPage(team) {
  for (let i = 0; i < teamsList.length; i++) {
    if (teamsList[i].name === team) {
      const divOne = document.createElement('div');
      divOne.setAttribute('class', 'flex-col my-2');

      const teamLogo = document.createElement('img');
      teamLogo.setAttribute('src', teamLogoImages[team])
      teamLogo.setAttribute('class', 'logo')
      teamLogo.setAttribute('alt', `${team} logo`)

      const divTwo = document.createElement('div');
      divTwo.setAttribute('class', 'team-info');

      const pOne = document.createElement('p')
      const spanOne = document.createElement('span')
      pOne.textContent = teamsList[i].name;
      spanOne.setAttribute('class', 'bold');
      spanOne.textContent = 'Team Name: ';
      pOne.prepend(spanOne);

      const pTwo = document.createElement('p')
      const spanTwo = document.createElement('span')
      pTwo.textContent = teamsList[i].abbreviation;
      spanTwo.setAttribute('class', 'bold');
      spanTwo.textContent = 'Abbreviation: ';
      pTwo.prepend(spanTwo);

      const pThree = document.createElement('p')
      const spanThree = document.createElement('span')
      pThree.textContent = teamsList[i].firstYearOfPlay;
      spanThree.setAttribute('class', 'bold');
      spanThree.textContent = 'Inaugural Season: ';
      pThree.prepend(spanThree);

      const pFour = document.createElement('p')
      const spanFour = document.createElement('span')
      pFour.textContent = teamsList[i].conference.name;
      spanFour.setAttribute('class', 'bold');
      spanFour.textContent = 'Conference: ';
      pFour.prepend(spanFour);

      const pFive = document.createElement('p')
      const spanFive = document.createElement('span')
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

// Render roster on team page

function renderRoster(team) {
  for (let i = 0; i < teamsList.length; i++) {
    if (teamsList[i].name === team) {
      const teamRoster = [];
      for (let x = 0; x < teamsList[i].roster.roster.length; x++) {
        teamRoster.push(teamsList[i].roster.roster[x])
      }
      teamRoster.sort((a,b) => {
        return a.jerseyNumber - b.jerseyNumber;
      });
      const tableLabel = document.createElement('h3');
      tableLabel.textContent = 'Roster'

      const table = document.createElement('table')
      table.setAttribute('class', 'roster-table');

      const tableHead = document.createElement('thead');

      const headRow = document.createElement('tr');

      const tHeadOne = document.createElement('th');
      tHeadOne.setAttribute('class', 'col-one');
      tHeadOne.textContent = 'No.';
      tHeadOne.title = 'Number';

      const tHeadTwo = document.createElement('th');
      tHeadTwo.textContent = 'Player';
      tHeadTwo.title = 'Player';

      const tHeadThree = document.createElement('th');
      tHeadThree.textContent = 'Position';
      tHeadThree.title = 'Position';

      const tableBody = document.createElement('tbody');
      tableBody.setAttribute('id', 'rosterBody')

      headRow.appendChild(tHeadOne);
      headRow.appendChild(tHeadTwo);
      headRow.appendChild(tHeadThree);
      tableHead.appendChild(headRow);
      table.appendChild(tableHead);
      $teamPageDiv.appendChild(tableLabel);

      for (let rosterSpot = 0; rosterSpot < teamRoster.length; rosterSpot++) {
        const tableRow = document.createElement('tr');

        const tDataOne = document.createElement('td');
        tDataOne.textContent = teamRoster[rosterSpot].jerseyNumber;

        const tDataTwo = document.createElement('td');
        tDataTwo.setAttribute('class', 'player-row')
        tDataTwo.textContent = teamRoster[rosterSpot].person.fullName;

        const tDataThree = document.createElement('td');
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

// Render player info on player page

function renderPlayerPage(person) {
  const nameHeading = document.createElement('h2');
  nameHeading.setAttribute('class', 'player-name');
  nameHeading.textContent = person.fullName;

  const star = document.createElement('i');
  star.setAttribute('class', 'far fa-star');
  star.setAttribute('id', 'favorite');
  nameHeading.prepend(star);

  const infoHeading = document.createElement('h4');
  infoHeading.setAttribute('class', 'player-info');
  infoHeading.textContent = `${person.primaryPosition.code} | ${person.height} | ${person.weight} lb | Age ${person.currentAge} | ${person.currentTeam.name}`;

  const pOne = document.createElement('p')
  const spanOne = document.createElement('span')
  pOne.setAttribute('class', 'player-info');
  pOne.textContent = `${person.birthCity}, ${person.birthCountry}`;
  spanOne.setAttribute('class', 'bold');
  spanOne.textContent = 'Birthplace: '
  pOne.prepend(spanOne);


  const pTwo = document.createElement('p')
  const spanTwo = document.createElement('span')
  pTwo.setAttribute('class', 'player-info');
  pTwo.textContent = person.birthDate
  spanTwo.setAttribute('class', 'bold');
  spanTwo.textContent = 'Birthdate: '
  pTwo.prepend(spanTwo);

  const pThree = document.createElement('p')
  const spanThree = document.createElement('span')
  pThree.setAttribute('class', 'player-info');
  pThree.textContent = person.shootsCatches;
  spanThree.setAttribute('class', 'bold');
  if (person.primaryPosition.code === 'G') {
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

//Render player stats on player page

function renderPlayerStats(stats) {
  const statsTitle = document.createElement('h4');
  statsTitle.textContent = 'Statistics';

  const tableDiv = document.createElement('div');
  tableDiv.setAttribute('class', 'stats-table-div table-responsive');

  const table = document.createElement('table');
  table.setAttribute('class', 'stats-table');

  const thead = document.createElement('thead');

  const trowOne = document.createElement('tr');
  trowOne.setAttribute('class', 'stats-row');

  const th1 = document.createElement('th');
  th1.textContent = 'YR';
  th1.title= 'Year';

  const th2 = document.createElement('th');
  th2.textContent = 'TM'
  th2.title = 'Team'

  const th3 = document.createElement('th');
  th3.textContent = 'LG'
  th3.title = 'League';

  const th4 = document.createElement('th');
  th4.textContent = 'GP'
  th4.title = 'Games Played'

  $playerPageDiv.appendChild(statsTitle);
  $playerPageDiv.appendChild(tableDiv);
  tableDiv.appendChild(table);
  table.appendChild(thead);
  thead.appendChild(trowOne);
  trowOne.appendChild(th1);
  trowOne.appendChild(th2);
  trowOne.appendChild(th3);
  trowOne.appendChild(th4);

  if (player.primaryPosition.code === 'G') {
    const goalieHeadingOne = document.createElement('th');
    goalieHeadingOne.textContent = 'W';
    goalieHeadingOne.title = 'Wins';

    const goalieHeadingTwo = document.createElement('th');
    goalieHeadingTwo.textContent = 'L';
    goalieHeadingTwo.title = 'Losses';

    const goalieHeadingThree = document.createElement('th');
    goalieHeadingThree.textContent = 'GA'
    goalieHeadingThree.title = 'Goals Against';

    const goalieHeadingFour = document.createElement('th');
    goalieHeadingFour.textContent = 'GAA';
    goalieHeadingFour.title = 'Goals Against Average';

    const goalieHeadingFive = document.createElement('th');
    goalieHeadingFive.textContent = 'SO';
    goalieHeadingFive.title ='Shutouts';

    const goalieHeadingSix = document.createElement('th');
    goalieHeadingSix.textContent = 'SAVES';
    goalieHeadingSix.title = 'Saves';

    const goalieHeadingSeven = document.createElement('th');
    goalieHeadingSeven.textContent = 'SV%';
    goalieHeadingSeven.title = 'Save Percentage';

    const tbody = document.createElement('tbody');

    trowOne.appendChild(goalieHeadingOne);
    trowOne.appendChild(goalieHeadingTwo);
    trowOne.appendChild(goalieHeadingThree);
    trowOne.appendChild(goalieHeadingFour);
    trowOne.appendChild(goalieHeadingFive);
    trowOne.appendChild(goalieHeadingSix);
    trowOne.appendChild(goalieHeadingSeven);
    table.appendChild(tbody);

    for (let x = (stats.length - 1); x > 0; x--) {
      const tbrow = document.createElement('tr');
      tbrow.setAttribute('class', 'stats-row');

      const td1 = document.createElement('td');
      const addHyphen = `${stats[x].season.slice(0, 4)}-${stats[x].season.slice(4)}`
      td1.textContent = addHyphen;

      const td2 = document.createElement('td');
      td2.textContent = stats[x].team.name;
      td2.className = 'team'

      const td3 = document.createElement('td');
      if (stats[x].league.name === 'National Hockey League') {
        td3.textContent = 'NHL'
      } else {
        td3.textContent = stats[x].league.name;
      }

      const td4 = document.createElement('td');
      td4.textContent = stats[x].stat.games;

      const td5 = document.createElement('td');
      td5.textContent = stats[x].stat.wins;

      const td6 = document.createElement('td');
      td6.textContent = stats[x].stat.losses;

      const td7 = document.createElement('td');
      td7.textContent = stats[x].stat.goalsAgainst;

      const td8 = document.createElement('td');
      td8.textContent = stats[x].stat.goalAgainstAverage;

      const td9 = document.createElement('td');
      td9.textContent = stats[x].stat.shutouts;

      const td10 = document.createElement('td');
      td10.textContent = stats[x].stat.saves;

      const td11 = document.createElement('td');
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

    const th5 = document.createElement('th');
    th5.textContent = 'G'
    th5.title = 'Goals'

    const th6 = document.createElement('th');
    th6.textContent = 'A'
    th6.title = 'Assists'

    const th7 = document.createElement('th');
    th7.textContent = 'PTS'
    th7.title = 'Points'

    const th8 = document.createElement('th');
    th8.textContent = 'S'
    th8.title = 'Shots'

    const th9 = document.createElement('th');
    th9.textContent = 'S%'
    th9.title = 'Shot Percentage'

    const th10 = document.createElement('th');
    th10.textContent = '+/-'
    th10.title = `A player is awarded a "plus" each time he is on the ice when his Club scores a goal. He receives a "minus" if he is on the ice for a goal scored by the opposing Club. The difference in these numbers is considered the player's "plus-minus" statistic.`

    const th11 = document.createElement('th');
    th11.textContent = 'PIM'
    th11.title = 'Penalty Minutes'

    const th12 = document.createElement('th');
    th12.textContent = 'SHG'
    th12.title = 'Shorthanded Goals'

    const th13 = document.createElement('th');
    th13.textContent = 'PPG'
    th13.title = 'Power Play Goals'

    const th14 = document.createElement('th');
    th14.textContent = 'GWG'
    th14.title = 'Game Winning Goals'

    const th15 = document.createElement('th');
    th15.textContent = 'OTG'
    th15.title = 'Overtime Goals'

    const th16 = document.createElement('th');
    th16.textContent = 'TOI'
    th16.title = 'Time on Ice'

    const th18 = document.createElement('th');
    th18.textContent = 'FO%'
    th18.title = 'Faceoff Win Percentage'

    const th19 = document.createElement('th');
    th19.textContent = 'BLK'
    th19.title = 'Blocked Shots'

    const th20 = document.createElement('th');
    th20.textContent = 'HITS'
    th20.title = 'Hits'

    const tbody = document.createElement('tbody');

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

    for (let i = (stats.length - 1); i > 0; i--) {
      const tbrow = document.createElement('tr');
      tbrow.setAttribute('class', 'stats-row');

      const td1 = document.createElement('td');
      const addHyphen = `${stats[i].season.slice(0, 4)}-${ stats[i].season.slice(4)}`
      td1.textContent = addHyphen;

      const td2 = document.createElement('td');
      td2.textContent = stats[i].team.name;
      td2.className = 'team'

      const td3 = document.createElement('td');
      if (stats[i].league.name === 'National Hockey League') {
        td3.textContent = 'NHL'
      } else {
        td3.textContent = stats[i].league.name;
      }

      const td4 = document.createElement('td');
      td4.textContent = stats[i].stat.games;

      const td5 = document.createElement('td');
      td5.textContent = stats[i].stat.goals;

      const td6 = document.createElement('td');
      td6.textContent = stats[i].stat.assists;

      const td7 = document.createElement('td');
      td7.textContent = stats[i].stat.points;

      const td8 = document.createElement('td');
      td8.textContent = stats[i].stat.shots;

      const td9 = document.createElement('td');
      td9.textContent = stats[i].stat.shotPct;

      const td10 = document.createElement('td');
      td10.textContent = stats[i].stat.plusMinus;

      const td11 = document.createElement('td');
      td11.textContent = stats[i].stat.penaltyMinutes;

      const td12 = document.createElement('td');
      td12.textContent = stats[i].stat.shortHandedGoals;

      const td13 = document.createElement('td');
      td13.textContent = stats[i].stat.powerPlayGoals;

      const td14 = document.createElement('td');
      td14.textContent = stats[i].stat.gameWinningGoals;

      const td15 = document.createElement('td');
      td15.textContent = stats[i].stat.overTimeGoals;

      const td16 = document.createElement('td');
      td16.textContent = stats[i].stat.timeOnIce;

      const td18 = document.createElement('td');
      td18.textContent = stats[i].stat.faceOffPct;

      const td19 = document.createElement('td');
      td19.textContent = stats[i].stat.blocked;

      const td20 = document.createElement('td');
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

// Render favorite players from storage on favorites page

function renderFavorites(players) {
  if (savedPlayer[0] === undefined) {
    const tableLabelNone = document.createElement('h5');
    tableLabelNone.textContent = 'Currently No Players Being Tracked';
    $favoritePage.appendChild(tableLabelNone);
    return;
  }
  const tableLabel = document.createElement('h5');
  tableLabel.textContent = 'Tracked Players (Current Season Stats)'

  const tableDiv = document.createElement('div');
  tableDiv.setAttribute('class', 'stats-table-div table-responsive');

  const table = document.createElement('table');
  table.setAttribute('class', 'stats-table center-table');

  const thead = document.createElement('thead');

  const tHeadRow = document.createElement('tr');
  tHeadRow.setAttribute('class', 'stats-row');

  const th1 = document.createElement('th');
  th1.textContent = 'Player';
  th1.title = 'Player';

  const th2 = document.createElement('th');
  th2.textContent = 'Team';
  th2.title = 'Team'

  const th3 = document.createElement('th');
  th3.textContent = 'GP';
  th3.title = 'Games Played';

  const th4 = document.createElement('th');
  th4.textContent = 'G';
  th4.title = 'Goals';

  const th5 = document.createElement('th');
  th5.textContent = 'A';
  th5.title = 'Assists';

  const th6 = document.createElement('th');
  th6.textContent = 'PTS';
  th6.title = 'Points';

  const th7 = document.createElement('th');
  th7.textContent = '+/-';
  th7.title = `A player is awarded a "plus" each time he is on the ice when his Club scores a goal. He receives a "minus" if he is on the ice for a goal scored by the opposing Club. The difference in these numbers is considered the player's "plus-minus" statistic.`

  const tBody = document.createElement('tbody')

  $favoritePage.appendChild(tableLabel);
  $favoritePage.appendChild(tableDiv);
  tableDiv.appendChild(table);
  table.appendChild(thead);
  thead.appendChild(tHeadRow);
  tHeadRow.appendChild(th1);
  tHeadRow.appendChild(th2);
  tHeadRow.appendChild(th3);
  tHeadRow.appendChild(th4);
  tHeadRow.appendChild(th5);
  tHeadRow.appendChild(th6);
  tHeadRow.appendChild(th7);
  table.appendChild(tBody);

  for (let i = 0; i < savedPlayer.length; i++) {
    const tableRow = document.createElement('tr');
    tableRow.setAttribute('class', 'stats-row');

    const td1 = document.createElement('td');
    td1.textContent = players[i].player;

    const td2 = document.createElement('td');
    td2.textContent = players[i].seasonStats.team.name;

    const td3 = document.createElement('td');
    td3.textContent = players[i].seasonStats.stat.games;

    const td4 = document.createElement('td');
    td4.textContent = players[i].seasonStats.stat.goals;

    const td5 = document.createElement('td');
    td5.textContent = players[i].seasonStats.stat.assists;

    const td6 = document.createElement('td');
    td6.textContent = players[i].seasonStats.stat.points;

    const td7 = document.createElement('td');
    td7.textContent = players[i].seasonStats.stat.plusMinus;

    tableRow.appendChild(td1);
    tableRow.appendChild(td2);
    tableRow.appendChild(td3);
    tableRow.appendChild(td4);
    tableRow.appendChild(td5);
    tableRow.appendChild(td6);
    tableRow.appendChild(td7);
    tBody.appendChild(tableRow);
  }
}

// View Swapping

function dataview(viewName) {
  for (let i = 0; i < $viewClasses.length; i++) {
    if ($viewClasses[i].getAttribute('data-view') === viewName) {
      $viewClasses[i].className = 'view';
      data.view = viewName;
    } else {
      $viewClasses[i].className = 'view hidden';
    }
  }
}
