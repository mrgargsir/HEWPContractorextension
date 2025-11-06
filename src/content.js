// Enhanced content.js (compatible with your existing message format)
// const darkModeStyles = `
//   html, body, div, section, main, header, footer, nav, aside, article {
//     background-color: #181824 !important;
//     color: #e0e0e0 !important;
//     border-color: #333 !important;
//   }
//   body {
//     background: #181824 !important;
//     color: #e0e0e0 !important;
//   }
//   a, a *, .nav-link, .dropdown-menu a {
//     color: #bb86fc !important;
//   }
//   input, textarea, select, button, .form-control, .form-select {
//     background-color: #232336 !important;
//     color: #e0e0e0 !important;
//     border-color: #444 !important;
//   }
//   table, th, td, .table, .table th, .table td {
//     background-color: #232336 !important;
//     color: #e0e0e0 !important;
//     border-color: #333 !important;
//   }
//   .bg-light, .bg-white, .bg-light-purp, .bg-light-blue, .bg-light-green, .bg-light-yellow, .bg-light-pink {
//     background-color: #232336 !important;
//     color: #e0e0e0 !important;
//   }
//   .card, .panel, .container, .box, .content, .modal-content, .dropdown-menu, .collapse, .submenu, .cust-table, .first-row-fix-table {
//     background-color: #232336 !important;
//     color: #e0e0e0 !important;
//     border-color: #333 !important;
//   }
//   .theme-btn--blue, .theme-btn--orange, .theme-btn--red, .btn, .btn-info, .btn-primary, .btn-success, .btn-warning, .btn-danger {
//     background-color: #333c5a !important;
//     color: #fff !important;
//     border-color: #444 !important;
//   }
//   .theme-btn--blue:hover, .theme-btn--orange:hover, .theme-btn--red:hover, .btn:hover {
//     background-color: #444c6a !important;
//     color: #fff !important;
//   }
//   .modal-header, .modal-footer {
//     background-color: #232336 !important;
//     color: #e0e0e0 !important;
//     border-color: #333 !important;
//   }
//   .dropdown-menu {
//     background-color: #232336 !important;
//     color: #e0e0e0 !important;
//   }
//   .form-control[readonly], .form-control[disabled] {
//     background-color: #232336 !important;
//     color: #b0b0b0 !important;
//   }
//   ::placeholder {
//     color: #b0b0b0 !important;
//     opacity: 1 !important;
//   }
//   hr {
//     border-color: #333 !important;
//   }
//   /* Remove box-shadows that may look odd in dark mode */
//   *, *:before, *:after {
//     box-shadow: none !important;
//   }
// `;

function enableDarkReader() {
  if (window.DarkReader) {
    window.DarkReader.enable({
      brightness: 100,
      contrast: 90,
      sepia: 10
    });
  }
}

function disableDarkReader() {
  if (window.DarkReader) {
    window.DarkReader.disable();
  }
}

let boosterGainNode = null;
let currentBoostLevel = 100;

// Function to enable volume boost
function enableVolumeBoost(level = 100) {
  currentBoostLevel = level;
  document.querySelectorAll('audio, video').forEach(media => {
    if (!media._boosterCtx) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaElementSource(media);
      const gain = ctx.createGain();
      gain.gain.value = level / 100;
      source.connect(gain).connect(ctx.destination);
      media._boosterCtx = ctx;
      media._boosterGain = gain;
    } else {
      media._boosterGain.gain.value = level / 100;
    }
  });
}

// Function to disable volume boost
function disableVolumeBoost() {
  document.querySelectorAll('audio, video').forEach(media => {
    if (media._boosterCtx) {
      media._boosterGain.gain.value = 1.0;
    }
  });
}

// // Listen for toggle all checkboxes message from popup
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'toggleAllCheckboxes') {
//     // Get all checkboxes on the webpage
//     const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
//     // Determine if all are currently checked
//     const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
//     // Toggle each checkbox
//     checkboxes.forEach(checkbox => {
//       checkbox.checked = !allChecked;
      
//       // Trigger change and click events
//       checkbox.dispatchEvent(new Event('change', { bubbles: true }));
//       checkbox.dispatchEvent(new Event('click', { bubbles: true }));
//     });
    
//     // Send response back to popup
//     sendResponse({ 
//       success: true, 
//       toggled: checkboxes.length 
//     });
//   }
// });


// Listen for popup messages
chrome.runtime.onMessage.addListener((message) => {
  if (typeof message.darkMode !== "undefined") {
    if (message.darkMode) {
      enableDarkReader();
    } else {
      disableDarkReader();
    }
  }

  if (typeof message.volumeBoost !== "undefined") {
    if (message.volumeBoost && typeof message.volumeBoostLevel === "number") {
      enableVolumeBoost(message.volumeBoostLevel);
    } else {
      disableVolumeBoost();
    }
  }
});

// Always check dark mode state on page load
chrome.storage.local.get(['theme'], (result) => {
  if (result.theme === 'dark') {
    enableDarkReader();
  } else {
    disableDarkReader();
  }
});

// Listen for history changes (for SPAs)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    chrome.storage.local.get(['theme'], (result) => {
      if (result.theme === 'dark') {
        enableDarkReader();
      } else {
        disableDarkReader();
      }
    });
  }
}).observe(document, {subtree: true, childList: true});

// Listen for theme changes in storage (for instant update across all tabs)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.theme) {
    if (changes.theme.newValue === 'dark') {
      enableDarkReader();
    } else {
      disableDarkReader();
    }
  }
});

// On page load, apply volume boost if enabled
chrome.storage.local.get(['volumeBoost', 'volumeBoostLevel'], (result) => {
  if (result.volumeBoost && typeof result.volumeBoostLevel === "number") {
    enableVolumeBoost(result.volumeBoostLevel);
  } else {
    disableVolumeBoost();
  }
});

function attachFixEnterHandler(enabled) {
  document.querySelectorAll('#txthsrno').forEach(hsrInput => {
    hsrInput.removeEventListener('keypress', window.__fixEnterHandler, true);
    if (enabled) {
      window.__fixEnterHandler = function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          const btn = document.getElementById("Button5");
          if (btn) btn.click();
        }
      };
      hsrInput.addEventListener('keypress', window.__fixEnterHandler, true);
    }
  });
}

chrome.storage.local.get(['fixEnterEnabled'], (result) => {
  attachFixEnterHandler(!!result.fixEnterEnabled);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.fixEnterEnabled) {
    attachFixEnterHandler(changes.fixEnterEnabled.newValue);
  }
});

const observer = new MutationObserver(() => {
  chrome.storage.local.get(['fixEnterEnabled'], (result) => {
    attachFixEnterHandler(!!result.fixEnterEnabled);
  });
});
observer.observe(document.body, { childList: true, subtree: true });