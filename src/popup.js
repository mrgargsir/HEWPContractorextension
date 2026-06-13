document.addEventListener('DOMContentLoaded', () => {
  // Get version from manifest
  const manifest = chrome.runtime.getManifest();
  const installedVersion = manifest.version;
  
  chrome.storage.local.get(['waNumbers', 'waMessage', 'waDelay'], (data) => {
  if (data.waNumbers) document.getElementById('waNumbers').value = data.waNumbers;
  if (data.waMessage) document.getElementById('waMessage').value = data.waMessage;
  if (data.waDelay) {
    document.getElementById('waDelay').value = data.waDelay;
    document.getElementById('waDelayValue').textContent = data.waDelay;
  }
});

  // Update installed version in footer
  const installedVersionElement = document.querySelector('.installed-version a');
  if (installedVersionElement) {
    installedVersionElement.textContent = `Installed version ${installedVersion}`;
  }
  // Fetch latest version from GitHub releases
  let latestZipUrl = ''; // Store ZIP download URL

  // Fetch latest release once
  fetch('https://api.github.com/repos/mrgargsir/HEWP-Excel-Addins/releases/latest')
    .then(response => response.json())
    .then(data => {
      const version = data.tag_name;
      const versionEl = document.getElementById('versionext');
      const downloadEl = document.getElementById('downloadext');

      if (versionEl) versionEl.textContent = `HEWP Tools Online Installer`;

      const zipAsset = data.assets.find(asset =>
        asset.name.endsWith('.exe')
      );

      if (zipAsset) {
        latestZipUrl = zipAsset.browser_download_url;
        if (downloadEl) {
          downloadEl.innerHTML = `<a href="${latestZipUrl}" target="_blank">Download Online Installer</a>`;
        }
      } else {
        if (downloadEl) downloadEl.textContent = 'Online Installer not found.';
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
    chrome.tabs.create({ url: 'https://mrgargsir.github.io/HEWP-Excel-Addins/#download' });
  });
}

  

  // All DOM element event listeners go here:
  document.getElementById('hsrBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://mrgargsir.github.io/HEWP-Excel-Addins/' });
    setStatus('CHANNEL OPENED');
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
      const subject = encodeURIComponent('Feature Request for HEWP Tools');
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
        }, (response) => {
          if (chrome.runtime.lastError) {
            // Silently ignore if content script not loaded
            console.log('Message not received (page may need reload):', chrome.runtime.lastError.message);
          }
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
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.log('Message not received:', chrome.runtime.lastError.message);
            }
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

// Auto Add Bookmarks Toggle
const bookmarksToggle = document.getElementById('bookmarksToggle');
const bookmarkPositionSection = document.getElementById('bookmarkPositionSection');
const positionLeft = document.getElementById('positionLeft');
const positionRight = document.getElementById('positionRight');

// Initialize from storage
chrome.storage.local.get(['bookmarksEnabled', 'bookmarkPosition'], (result) => {
    bookmarksToggle.checked = !!result.bookmarksEnabled;

    // Only show position section if bookmarks are enabled AND position is selected
    const position = result.bookmarkPosition;
    if (result.bookmarksEnabled && position) {
      bookmarkPositionSection.style.display = 'block';
      if (position === 'left') {
        positionLeft.checked = true;
      } else {
        positionRight.checked = true;
      }
    } else {
      bookmarkPositionSection.style.display = 'none';
      // Clear any selection when initializing
      positionLeft.checked = false;
      positionRight.checked = false;
    }
  });

// Toggle bookmarks on/off
  bookmarksToggle.addEventListener('change', () => {
    const enabled = bookmarksToggle.checked;
    
    if (enabled) {
      // Show position selection but don't add bookmarks yet
      bookmarkPositionSection.style.display = 'block';
      setStatus('Please select bookmark position');
      
      // Clear storage until position is selected
      chrome.storage.local.set({ bookmarksEnabled: false });
    } else {
      // Hide position selection and remove bookmarks
      bookmarkPositionSection.style.display = 'none';
      chrome.storage.local.set({ bookmarksEnabled: false });
      
      // Remove bookmarks
      chrome.runtime.sendMessage({
        action: 'manageBookmarks',
        enable: false,
        position: 'left'
      }, (response) => {
        if (response && response.success) {
          setStatus('Bookmarks removed');
        }
      });
      
      // Clear position selection
      positionLeft.checked = false;
      positionRight.checked = false;
    }
  });

  // When position is selected, add bookmarks
  function handlePositionChange() {
    if (!bookmarksToggle.checked) return;
    
    const position = positionLeft.checked ? 'left' : 'right';
    
    // Now set bookmarks as enabled and add them
    chrome.storage.local.set({ 
        bookmarksEnabled: true, 
        bookmarkPosition: position 
    });
    
    // Add bookmarks at selected position
    chrome.runtime.sendMessage({
        action: 'manageBookmarks',
        enable: true,
        position: position
    }, (response) => {
        if (response && response.success) {
            setStatus(`Bookmarks added at Top ${position === 'left' ? 'Left' : 'Right'}`);
        }
    });
  }

  positionLeft.addEventListener('change', handlePositionChange);
  positionRight.addEventListener('change', handlePositionChange);
});

// WhatsApp Sender Logic
const delaySlider = document.getElementById('waDelay');
const delayValue = document.getElementById('waDelayValue');

if (delaySlider) {
  delaySlider.addEventListener('input', () => {
    delayValue.textContent = delaySlider.value;
  });
}

document.getElementById('sendWA')?.addEventListener('click', async () => {
  const numbersRaw = document.getElementById('waNumbers').value;
  const message = document.getElementById('waMessage').value;
  const delay = parseInt(delaySlider.value);

  if (!numbersRaw || !message) {
    alert('Enter numbers and message');
    return;
  }

  const numbers = numbersRaw
    .split(/\n|,|\t/)
    .map(n => n.trim())
    .filter(n => n.length > 8);

  // reset stop flag
  await chrome.storage.local.set({ waStop: false });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, {
  action: "INIT_WA",
  numbers,
  message,
  delay
});
});

document.getElementById('stopWA')?.addEventListener('click', async () => {
  await chrome.storage.local.set({ waStop: true });
});

// Listen for updates from content script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "WA_PROGRESS") {
    document.getElementById('waTotal').textContent = msg.total;
    document.getElementById('waSent').textContent = msg.sent;
    document.getElementById('waFailed').textContent = msg.failed;
    document.getElementById('waStatus').textContent = msg.status;
  }
});

const waBtn = document.getElementById('waToggleBtn');
const waSection = document.getElementById('waSection');

waBtn.addEventListener('click', () => {
  if (waSection.classList.contains('visible')) {
    waSection.classList.remove('visible');
    setTimeout(() => (waSection.style.display = 'none'), 300);
  } else {
    waSection.style.display = 'block';
    setTimeout(() => waSection.classList.add('visible'), 10);
  }
});

['waNumbers', 'waMessage', 'waDelay'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener('input', () => {
    chrome.storage.local.set({
      waNumbers: document.getElementById('waNumbers').value,
      waMessage: document.getElementById('waMessage').value,
      waDelay: document.getElementById('waDelay').value
    });
  });
});