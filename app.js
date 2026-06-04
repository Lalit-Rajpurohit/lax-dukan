/* ============================================================
   Shri Krishna Decoration — interactions
   ============================================================ */

// --- Year in footer ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- Theme toggle (default light, remembers choice) ---
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// --- Language toggle (default Kannada, switch to English; remembers choice) ---
const langBtn = document.getElementById('langBtn');
const i18nEls = document.querySelectorAll('[data-i18n]');
const i18nPh  = document.querySelectorAll('[data-en-ph]');
// capture the in-HTML Kannada text as the 'kn' value
i18nEls.forEach((el) => { el.dataset.kn = el.textContent; });
i18nPh.forEach((el) => { el.dataset.knPh = el.placeholder; });

function applyLang(lang) {
  i18nEls.forEach((el) => {
    el.textContent = lang === 'en' ? (el.dataset.en || el.dataset.kn) : el.dataset.kn;
  });
  i18nPh.forEach((el) => {
    el.placeholder = lang === 'en' ? (el.dataset.enPh || el.dataset.knPh) : el.dataset.knPh;
  });
  document.documentElement.setAttribute('lang', lang);
  if (langBtn) langBtn.textContent = lang === 'en' ? 'ಕನ್ನಡ' : 'EN';
  localStorage.setItem('lang', lang);
}

let curLang = localStorage.getItem('lang') === 'en' ? 'en' : 'kn';
applyLang(curLang);
langBtn.addEventListener('click', () => {
  curLang = curLang === 'en' ? 'kn' : 'en';
  applyLang(curLang);
});

// --- Mobile menu toggle ---
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// --- Smooth in-page scroll + close mobile menu on any nav link ---
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    mobileMenu.classList.add('hidden');                       // close the mobile menu
    target.scrollIntoView({ behavior: 'smooth', block: 'start' }); // smooth scroll (header offset via scroll-padding)
    history.replaceState(null, '', id);
  });
});

// close mobile menu when tapping outside it
document.addEventListener('click', (e) => {
  if (!mobileMenu.classList.contains('hidden') &&
      !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
    mobileMenu.classList.add('hidden');
  }
});

// --- Navbar shadow on scroll ---
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// --- Reveal on scroll ---
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// --- Count-up stats ---
const countEls = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
countEls.forEach((el) => countObserver.observe(el));

// --- Contact form → WhatsApp ---
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get('name') || '').trim();
  const phone = (data.get('phone') || '').trim();
  const service = data.get('service') || '';
  const message = (data.get('message') || '').trim();

  const text =
    `Hi Shri Krishna Decoration!%0A%0A` +
    `*Name:* ${encodeURIComponent(name)}%0A` +
    `*Phone:* ${encodeURIComponent(phone)}%0A` +
    `*Service:* ${encodeURIComponent(service)}%0A` +
    `*Message:* ${encodeURIComponent(message)}`;

  window.open(`https://wa.me/919380440967?text=${text}`, '_blank');
});
