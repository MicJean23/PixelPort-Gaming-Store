// Customer Data page: GET /api/customers and GET /api/games
const custBox = document.getElementById('customer-rows');
const prodBox = document.getElementById('product-rows');
fetch('/api/customers').then(r => { if (!r.ok) throw 0; return r.json(); }).then(list => {
  custBox.innerHTML = list.map(c => '<tr><td>' + c.id + '</td><td>' + c.name + '</td><td>' + c.email + '</td><td>' + c.note + '</td></tr>').join('');
}).catch(() => { custBox.innerHTML = '<tr><td colspan="4">Could not load customers. Is the server running?</td></tr>'; });
loadGames().then(list => {
  prodBox.innerHTML = list.map(g => '<tr><td>' + g.name + '</td><td>' + g.category + '</td><td>' + peso(g.price) + '</td><td>' +
    (g.discountPercent ? peso(salePrice(g)) + ' (' + g.discountPercent + '% off)' : 'No discount') + '</td></tr>').join('');
}).catch(() => { prodBox.innerHTML = '<tr><td colspan="4">Could not load products. Is the server running?</td></tr>'; });
