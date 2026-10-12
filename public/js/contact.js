// Contact page: validate, send to the server, show success only after it was saved
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const fields = ['name', 'email', 'subject', 'message'];

// If we came from "Send inquiry", put the product in the subject
const product = new URLSearchParams(location.search).get('product');
if (product) form.subject.value = 'Inquiry about ' + product;

function check(data) {
  const e = {};
  if (data.name.length < 2) e.name = 'Please enter your name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) e.email = 'Please enter a valid email address.';
  if (data.subject.length < 3) e.subject = 'Please enter a subject (at least 3 characters).';
  if (data.message.length < 10) e.message = 'Please write a message of at least 10 characters.';
  return e;
}
function showErrors(errors) {
  fields.forEach(f => {
    document.getElementById('err-' + f).textContent = errors[f] || '';
    form[f].classList.toggle('invalid', Boolean(errors[f]));
    form[f].setAttribute('aria-invalid', Boolean(errors[f]));
  });
}
function banner(type, text) {
  status.className = 'alert ' + type; status.textContent = text; status.hidden = false;
}
form.addEventListener('submit', async e => {
  e.preventDefault();
  status.hidden = true;
  const data = {}; fields.forEach(f => data[f] = form[f].value.trim());
  const errors = check(data);
  showErrors(errors);
  if (Object.keys(errors).length) { banner('bad', 'Please fix the highlighted fields.'); return; }
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await res.json();
    if (res.ok && result.ok) {
      banner('ok', 'Thank you, ' + data.name + '! Your inquiry was saved.');
      form.reset(); showErrors({});
    } else {
      showErrors(result.errors || {});
      banner('bad', result.error || 'Something went wrong. Please try again.');
    }
  } catch (err) {
    banner('bad', 'Could not reach the server. Make sure it is running (npm start) and try again.');
  }
  btn.disabled = false; btn.textContent = 'Send message';
});
