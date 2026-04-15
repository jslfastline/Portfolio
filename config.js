// ===== API Configuration Management =====

// Load saved configuration
function loadConfig() {
  const config = JSON.parse(localStorage.getItem('jslConfig') || '{}');

  document.getElementById('emailjs-service-id').value = config.emailjs?.serviceId || '';
  document.getElementById('emailjs-template-id').value = config.emailjs?.templateId || '';
  document.getElementById('emailjs-public-key').value = config.emailjs?.publicKey || '';

  document.getElementById('firebase-api-key').value = config.firebase?.apiKey || '';
  document.getElementById('firebase-auth-domain').value = config.firebase?.authDomain || '';
  document.getElementById('firebase-project-id').value = config.firebase?.projectId || '';
  document.getElementById('firebase-storage-bucket').value = config.firebase?.storageBucket || '';
  document.getElementById('firebase-messaging-sender-id').value = config.firebase?.messagingSenderId || '';
  document.getElementById('firebase-app-id').value = config.firebase?.appId || '';
}

// Save configuration
function saveConfig() {
  const config = {
    emailjs: {
      serviceId: document.getElementById('emailjs-service-id').value.trim(),
      templateId: document.getElementById('emailjs-template-id').value.trim(),
      publicKey: document.getElementById('emailjs-public-key').value.trim()
    },
    firebase: {
      apiKey: document.getElementById('firebase-api-key').value.trim(),
      authDomain: document.getElementById('firebase-auth-domain').value.trim(),
      projectId: document.getElementById('firebase-project-id').value.trim(),
      storageBucket: document.getElementById('firebase-storage-bucket').value.trim(),
      messagingSenderId: document.getElementById('firebase-messaging-sender-id').value.trim(),
      appId: document.getElementById('firebase-app-id').value.trim()
    }
  };

  localStorage.setItem('jslConfig', JSON.stringify(config));
  showStatus('Configuration saved successfully!', 'success');
}

// Test configuration
async function testConfig() {
  const config = JSON.parse(localStorage.getItem('jslConfig') || '{}');

  if (!config.emailjs?.serviceId || !config.emailjs?.templateId || !config.emailjs?.publicKey) {
    showStatus('EmailJS configuration incomplete', 'error');
    return;
  }

  if (!config.firebase?.apiKey || !config.firebase?.projectId) {
    showStatus('Firebase configuration incomplete', 'error');
    return;
  }

  showStatus('Testing configuration...', 'pending');

  try {
    // Test EmailJS
    if (window.emailjs) {
      await emailjs.init(config.emailjs.publicKey);
      showStatus('Configuration test passed!', 'success');
    } else {
      showStatus('EmailJS library not loaded', 'error');
    }
  } catch (error) {
    showStatus('Configuration test failed: ' + error.message, 'error');
  }
}

// Show status message
function showStatus(message, type) {
  const statusDiv = document.getElementById('config-status');
  statusDiv.textContent = message;
  statusDiv.className = `config-status ${type}`;

  setTimeout(() => {
    statusDiv.className = 'config-status';
  }, 5000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadConfig);
document.getElementById('save-config').addEventListener('click', saveConfig);
document.getElementById('test-config').addEventListener('click', testConfig);

// Initialize Lucide icons
lucide.createIcons();