// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const links = document.getElementById('links');
menuBtn.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.textContent = open ? 'Close' : 'Menu';
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.textContent = 'Menu';
}));

// Theme toggle (remembered in this browser)
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function setTheme(t) {
  root.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? 'Light' : 'Dark';
  themeBtn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' theme');
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

// Scroll gauge and active nav link
const fill = document.getElementById('gaugeFill');
const sections = [...document.querySelectorAll('main section')];
const navLinks = [...links.querySelectorAll('a')];
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  fill.style.height = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  let current = sections[0].id;
  sections.forEach(s => { if (scrollY + 120 >= s.offsetTop) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Typing effect in hero
const phrases = ['AI chatbots', 'water-saving systems', 'responsive websites'];
const typed = document.getElementById('typed');
let p = 0, c = 0, deleting = false;
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  typed.textContent = phrases[0];
} else {
  (function tick() {
    const word = phrases[p];
    c += deleting ? -1 : 1;
    typed.textContent = word.slice(0, c);
    let delay = deleting ? 40 : 90;
    if (!deleting && c === word.length) { deleting = true; delay = 1400; }
    else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 300; }
    setTimeout(tick, delay);
  })();
}

// Skill filter tabs
const tabs = document.querySelectorAll('.tab');
const items = document.querySelectorAll('#skillList li');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  const f = tab.dataset.filter;
  items.forEach(li => li.classList.toggle('hide', f !== 'all' && li.dataset.cat !== f));
}));

// Project details toggle
const moreBtn = document.getElementById('moreBtn');
const more = document.getElementById('projMore');
moreBtn.addEventListener('click', () => {
  const show = more.hasAttribute('hidden');
  more.toggleAttribute('hidden', !show);
  moreBtn.setAttribute('aria-expanded', show);
  moreBtn.textContent = show ? 'Hide details' : 'Show details';
});

// Contact form: validate, then open the visitor's email app
const form = document.getElementById('contactForm');
const status = document.getElementById('status');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const msg = form.msg.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById('nameErr').textContent = name ? '' : 'Enter your name.';
  document.getElementById('emailErr').textContent = emailOk ? '' : 'Enter a valid email address.';
  document.getElementById('msgErr').textContent = msg ? '' : 'Write a short message.';
  if (!name || !emailOk || !msg) { status.textContent = ''; return; }
  const body = encodeURIComponent(msg + '\n\nFrom: ' + name + ' (' + email + ')');
  location.href = 'mailto:prooparajoffical07@gmail.com?subject=' + encodeURIComponent('Portfolio message from ' + name) + '&body=' + body;
  status.textContent = 'Opening your email app to send the message.';
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
