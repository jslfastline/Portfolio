// ===== AUTHENTICATION SYSTEM =====
// Handles signup, login, OTP verification, and Firebase integration

// ===== CONFIGURATION =====
let firebaseConfig = null;
let emailjsConfig = null;

// Load configurations on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadConfigurations();
    initializeFirebase();
    initializeEmailJS();
    initializeAuthForms();
    initializeTheme();
    initializeNavigation();
  });
} else {
  // DOM already loaded
  loadConfigurations();
  initializeFirebase();
  initializeEmailJS();
  initializeAuthForms();
  initializeTheme();
  initializeNavigation();
}

// ===== CONFIGURATION MANAGEMENT =====
function loadConfigurations() {
  const savedConfig = localStorage.getItem('jslConfig');
  if (savedConfig) {
    const config = JSON.parse(savedConfig);
    firebaseConfig = config.firebase;
    emailjsConfig = config.emailjs;

    // Set EmailJS globals
    if (config.emailjs) {
      window.EMAILJS_PUBLIC_KEY = config.emailjs.publicKey;
      window.EMAILJS_SERVICE_ID = config.emailjs.serviceId;
      window.EMAILJS_TEMPLATE_ID = config.emailjs.templateId;
    }
  }
}

function initializeFirebase() {
  if (window.firebaseAuth && window.firebaseDb) {
    console.log('Firebase already initialized');
  } else if (firebaseConfig) {
    try {
      firebase.initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Firebase initialization failed:', error);
    }
  } else {
    console.warn('Firebase configuration not found. Please configure firebaseConfig.js');
  }
}

function initializeEmailJS() {
  if (window.EMAILJS_PUBLIC_KEY) {
    try {
      emailjs.init(window.EMAILJS_PUBLIC_KEY);
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('EmailJS initialization failed:', error);
    }
  } else {
    console.warn('EmailJS public key not found. Please set window.EMAILJS_PUBLIC_KEY');
  }
}

// ===== FORM INITIALIZATION =====
function initializeAuthForms() {
  // Signup form
  if (document.getElementById('signup-form')) {
    initializeSignupForm();
  }

  // Login form
  if (document.getElementById('login-form')) {
    initializeLoginForm();
  }

  // Forgot password
  if (document.getElementById('forgot-password-link')) {
    document.getElementById('forgot-password-link').addEventListener('click', function(e) {
      e.preventDefault();
      showModal('forgot-password-modal');
    });
  }

  if (document.getElementById('forgot-password-form')) {
    document.getElementById('forgot-password-form').addEventListener('submit', handleForgotPassword);
  }

  // Add scroll listener for navbar
  initializeScrollNavbar();
}

// ===== SCROLL NAVBAR =====
function initializeScrollNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ===== SIGNUP FORM LOGIC =====
function initializeSignupForm() {
  const form = document.getElementById('signup-form');

  // Name field auto-generation
  const firstNameInput = document.getElementById('signup-first-name');
  const middleInitialInput = document.getElementById('signup-middle-initial');
  const lastNameInput = document.getElementById('signup-last-name');
  const fullNameInput = document.getElementById('signup-full-name');

  function updateFullName() {
    const first = firstNameInput.value.trim();
    const middle = middleInitialInput.value.trim();
    const last = lastNameInput.value.trim();

    let fullName = first;
    if (middle) fullName += ' ' + middle + '.';
    if (last) fullName += ' ' + last;

    fullNameInput.value = fullName;
  }

  if (firstNameInput) {
    firstNameInput.addEventListener('input', updateFullName);
    firstNameInput.addEventListener('blur', updateFullName);
  }
  if (middleInitialInput) {
    middleInitialInput.addEventListener('input', updateFullName);
    middleInitialInput.addEventListener('blur', updateFullName);
  }
  if (lastNameInput) {
    lastNameInput.addEventListener('input', updateFullName);
    lastNameInput.addEventListener('blur', updateFullName);
  }

  // OTP functionality
  const sendOtpBtn = document.getElementById('send-otp-signup');
  const verifyOtpBtn = document.getElementById('verify-otp-signup');

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => sendOTP('signup'));
  }
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => verifyOTP('signup'));
  }

  // Form submission
  form.addEventListener('submit', handleSignup);
}

