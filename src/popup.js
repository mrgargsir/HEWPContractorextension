document.addEventListener('DOMContentLoaded', () => {
  // Fetch latest version from GitHub releases
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

  // Fetch latest Excel Add-in release info
  let excelZipUrl = '';

  // Fetch latest release once
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

  // All DOM element event listeners go here:
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

  // Dark mode toggle with slider style (original format preserved)
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Initialize theme from chrome.storage.local
  chrome.storage.local.get(['theme'], (result) => {
    if (result.theme === 'dark') {
      body.classList.replace('light', 'dark');
      darkModeToggle.checked = true;
    } else {
      body.classList.replace('dark', 'light');
      darkModeToggle.checked = false;
    }
  });

  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      body.classList.replace('light', 'dark');
      chrome.storage.local.set({ theme: 'dark' });
    } else {
      body.classList.replace('dark', 'light');
      chrome.storage.local.set({ theme: 'light' });
    }
  });

  const volumeToggle = document.getElementById('volumeBoosterToggle');
  const sliderContainer = document.getElementById('volumeBoostSliderContainer');
  const slider = document.getElementById('volumeBoostSlider');
  const sliderValue = document.getElementById('volumeBoostValue');

  // Initialize volume booster state and slider
  chrome.storage.local.get(['volumeBoost', 'volumeBoostLevel'], (result) => {
    const enabled = !!result.volumeBoost;
    volumeToggle.checked = enabled;
    sliderContainer.style.display = enabled ? 'inline-block' : 'none';
    const level = typeof result.volumeBoostLevel === 'number' ? result.volumeBoostLevel : 100;
    slider.value = level;
    sliderValue.textContent = `${level}%`;
  });

  // Toggle logic
  volumeToggle.addEventListener('change', () => {
    const enabled = volumeToggle.checked;
    chrome.storage.local.set({ volumeBoost: enabled });
    sliderContainer.style.display = enabled ? 'inline-block' : 'none';
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          volumeBoost: enabled,
          volumeBoostLevel: enabled ? parseInt(slider.value, 10) : 100
        });
      }
    });
  });

  // Slider logic
  slider.addEventListener('input', () => {
    const level = parseInt(slider.value, 10);
    sliderValue.textContent = `${level}%`;
    chrome.storage.local.set({ volumeBoostLevel: level });
    if (volumeToggle.checked) {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { 
            volumeBoost: true,
            volumeBoostLevel: level
          });
        }
      });
    }
  });

  // Helper to show status text briefly
  function setStatus(text) {
    const status = document.getElementById('status');
    if (!status) return;
    status.textContent = text;
    status.classList.add('visible');
    clearTimeout(window._statusTimeout);
    window._statusTimeout = setTimeout(() => {
      status.classList.remove('visible');
      setTimeout(() => { status.textContent = ''; }, 500);
    }, 1800);
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

 

  const fixEnterToggle = document.getElementById('fixEnterToggle');
  chrome.storage.local.get(['fixEnterEnabled'], (result) => {
    fixEnterToggle.checked = !!result.fixEnterEnabled;
  });
  fixEnterToggle.addEventListener('change', () => {
    chrome.storage.local.set({ fixEnterEnabled: fixEnterToggle.checked });
    setStatus(fixEnterToggle.checked ? 'Fix Enter is ON' : 'Fix Enter is OFF');
  });
});
