// Function to enable Dark Reader

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
if (chrome.runtime?.id) {
  chrome.storage.local.get(['theme'], (result) => {
    if (chrome.runtime.lastError) {
      console.log('Storage access error:', chrome.runtime.lastError);
      return;
    }
    if (result.theme === 'dark') {
      enableDarkReader();
    } else {
      disableDarkReader();
    }
  });
}

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
if (chrome.runtime?.id) {
  chrome.storage.local.get(['volumeBoost', 'volumeBoostLevel'], (result) => {
    if (chrome.runtime.lastError) {
      console.log('Storage access error:', chrome.runtime.lastError);
      return;
    }
    if (result.volumeBoost && typeof result.volumeBoostLevel === "number") {
      enableVolumeBoost(result.volumeBoostLevel);
    } else {
      disableVolumeBoost();
    }
  });
}

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

// Check if extension context is valid before accessing chrome.storage
if (chrome.runtime?.id) {
  chrome.storage.local.get(['fixEnterEnabled'], (result) => {
    if (chrome.runtime.lastError) {
      console.log('Storage access error:', chrome.runtime.lastError);
      return;
    }
    attachFixEnterHandler(!!result.fixEnterEnabled);
  });
} else {
  console.log('Extension context invalidated. Please reload the page.');
}

//chrome.storage.local.get(['fixEnterEnabled'], (result) => {
//  attachFixEnterHandler(!!result.fixEnterEnabled);
//});

chrome.storage.onChanged.addListener((changes, area) => {
  if (!chrome.runtime?.id) return; // Exit if context invalidated
  
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