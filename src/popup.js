document.getElementById('reloadBtn').addEventListener('click', () => {
  chrome.runtime.reload();
  setStatus('Extension reloaded');
});

document.getElementById('openNewTabBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://github.com/mrgargsir/HEWPContractorextension/releases' });
  setStatus('CHECK THE RELEASES PAGE FOR UPDATES');
});

document.getElementById('Excel').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://github.com/mrgargsir/HEWPExcelADDins/releases' });
  setStatus('XLS ADDIN RELEASES PAGE OPENED');
});

document.getElementById('hsrBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://github.com/mrgargsir/HEWPExcelADDins/raw/refs/heads/main/OtherFiles/HSR.xlsx' });
  setStatus('HSR FILE OPENED');
});

document.getElementById('donateBtn').addEventListener('click', () => {
  const qr = document.getElementById('qrSection');
  if (qr.classList.contains('visible')) {
    qr.classList.remove('visible');
    setTimeout(() => (qr.style.display = 'none'), 300);
  } else {
    qr.style.display = 'block';
    setTimeout(() => qr.classList.add('visible'), 10);
  }
});

document.getElementById('requestFeatureBtn').addEventListener('click', () => {
  jumpButtonTwice('requestFeatureBtn', () => {
    const subject = encodeURIComponent('Feature Request for HEWP Extension');
    const body = encodeURIComponent(
      'Hi,\n\nI would like to request the following feature:\n\n[Please describe your feature here]\n\nThanks!'
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=mrgargsir@gmail.com&su=${subject}&body=${body}`;

    chrome.tabs.create({ url: gmailUrl });
  });
});

document.getElementById('copyUPI').addEventListener('click', () => {
  navigator.clipboard.writeText('mrgargsir@ybl');
  setStatus('UPI copied!');
});

// Dark mode toggle with slider style
const toggle = document.getElementById('darkModeToggle');
const body = document.body;

// Initialize theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.replace('light', 'dark');
  toggle.checked = true;
} else {
  body.classList.replace('dark', 'light');
  toggle.checked = false;
}

toggle.addEventListener('change', () => {
  if (toggle.checked) {
    body.classList.replace('light', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.replace('dark', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// Helper to show status text briefly
function setStatus(text) {
  const status = document.getElementById('status');
  status.textContent = text;
  setTimeout(() => {
    status.textContent = '';
  }, 2000);
}

// Function to make the button jump around twice before executing callback
function jumpButtonTwice(buttonId, callback) {
  const btn = document.getElementById(buttonId);
  let jumpCount = 0;

  function jump() {
    const offsetX = Math.random() * 60 - 30;
    const offsetY = Math.random() * 30 - 15;

    btn.style.position = 'relative';
    btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    jumpCount++;

    if (jumpCount < 2) {
      setTimeout(() => {
        btn.style.transform = `translate(0, 0)`;
        setTimeout(jump, 150);
      }, 150);
    } else {
      btn.style.transform = `translate(0, 0)`;
      callback();
    }
  }

  jump();
}