async function sendOTP(formType) {
  const emailInput = document.getElementById(`${formType}-email`);
  const email = emailInput.value.trim();

  if (!email) {
    showError(`${formType}-email`, 'Please enter your email address');
    return;
  }

  if (!isValidEmail(email)) {
    showError(`${formType}-email`, 'Please enter a valid email address');
    return;
  }

  // Generate OTP
  const otp = generateOTP();
  sessionStorage.setItem(`${formType}_otp`, otp);
  sessionStorage.setItem(`${formType}_otp_email`, email);
  sessionStorage.setItem(`${formType}_otp_timestamp`, Date.now());

  // Show OTP section
  document.getElementById(`otp-section-${formType}`).style.display = 'block';
  document.getElementById(`${formType}-otp`).focus();

  // Update button state
  const sendBtn = document.getElementById(`send-otp-${formType}`);
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<span>Sending...</span><i data-lucide="loader"></i>';

  try {
    // Send OTP via EmailJS
    if (window.EMAILJS_SERVICE_ID && window.EMAILJS_TEMPLATE_ID) {
      const templateParams = {
        to_email: email,
        otp_code: otp,
        subject: 'JSL FastLine - Email Verification Code'
      };

      await emailjs.send(
        window.EMAILJS_SERVICE_ID,
        window.EMAILJS_TEMPLATE_ID,
        templateParams
      );

      showVerificationStatus(`${formType}`, 'OTP sent successfully! Check your email.', 'success');
    } else {
      // Fallback: show OTP in console for testing
      console.log(`OTP for ${email}: ${otp}`);
      showVerificationStatus(`${formType}`, 'OTP generated! Check console for testing.', 'success');
    }

    sendBtn.innerHTML = '<span>Resend OTP</span><i data-lucide="mail"></i>';
  } catch (error) {
    console.error('Error sending OTP:', error);
    showVerificationStatus(`${formType}`, 'Failed to send OTP. Please try again.', 'error');
    sendBtn.innerHTML = '<span>Send OTP</span><i data-lucide="mail"></i>';
  } finally {
    sendBtn.disabled = false;
    lucide.createIcons();
  }
}

function verifyOTP(formType) {
  const otpInput = document.getElementById(`${formType}-otp`);
  const enteredOTP = otpInput.value.trim();
  const storedOTP = sessionStorage.getItem(`${formType}_otp`);
  const storedEmail = sessionStorage.getItem(`${formType}_otp_email`);
  const timestamp = sessionStorage.getItem(`${formType}_otp_timestamp`);

  if (!enteredOTP) {
    showError(`${formType}-otp`, 'Please enter the OTP');
    return;
  }

  if (!storedOTP || !timestamp) {
    showVerificationStatus(`${formType}`, 'Please request a new OTP first.', 'error');
    return;
  }

  // Check if OTP is expired (10 minutes)
  if (Date.now() - parseInt(timestamp) > 10 * 60 * 1000) {
    showVerificationStatus(`${formType}`, 'OTP has expired. Please request a new one.', 'error');
    return;
  }

  if (enteredOTP === storedOTP) {
    // OTP verified successfully
    sessionStorage.setItem(`${formType}_email_verified`, 'true');
    showVerificationStatus(`${formType}`, 'Email verified successfully!', 'success');

    // Show submit button
    document.getElementById('signup-submit-btn').style.display = 'block';

    // Disable OTP inputs
    otpInput.disabled = true;
    document.getElementById(`verify-otp-${formType}`).disabled = true;
  } else {
    showError(`${formType}-otp`, 'Invalid OTP. Please try again.');
  }
}

