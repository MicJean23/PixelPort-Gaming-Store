// PixelPort Gaming Store - simple Node.js server (no external packages).
// Serves the files in /public, two GET API routes, and one POST route for the contact form.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json'); // private: never served

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

// GET /api/games and GET /api/customers: read a JSON file and return it
function sendDataFile(res, fileName) {
  fs.readFile(path.join(DATA_DIR, fileName), 'utf8', (err, text) => {
    if (err) return sendJson(res, 500, { error: 'Could not read ' + fileName });
    try { sendJson(res, 200, JSON.parse(text)); }
    catch (e) { sendJson(res, 500, { error: fileName + ' contains invalid JSON' }); }
  });
}

// Server-side validation (the browser checks too, but the server never trusts the browser)
function validateInquiry(d) {
  const errors = {};
  const name = String(d.name || '').trim();
  const email = String(d.email || '').trim();
  const subject = String(d.subject || '').trim();
  const message = String(d.message || '').trim();
  if (name.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Please enter a valid email address.';
  if (subject.length < 3) errors.subject = 'Please enter a subject (at least 3 characters).';
  if (message.length < 10) errors.message = 'Please write a message of at least 10 characters.';
  if (name.length > 80 || email.length > 120 || subject.length > 120 || message.length > 2000)
    errors.message = errors.message || 'One of the fields is too long.';
  return { errors, clean: { name, email, subject, message } };
}

// POST /api/contact: validate, then save to data/inquiries.json
function handleContact(req, res) {
  let raw = '';
  req.on('data', chunk => { raw += chunk; if (raw.length > 20000) req.destroy(); });
  req.on('end', () => {
    let body;
    try { body = JSON.parse(raw); } catch (e) { return sendJson(res, 400, { error: 'Invalid request.' }); }
    const { errors, clean } = validateInquiry(body || {});
    if (Object.keys(errors).length) return sendJson(res, 400, { error: 'Please fix the highlighted fields.', errors });
    fs.readFile(INQUIRIES_FILE, 'utf8', (readErr, text) => {
      let list = [];
      if (!readErr) { try { list = JSON.parse(text); } catch (e) { return sendJson(res, 500, { error: 'Inquiry file is damaged.' }); } }
      list.push({ id: Date.now(), receivedAt: new Date().toISOString(), ...clean });
      fs.writeFile(INQUIRIES_FILE, JSON.stringify(list, null, 2), writeErr => {
        if (writeErr) return sendJson(res, 500, { error: 'Your inquiry could not be saved. Please try again.' });
        sendJson(res, 201, { ok: true, message: 'Inquiry saved.' }); // success only AFTER saving worked
      });
    });
  });
}

function serveStatic(req, res, pathname) {
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(filePath, (err, content) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404 - Page not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath)] || 'application/octet-stream' });
    res.end(content);
  });
}

http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (req.method === 'GET' && pathname === '/api/games') return sendDataFile(res, 'games.json');
  if (req.method === 'GET' && pathname === '/api/customers') return sendDataFile(res, 'customers.json');
  if (req.method === 'POST' && pathname === '/api/contact') return handleContact(req, res);
  if (pathname.startsWith('/api/')) return sendJson(res, 404, { error: 'Unknown API route' });
  if (req.method === 'GET') return serveStatic(req, res, pathname);
  res.writeHead(405); res.end('Method not allowed');
}).listen(PORT, () => console.log('PixelPort is running at http://localhost:' + PORT));
