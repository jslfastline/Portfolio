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

// ===== Learn More Modal =====
const learnMoreBtn = document.querySelector('.btn-hero-secondary');
const modal = document.getElementById('learn-more-modal');
const modalClose = document.getElementById('modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

function openModal() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Re-initialize lucide icons in modal
  lucide.createIcons();
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = 'auto';
}

learnMoreBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

// ===== Beta Signup Modal =====
// Note: Beta buttons now link to login.html instead of opening modal
// Keeping modal code for potential future use or removal

const betaModal = document.getElementById('beta-signup-modal');
const betaClose = document.getElementById('beta-close');
const betaForm = document.getElementById('beta-signup-form');
const betaOverlay = betaModal ? betaModal.querySelector('.modal-overlay') : null;

function closeBetaModal() {
  if (betaModal) {
    betaModal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

// Close beta modal on Escape key (if modal exists)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && betaModal && betaModal.classList.contains('open')) {
    closeBetaModal();
  }
});

// Event listeners for modal close (if elements exist)
if (betaClose) betaClose.addEventListener('click', closeBetaModal);
if (betaOverlay) betaOverlay.addEventListener('click', closeBetaModal);

// ===== Beta Form Auto-Complete & OTP System =====

// Auto-populate full name from individual fields
const updateFullName = () => {
  const firstName = document.getElementById('beta-first-name').value.trim();
  const middleInitial = document.getElementById('beta-middle-initial').value.trim();
  const lastName = document.getElementById('beta-last-name').value.trim();

  let fullName = '';

  if (firstName) {
    fullName += firstName;
  }

  if (middleInitial) {
    fullName += (fullName ? ' ' : '') + middleInitial.toUpperCase();
  }

  if (lastName) {
    fullName += (fullName ? ' ' : '') + lastName;
  }

  document.getElementById('beta-full-name').value = fullName;
};

// Add event listeners for name fields
document.getElementById('beta-first-name').addEventListener('input', updateFullName);
document.getElementById('beta-middle-initial').addEventListener('input', updateFullName);
document.getElementById('beta-last-name').addEventListener('input', updateFullName);

// OTP System
let currentOTP = null;
let emailVerified = false;