async function handleSignup(e) {
  e.preventDefault();

  const form = document.getElementById('signup-form');
  const formData = new FormData(form);

  // Validate form
  if (!validateSignupForm()) {
    return;
  }

  // Check email verification
  const savedOtpState = sessionStorage.getItem('fastline_signup_otp');
  let isEmailVerified = false;
  
  if (savedOtpState) {
    try {
      const state = JSON.parse(savedOtpState);
      isEmailVerified = state.verified && Date.now() < state.expiry;
    } catch (e) {
      console.error("Error checking OTP state:", e);
    }
  }

  if (!isEmailVerified) {
    showError('signup-email', 'Please verify your email first');
    return;
  }

  // Show loading state
  const submitBtn = document.getElementById('signup-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Creating Account...</span><i data-lucide="loader"></i>';

  try {
    const userData = {
      firstName: formData.get('firstName'),
      middleInitial: formData.get('middleInitial'),
      lastName: formData.get('lastName'),
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      createdAt: new Date().toISOString(),
      emailVerified: true
    };

    // Create user in Firebase Auth
    const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(
      userData.email,
      formData.get('password')
    );

    // Store additional user data in Firestore
    await window.firebaseDb.collection('users').doc(userCredential.user.uid).set(userData);

    // Success
    document.getElementById('signup-success').style.display = 'flex';
    document.getElementById('signup-error').style.display = 'none';

    // Clear form and session data
    form.reset();
    sessionStorage.removeItem('fastline_signup_otp');
    sessionStorage.removeItem('signup_email_verified');

    // Save user session
    localStorage.setItem('fastline_session_email', userData.email);
    localStorage.setItem('fastline_session_expiry', Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Redirect to JSL FastLine App
    setTimeout(() => {
      window.location.href = 'index.html?welcome=true&user=' + encodeURIComponent(userData.fullName);
    }, 2000);

  } catch (error) {
    console.error('Signup error:', error);
    document.getElementById('signup-error').style.display = 'flex';
    document.getElementById('signup-error-text').textContent = getFirebaseErrorMessage(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Create Account</span><i data-lucide="user-plus"></i>';
    lucide.createIcons();
  }
}

function validateSignupForm() {
  let isValid = true;

  // Name validation
  const firstName = document.getElementById('signup-first-name').value.trim();
  const lastName = document.getElementById('signup-last-name').value.trim();

  if (!firstName) {
    showError('signup-first-name', 'First name is required');
    isValid = false;
  }

  if (!lastName) {
    showError('signup-last-name', 'Last name is required');
    isValid = false;
  }

  // Email validation
  const email = document.getElementById('signup-email').value.trim();
  if (!email || !isValidEmail(email)) {
    showError('signup-email', 'Please enter a valid email address');
    isValid = false;
  }

  // Password validation
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;

  if (!password || password.length < 6) {
    showError('signup-password', 'Password must be at least 6 characters');
    isValid = false;
  }

  if (password !== confirmPassword) {
    showError('signup-confirm-password', 'Passwords do not match');
    isValid = false;
  }

  // Terms validation
  const terms = document.getElementById('signup-terms').checked;
  if (!terms) {
    showError('signup-terms', 'You must agree to the terms and privacy policy');
    isValid = false;
  }

  return isValid;
}

// ===== LOGIN FORM LOGIC =====
function initializeLoginForm() {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();

  const form = document.getElementById('login-form');
  const formData = new FormData(form);

  // Show loading state
  const submitBtn = form.querySelector('.btn-submit');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Logging In...</span><i data-lucide="loader"></i>';

  try {
    const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(
      formData.get('email'),
      formData.get('password')
    );

    // Success
    document.getElementById('login-success').style.display = 'flex';
    document.getElementById('login-error').style.display = 'none';

    // Store remember me preference
    if (formData.get('remember')) {
      localStorage.setItem('jsl_remember_login', 'true');
    }

    // Redirect after success
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);

  } catch (error) {
    console.error('Login error:', error);
    document.getElementById('login-error').style.display = 'flex';
    document.getElementById('login-error-text').textContent = getFirebaseErrorMessage(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Log In</span><i data-lucide="log-in"></i>';
    lucide.createIcons();
  }
}

// ===== FORGOT PASSWORD =====
async function handleForgotPassword(e) {
  e.preventDefault();

  const email = document.getElementById('reset-email').value.trim();

  if (!email || !isValidEmail(email)) {
    showError('reset-email', 'Please enter a valid email address');
    return;
  }

  try {
    await window.firebaseAuth.sendPasswordResetEmail(email);

    document.getElementById('reset-success').style.display = 'flex';
    document.getElementById('reset-error').style.display = 'none';

  } catch (error) {
    console.error('Password reset error:', error);
    document.getElementById('reset-error').style.display = 'flex';
    document.getElementById('reset-error-text').textContent = getFirebaseErrorMessage(error);
  }
}

// ===== UTILITY FUNCTIONS =====
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(fieldId, message) {
  const errorElement = document.querySelector(`[data-error="${fieldId.replace(/^(signup|login)-/, '')}"]`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

function showVerificationStatus(formType, message, type) {
  const statusElement = document.getElementById(`${formType === 'signup' ? 'email' : 'otp'}-verification-status-${formType}`);
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = `verification-status ${type}`;
    statusElement.style.display = 'block';
  }
}

function getFirebaseErrorMessage(error) {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}

// ===== THEME AND NAVIGATION =====
function initializeTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const body = document.body;
  const html = document.getElementById('html-root');

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark like main script
  const isDark = savedTheme === 'dark';
  applyTheme(isDark);

  // Theme toggle handlers
  [themeToggle, themeToggleMobile].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const currentlyDark = body.classList.contains('dark');
        applyTheme(!currentlyDark);
        localStorage.setItem('theme', !currentlyDark ? 'dark' : 'light');
      });
    }
  });
}

function applyTheme(isDark) {
  const body = document.body;
  const html = document.getElementById('html-root');

  if (isDark) {
    body.classList.add('dark');
    html.classList.add('dark');
  } else {
    body.classList.remove('dark');
    html.classList.remove('dark');
  }
  updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
  const sunIcons = document.querySelectorAll('.icon-sun');
  const moonIcons = document.querySelectorAll('.icon-moon');

  if (isDark) {
    sunIcons.forEach(icon => icon.style.display = 'none');
    moonIcons.forEach(icon => icon.style.display = 'block');
  } else {
    sunIcons.forEach(icon => icon.style.display = 'block');
    moonIcons.forEach(icon => icon.style.display = 'none');
  }
}

function initializeNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('active');
      }
    });
  }

  // Modal close handlers
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
}

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

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});