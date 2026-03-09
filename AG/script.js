/* ─── VAHAARA script.js ─── */

/* ══════════════
   THEME TOGGLE
   ══════════════ */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('vahaara-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('vahaara-theme', next);
});

/* ══════════════
   NAVBAR SCROLL
   ══════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.boxShadow = '0 2px 24px rgba(0,0,0,0.3)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

/* ══════════════
   MOBILE MENU
   ══════════════ */
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

// Close mobile menu on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMobileMenu();
});

/* ══════════════
   MODALS
   ══════════════ */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Focus first input after animation
  setTimeout(() => {
    const firstInput = modal.querySelector('input, textarea');
    if (firstInput) firstInput.focus();
  }, 300);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(modal => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

/* ══════════════
   TOAST
   ══════════════ */
function showToast(message, duration = 3500) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ══════════════
   FORM HANDLERS
   ══════════════ */
function handleConversationSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  // Loading state
  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Simulate async send
  setTimeout(() => {
    btn.textContent = '✓ Sent!';
    btn.style.opacity = '1';

    setTimeout(() => {
      closeModal('conversationModal');
      e.target.reset();
      btn.textContent = originalText;
      btn.disabled = false;
      showToast('🎉 Message received! We\'ll be in touch soon.');
    }, 800);
  }, 1200);
}

function handleEarlyAccessSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  btn.textContent = 'Processing...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.textContent = '✓ Access Requested!';
    btn.style.opacity = '1';

    setTimeout(() => {
      closeModal('earlyAccessModal');
      e.target.reset();
      btn.textContent = originalText;
      btn.disabled = false;
      showToast('🚀 You\'re on the early access list!');
    }, 800);
  }, 1200);
}

/* ══════════════
   SCROLL REVEAL
   ══════════════ */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-delay') || 0;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply reveal to service & about cards on load
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.service-card, .about-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s';
    observer.observe(card);
  });

  // Hero elements stagger in
  const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-sub, .hero-actions, .hero-stats');
  heroElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 150 + i * 120);
  });
});

/* ══════════════
   SMOOTH NAV LINKS
   ══════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
