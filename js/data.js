/* exported data */

const data = {
  view: 'home-page',
}

let savedPlayer = []

let previousSavedPlayerJSON = localStorage.getItem('saved-players')

if(previousSavedPlayerJSON != null) {
  savedPlayer = (JSON.parse(previousSavedPlayerJSON));
}

window.addEventListener('click', function(e) {
  const playerJSON = JSON.stringify(savedPlayer);
  localStorage.setItem('saved-players', playerJSON);
})
