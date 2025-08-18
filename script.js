// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact mailto prefill
const form = document.getElementById('contact-form');
if (form && form.action.startsWith('mailto:')) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = encodeURIComponent(form.name.value);
    const email = encodeURIComponent(form.email.value);
    const message = encodeURIComponent(form.message.value);
    const subject = encodeURIComponent('Guitar Harbour Repair Inquiry');
    const body = `From: ${name} <${email}>%0D%0A%0D%0A${message}`;
    window.location.href = `${form.action}?subject=${subject}&body=${body}`;
  });
}

// Reveal on scroll
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));
}

// Slider for Shop
(function(){
  const track = document.getElementById('shop-track');
  if (!track) return;
  const prev = document.querySelector('.slider .prev');
  const next = document.querySelector('.slider .next');

  function slide(dir = 1) {
    const firstCard = track.querySelector('.slide');
    if (!firstCard) return;
    const w = firstCard.getBoundingClientRect().width + 16; // card width + gap
    track.scrollBy({ left: dir * w, behavior: 'smooth' });
  }

  prev?.addEventListener('click', () => slide(-1));
  next?.addEventListener('click', () => slide(1));

  // Keyboard support
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') slide(1);
    if (e.key === 'ArrowLeft') slide(-1);
  });
})();