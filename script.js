/* ─── VAHAARA script.js — Adaline-style redesign ─── */

/* ═══════════════════
   THEME TOGGLE
   ═══════════════════ */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('vahaara-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('vahaara-theme', next);
});

/* ═══════════════════
   NAVBAR SCROLL
   ═══════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 2px 28px rgba(0,0,0,0.25)'
    : 'none';
}, { passive: true });

/* ═══════════════════
   MOBILE MENU
   ═══════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMobileMenu();
});

/* ═══════════════════
   MODALS
   ═══════════════════ */
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const first = m.querySelector('input,textarea');
    if (first) first.focus();
  }, 350);
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOnOverlay(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

/* ═══════════════════
   TOAST
   ═══════════════════ */
function showToast(msg, dur = 3800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

/* ═══════════════════
   FORM HANDLING
   ═══════════════════ */
function handleFormSubmit(e, modalId, successMsg) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  btn.style.opacity = '0.65';

  setTimeout(() => {
    btn.textContent = '✓ Done!';
    btn.style.opacity = '1';
    setTimeout(() => {
      closeModal(modalId);
      e.target.reset();
      btn.textContent = orig;
      btn.disabled = false;
      showToast(successMsg);
    }, 700);
  }, 1400);
}

/* ═══════════════════════════════════════════════
   SCROLL-REVEAL WINDOW — Adaline Shoji Effect
   ═══════════════════════════════════════════════
   Strategy:
   - Track scroll position relative to the
     scrolling-panels-col container
   - Each scroll-panel has data-panel="1..4"
   - When a panel enters the viewport center,
     activate the corresponding window-panel
   ─────────────────────────────────────────── */
const panels = document.querySelectorAll('.scroll-panel');
const winPanels = document.querySelectorAll('.window-panel');
const winDots = document.querySelectorAll('.wn-dot');
const windowTitle = document.getElementById('windowTitle');

const panelTitles = {
  '1': 'AI & Machine Learning',
  '2': 'Web & Mobile Development',
  '3': 'Startup Engineering',
  '4': 'SaaS & Cloud Platforms',
};

let currentActive = '1';

function activatePanel(panelNum) {
  if (panelNum === currentActive) return;
  currentActive = panelNum;

  // Update window panels
  winPanels.forEach(wp => {
    const id = wp.id.replace('panel-', '');
    if (id === panelNum) {
      wp.classList.remove('exit-up');
      wp.classList.add('active');
    } else {
      if (wp.classList.contains('active')) {
        wp.classList.remove('active');
        wp.classList.add('exit-up');
        setTimeout(() => wp.classList.remove('exit-up'), 500);
      }
    }
  });

  // Update dots
  winDots.forEach(d => {
    d.classList.toggle('active', d.dataset.panel === panelNum);
  });

  // Update title
  if (windowTitle && panelTitles[panelNum]) {
    windowTitle.style.opacity = '0';
    setTimeout(() => {
      windowTitle.textContent = panelTitles[panelNum];
      windowTitle.style.opacity = '1';
    }, 200);
  }
}

// IntersectionObserver: watch each scroll panel
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const num = entry.target.dataset.panel;
      activatePanel(num);
      entry.target.classList.add('in-view');
    } else {
      entry.target.classList.remove('in-view');
    }
  });
}, {
  rootMargin: '-35% 0px -35% 0px', // trigger when panel is in middle 30% of viewport
  threshold: 0,
});

panels.forEach(p => io.observe(p));

// Manual dot clicks
winDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const num = dot.dataset.panel;
    activatePanel(num);
    // Scroll to corresponding scroll-panel
    const target = document.querySelector(`.scroll-panel[data-panel="${num}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

/* ═══════════════════
   SCROLL REVEAL (general)
   ═══════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.about-card, .stat-block').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease, border-color 0.3s, box-shadow 0.3s';
  revealObserver.observe(el);
});

/* Hero stagger */
document.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll('.hero-trust-label, .hero-headline, .hero-sub, .hero-ctas, .trust-strip');
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 180 + i * 130);
  });
});

/* ═══════════════════
   SMOOTH NAV SCROLL
   ═══════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});
