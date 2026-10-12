// Shared helpers for showing products. Used by the home page and Games & Gear page.
function peso(n) {
  return '₱' + (Number.isInteger(n)
    ? n.toLocaleString('en-US')
    : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
}
// 749 with 20% off -> 599.20 (rounded to centavos)
function salePrice(game) {
  return Math.round(game.price * (100 - game.discountPercent)) / 100;
}
async function loadGames() {
  const res = await fetch('/api/games');            // GET request
  if (!res.ok) throw new Error('Server answered ' + res.status);
  return res.json();
}
function priceHtml(g) {
  if (g.discountPercent > 0)
    return '<s>' + peso(g.price) + '</s><span class="now">' + peso(salePrice(g)) + '</span>';
  return peso(g.price);
}
function cardHtml(g) {
  const badge = g.discountPercent > 0 ? '<span class="badge">' + g.discountPercent + '% OFF</span>' : '';
  return '<article class="card">' +
    '<div class="pic"><img src="' + g.image + '" alt="' + g.name + '" loading="lazy" width="300" height="225">' + badge + '</div>' +
    '<div class="body"><span class="cat">' + g.category + '</span><h3>' + g.name + '</h3>' +
    '<p>' + g.description + '</p>' +
    '<div class="price">' + priceHtml(g) + '</div>' +
    '<div class="avail">' + g.availability + '</div>' +
    '<button class="btn small" data-id="' + g.id + '">View details</button></article>';
}
function showLoadError(el) {
  el.innerHTML = '<p class="alert bad">Could not load products. Please start the server with <code>npm start</code> and open <code>http://localhost:3000</code>.</p>';
}
