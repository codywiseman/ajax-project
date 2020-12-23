/* exported data */

var data = {
  view: 'home-page',
}

var savedPlayer = []

var previousSavedPlayerJSON = localStorage.getItem('saved-players')

if(previousSavedPlayerJSON != null) {
  savedPlayer = (JSON.parse(previousSavedPlayerJSON));
}

var $playerPageDiv = document.querySelector('div[data-view="player-page');

window.addEventListener('click', function(e) {
  var playerJSON = JSON.stringify(savedPlayer);
  localStorage.setItem('saved-players', playerJSON);
})
