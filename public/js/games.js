// Games & Gear page: filter buttons + product details window
const list = document.getElementById('product-list');
const dialog = document.getElementById('details');
let allGames = [];
let filter = 'All';

function render() {
  const shown = allGames.filter(g =>
    filter === 'All' ? true :
    filter === 'Offer' ? g.discountPercent > 0 :
    filter === 'Accessory' ? g.type === 'accessory' : g.category === filter);
  list.innerHTML = shown.map(cardHtml).join('') || '<p>No products in this category.</p>';
}
function openDetails(id) {
  const g = allGames.find(x => x.id === Number(id));
  if (!g) return;
  const offer = g.discountPercent > 0
    ? '<p class="note">Part of the 20% off selected digital games offer. Saves ' + peso(g.price - salePrice(g)) + '.</p>'
    : '<p class="note">Regular price. Not part of the 20% offer.</p>';
  document.getElementById('modal-body').innerHTML =
    '<img src="' + g.image + '" alt="' + g.name + '">' +
    '<div class="info"><button class="close" aria-label="Close details">&times;</button>' +
    '<span class="cat">' + g.category + '</span><h3>' + g.name + '</h3><p>' + g.description + '</p>' +
    '<div class="price">' + priceHtml(g) + '</div>' + offer +
    '<div class="avail">Status: ' + g.availability + '</div>' +
    '<div class="actions"><a class="btn small" href="contact.html?product=' + encodeURIComponent(g.name) + '">Send inquiry</a></div></div>';
  dialog.showModal();
}
document.querySelectorAll('.filters button').forEach(btn => btn.addEventListener('click', () => {
  filter = btn.dataset.filter;
  document.querySelectorAll('.filters button').forEach(b => b.setAttribute('aria-pressed', b === btn));
  render();
}));
list.addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (b) openDetails(b.dataset.id); });
dialog.addEventListener('click', e => { if (e.target === dialog || e.target.closest('.close')) dialog.close(); });

loadGames().then(games => {
  allGames = games;
  const params = new URLSearchParams(location.search);
  if (params.get('filter') === 'offer') {          // campaign links use ?filter=offer
    filter = 'Offer';
    document.querySelectorAll('.filters button').forEach(b => b.setAttribute('aria-pressed', b.dataset.filter === 'Offer'));
  }
  render();
  if (params.get('open')) openDetails(params.get('open'));
}).catch(() => showLoadError(list));
