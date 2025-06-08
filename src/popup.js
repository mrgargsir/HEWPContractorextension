// Fetch latest version from GitHub releases
document.addEventListener('DOMContentLoaded', () => {
  let latestZipUrl = ''; // Store ZIP download URL

  // Fetch latest release once
  fetch('https://api.github.com/repos/mrgargsir/HEWPContractorextension/releases/latest')
    .then(response => response.json())
    .then(data => {
      const version = data.tag_name;
      const versionEl = document.getElementById('versionext');
      const downloadEl = document.getElementById('downloadext');

      if (versionEl) versionEl.textContent = `Chrome Extension Latest Version: ${version}`;

      const zipAsset = data.assets.find(asset =>
        asset.name.endsWith('.zip')
      );

      if (zipAsset) {
        latestZipUrl = zipAsset.browser_download_url;
        if (downloadEl) {
          downloadEl.innerHTML = `<a href="${latestZipUrl}" target="_blank">Download Extension ZIP</a>`;
        }
      } else {
        if (downloadEl) downloadEl.textContent = 'ZIP not found in release assets.';
      }
    })
    .catch(error => {
      console.error('Error fetching release info:', error);
      const versionEl = document.getElementById('versionext');
      const downloadEl = document.getElementById('downloadext');
      if (versionEl) versionEl.textContent = 'Failed to fetch version.';
      if (downloadEl) downloadEl.textContent = '';
    });

  // Button to trigger download
  const downloadBtn = document.getElementById('openNewTabBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (latestZipUrl) {
        const a = document.createElement('a');
        a.href = latestZipUrl;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setStatus('Downloading extension ZIP...');
      } else {
        setStatus('Download link not ready. Try again shortly.');
      }
    });
  }

  // Status helper
  function setStatus(text) {
    const status = document.getElementById('statusext');
    if (status) {
      status.textContent = text;
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    }
  }
});


document.addEventListener('DOMContentLoaded', () => {
  let excelZipUrl = '';

  // Fetch latest Excel Add-in release info
  fetch('https://api.github.com/repos/mrgargsir/HEWPExcelADDins/releases/latest')
    .then(response => response.json())
    .then(data => {
      const version = data.tag_name;
      const versionEl = document.getElementById('excelversion');
      const downloadEl = document.getElementById('exceldownloadext');

      if (versionEl) versionEl.textContent = `Excel Full Utility Latest Version: ${version}`;

      const zipAsset = data.assets.find(asset => asset.name.endsWith('.zip'));

      if (zipAsset) {
        excelZipUrl = zipAsset.browser_download_url;
        if (downloadEl) {
          downloadEl.innerHTML = `<a href="${excelZipUrl}" target="_blank">Download Add-in ZIP</a>`;
        }
      } else {
        if (downloadEl) downloadEl.textContent = 'ZIP not found in release assets.';
      }
    })
    .catch(error => {
      console.error('Error fetching Excel Add-in release info:', error);
      const versionEl = document.getElementById('excelversion');
      const downloadEl = document.getElementById('exceldownloadext');
      if (versionEl) versionEl.textContent = 'Failed to fetch version.';
      if (downloadEl) downloadEl.textContent = '';
    });

  // Excel button downloads the ZIP
  const excelBtn = document.getElementById('Excel');
  if (excelBtn) {
    excelBtn.addEventListener('click', () => {
      if (excelZipUrl) {
        const a = document.createElement('a');
        a.href = excelZipUrl;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setStatus('Downloading Excel Add-in ZIP...');
      } else {
        setStatus('Download link not ready. Try again shortly.');
      }
    });
  }

  // Status helper
  function setStatus(text) {
    const status = document.getElementById('statusexl');
    if (status) {
      status.textContent = text;
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    }
  }
});







document.getElementById('reloadBtn').addEventListener('click', () => {
  chrome.runtime.reload();
  setStatus('Extension reloaded');
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