const sendOTP = async () => {
  const email = document.getElementById('beta-email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const statusDiv = document.getElementById('email-verification-status');
  const sendBtn = document.getElementById('send-otp-btn');

  // Clear previous status
  statusDiv.className = 'verification-status';
  statusDiv.textContent = '';

  // Validate email
  if (!email) {
    showError('email', 'Please enter your email address');
    return;
  } else if (!emailRegex.test(email)) {
    showError('email', 'Please enter a valid email address');
    return;
  }

  // Clear email error
  showError('email', '');

  // Show loading state
  const originalText = sendBtn.innerHTML;
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<i data-lucide="loader"></i><span>Sending...</span>';
  lucide.createIcons();

  // Generate OTP (6-digit)
  currentOTP = Math.floor(100000 + Math.random() * 900000).toString();

  // Simulate API call to send OTP
  setTimeout(() => {
    // In production, this would send the OTP to the email
    console.log(`OTP for ${email}: ${currentOTP}`); // For demo purposes

    // Show success message
    statusDiv.className = 'verification-status success';
    statusDiv.textContent = 'OTP sent to your email! Check your inbox.';

    // Show OTP section
    document.getElementById('otp-section').style.display = 'block';

    // Reset button
    sendBtn.disabled = false;
    sendBtn.innerHTML = originalText;

    // Focus on OTP input
    document.getElementById('beta-otp').focus();
  }, 2000);
};

const verifyOTP = () => {
  const enteredOTP = document.getElementById('beta-otp').value.trim();
  const statusDiv = document.getElementById('otp-status');
  const verifyBtn = document.getElementById('verify-otp-btn');

  // Clear previous status
  statusDiv.className = 'verification-status';
  statusDiv.textContent = '';

  if (!enteredOTP) {
    showError('otp', 'Please enter the OTP');
    return;
  }

  if (enteredOTP.length !== 6) {
    showError('otp', 'OTP must be 6 digits');
    return;
  }

  // Show loading state
  const originalText = verifyBtn.innerHTML;
  verifyBtn.disabled = true;
  verifyBtn.innerHTML = '<i data-lucide="loader"></i><span>Verifying...</span>';
  lucide.createIcons();

  // Simulate verification
  setTimeout(() => {
    if (enteredOTP === currentOTP) {
      // OTP verified successfully
      emailVerified = true;
      statusDiv.className = 'verification-status success';
      statusDiv.textContent = 'Email verified successfully! You can now complete your registration.';

      // Hide OTP section and show submit button
      document.getElementById('otp-section').style.display = 'none';
      document.querySelector('.btn-submit').style.display = 'flex';

      // Clear OTP error
      showError('otp', '');
    } else {
      // Invalid OTP
      showError('otp', 'Invalid OTP. Please try again.');
      statusDiv.className = 'verification-status error';
      statusDiv.textContent = 'Verification failed. Please check your OTP.';
    }

    // Reset button
    verifyBtn.disabled = false;
    verifyBtn.innerHTML = originalText;
  }, 1500);
};

// Event listeners for OTP buttons
document.getElementById('send-otp-btn').addEventListener('click', sendOTP);
document.getElementById('verify-otp-btn').addEventListener('click', verifyOTP);

// Allow only numbers in OTP field
document.getElementById('beta-otp').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// ===== Beta Form Validation & Submission =====
const validateForm = () => {
  let isValid = true;

  // Clear all previous error messages
  document.querySelectorAll('.form-error').forEach(error => {
    error.textContent = '';
  });

  // Validate First Name
  const firstName = document.getElementById('beta-first-name').value.trim();
  if (!firstName) {
    showError('firstName', 'Please enter your first name');
    isValid = false;
  } else if (firstName.length < 2) {
    showError('firstName', 'First name must be at least 2 characters');
    isValid = false;
  }

  // Validate Last Name
  const lastName = document.getElementById('beta-last-name').value.trim();
  if (!lastName) {
    showError('lastName', 'Please enter your last name');
    isValid = false;
  } else if (lastName.length < 2) {
    showError('lastName', 'Last name must be at least 2 characters');
    isValid = false;
  }

  // Validate Middle Initial (optional, but if provided, should be single character)
  const middleInitial = document.getElementById('beta-middle-initial').value.trim();
  if (middleInitial && middleInitial.length > 1) {
    showError('middleInitial', 'Middle initial should be a single character');
    isValid = false;
  }

  // Validate Email
  const email = document.getElementById('beta-email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError('email', 'Please enter your email address');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }

  // Check if email is verified
  if (!emailVerified) {
    showError('email', 'Please verify your email address first');
    isValid = false;
  }

  // Validate Phone (optional but if provided, should be valid format)
  const phone = document.getElementById('beta-phone').value.trim();
  if (phone && phone.length < 7) {
    showError('phone', 'Please enter a valid phone number');
    isValid = false;
  }

  // Validate at least one interest selected
  const interests = document.querySelectorAll('input[name="interests"]:checked');
  if (interests.length === 0) {
    showError('interests', 'Please select at least one feature you\'re interested in');
    isValid = false;
  }

  // Validate consent checkbox
  const consent = document.getElementById('beta-consent').checked;
  if (!consent) {
    showError('consent', 'Please agree to receive updates');
    isValid = false;
  }

  return isValid;
};

const showError = (fieldName, message) => {
  const errorElement = document.querySelector(`[data-error="${fieldName}"]`);
  if (errorElement) {
    errorElement.textContent = message;
  }
};

betaForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate form
  if (!validateForm()) {
    return;
  }

  // Show loading state
  const submitBtn = betaForm.querySelector('.btn-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i data-lucide="loader"></i><span>Joining...</span>';
  lucide.createIcons();

  // Collect form data
  const formData = {
    firstName: document.getElementById('beta-first-name').value.trim(),
    middleInitial: document.getElementById('beta-middle-initial').value.trim(),
    lastName: document.getElementById('beta-last-name').value.trim(),
    fullName: document.getElementById('beta-full-name').value.trim(),
    email: document.getElementById('beta-email').value.trim(),
    phone: document.getElementById('beta-phone').value.trim(),
    interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
    message: document.getElementById('beta-message').value.trim(),
    timestamp: new Date().toISOString(),
    verified: true
  };

  // Simulate API call (in production, you would send this to a backend)
  setTimeout(() => {
    // Here you could send the data to a backend API
    // Example: fetch('/api/beta-signup', { method: 'POST', body: JSON.stringify(formData) })

    // For demo purposes, we'll store in localStorage
    const existingSignups = JSON.parse(localStorage.getItem('betaSignups') || '[]');
    existingSignups.push(formData);
    localStorage.setItem('betaSignups', JSON.stringify(existingSignups));

    // Show success message
    showSuccessMessage();

    // Reset form and state
    betaForm.reset();
    emailVerified = false;
    currentOTP = null;
    document.getElementById('otp-section').style.display = 'none';
    document.querySelector('.btn-submit').style.display = 'none';
    document.getElementById('email-verification-status').className = 'verification-status';
    document.getElementById('email-verification-status').textContent = '';
    document.getElementById('otp-status').className = 'verification-status';
    document.getElementById('otp-status').textContent = '';

    // Reset button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    // Close modal after 3 seconds
    setTimeout(() => {
      closeBetaModal();
    }, 3000);
  }, 1500);
});

const showSuccessMessage = () => {
  const successMsg = document.getElementById('beta-success');
  const errorMsg = document.getElementById('beta-error');

  errorMsg.style.display = 'none';
  successMsg.style.display = 'flex';
  lucide.createIcons();
};

const showErrorMessage = (message = 'An error occurred. Please try again.') => {
  const errorMsg = document.getElementById('beta-error');
  const errorText = document.getElementById('beta-error-text');
  const successMsg = document.getElementById('beta-success');

  successMsg.style.display = 'none';
  errorText.textContent = message;
  errorMsg.style.display = 'flex';
  lucide.createIcons();
};

// ===== FAQ Toggle Functionality =====
document.querySelectorAll('.faq-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const faqItem = toggle.closest('.faq-item');
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

    // Simulate form submission (replace with actual API call)
    console.log('Form submitted:', data);

    // Show success message
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');

    // Reset form
    contactForm.reset();
  });
}

// ===== Position Application Buttons =====
document.querySelectorAll('.position-apply').forEach(button => {
  button.addEventListener('click', () => {
    const positionTitle = button.closest('.position-card').querySelector('h3').textContent;
    alert(`Application process for "${positionTitle}" will be available soon. Check back later or contact us at careers@jslfastline.com`);
  });
});
