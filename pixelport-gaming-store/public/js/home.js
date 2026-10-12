// Home page: featured digital games and a small set of featured accessories
const gamesBox = document.getElementById('featured-games');
const gearBox = document.getElementById('featured-gear');
loadGames().then(games => {
  gamesBox.innerHTML = games.filter(g => [1, 2, 3].includes(g.id)).map(cardHtml).join('');
  gearBox.innerHTML = games.filter(g => [5, 7].includes(g.id)).map(cardHtml).join('');
  document.querySelector('main').addEventListener('click', e => {
    const b = e.target.closest('button[data-id]');
    if (b) location.href = 'games.html?open=' + b.dataset.id;   // opens that product's details
  });
}).catch(() => showLoadError(gamesBox));
