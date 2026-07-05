// ── Shared JS for Ojedokun Portfolio ──

// Scroll reveal
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// Mobile menu
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  const close  = document.getElementById('mobile-close');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.add('open'));
  if (close) close.addEventListener('click', () => menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

// FAQ accordion
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// Testimonial slider
function initTestimonial() {
  const quotes = document.querySelectorAll('.testimonial-slide');
  if (!quotes.length) return;
  let current = 0;
  const show = (i) => {
    quotes.forEach((q, idx) => {
      q.style.opacity = idx === i ? '1' : '0';
      q.style.pointerEvents = idx === i ? 'auto' : 'none';
    });
  };
  show(0);
  document.getElementById('t-prev')?.addEventListener('click', () => {
    current = (current - 1 + quotes.length) % quotes.length;
    show(current);
  });
  document.getElementById('t-next')?.addEventListener('click', () => {
    current = (current + 1) % quotes.length;
    show(current);
  });
}

// Contact form
function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('contact-submit');
  if (!form || !btn) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.textContent = 'Message sent — thank you!';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  });
}

// Navbar scroll shadow
function initNavScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.style.boxShadow = '0 2px 40px rgba(0,0,0,0.5)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initMobileMenu();
  initFaq();
  initTestimonial();
  initContactForm();
  initNavScroll();
});
