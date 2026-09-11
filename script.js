// ===== Initialize Lucide Icons =====
if (window.lucide) {
  lucide.createIcons();
}

// ===== Theme Toggle =====
const htmlRoot = document.getElementById('html-root');
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

function applyTheme(isDark) {
  if (isDark) {
    body.classList.add('dark');
    htmlRoot.classList.add('dark');
  } else {
    body.classList.remove('dark');
    htmlRoot.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = body.classList.contains('dark');
  applyTheme(!isDark);
  localStorage.setItem('theme', !isDark ? 'dark' : 'light');
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

// Load saved theme (default: dark)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  applyTheme(false);
} else {
  applyTheme(true); // default dark
}

// ===== Mobile Menu =====
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

// ===== Modal Functions =====
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Modal close handlers
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      hideModal(modalId);
    });
  });

  // Close modal when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal(modal.id);
      }
    });
  });
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

function updateMobileNavbarVisibility() {
  if (!navbar) return;
  const isMobileView = window.innerWidth <= 768;
  const menuOpen = mobileMenu && mobileMenu.classList.contains('open');

  if (!isMobileView || menuOpen) {
    navbar.classList.remove('nav-hidden-mobile');
    lastScrollY = window.scrollY;
    return;
  }

  const currentScrollY = window.scrollY;

  if (currentScrollY <= 20) {
    navbar.classList.add('nav-hidden-mobile');
  } else if (currentScrollY > lastScrollY) {
    navbar.classList.add('nav-hidden-mobile');
  } else {
    navbar.classList.remove('nav-hidden-mobile');
  }

  lastScrollY = Math.max(currentScrollY, 0);
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateMobileNavbarVisibility();
});

window.addEventListener('resize', updateMobileNavbarVisibility);
window.addEventListener('load', updateMobileNavbarVisibility);

// ===== Reveal on Scroll =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ===== Counter Animation =====
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target)) return;

      let current = 0;
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        el.textContent = current + '+';
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + '+';
        }
      };

      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

// ===== FAQ Toggle Functionality =====
document.querySelectorAll('.faq-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const faqItem = toggle.closest('.faq-item');
    if (!faqItem) return;
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// ===== Contact Form Handling =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !data[field]?.trim());

    if (missingFields.length > 0) {
      alert('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Compose mailto link so messages land directly in the CEO's inbox
    const subject = encodeURIComponent(data.subject);
    const mailBody = encodeURIComponent(
      `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nCompany: ${data.company || '-'}\n\nMessage:\n${data.message}`
    );
    window.location.href = `mailto:jslfastline58@gmail.com?subject=${subject}&body=${mailBody}`;

    alert('Opening your email app — your message goes straight to the CEO!');
  });
}

// ===== Position Application Buttons =====
document.querySelectorAll('.position-apply').forEach(button => {
  button.addEventListener('click', () => {
    const positionTitle = button.closest('.position-card')?.querySelector('h3')?.textContent;
    const msg = positionTitle
      ? `Application for "${positionTitle}"`
      : 'Career inquiry';
    window.location.href = `mailto:jslfastline58@gmail.com?subject=${encodeURIComponent(msg)}`;
  });
});