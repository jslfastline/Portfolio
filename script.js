// ===== Initialize Lucide Icons =====
lucide.createIcons();

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

themeToggle.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);

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

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

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
