let running = false;

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForSendButton() {
  for (let i = 0; i < 30; i++) {
    let btn = document.querySelector('button[aria-label="Send"]');

    if (!btn) {
      const icon = document.querySelector('span[data-icon="wds-ic-send-filled"]');
      if (icon) btn = icon.closest('button');
    }

    if (btn) return btn;

    await wait(1000);
  }
  return null;
}

// ✅ Normalize Indian numbers
function normalizeNumber(num) {
  let clean = num.replace(/\D/g, '');

  if (clean.startsWith('91') && clean.length >= 12) return clean;
  if (clean.length === 10) return '91' + clean;
  if (clean.startsWith('0') && clean.length === 11) return '91' + clean.slice(1);

  return clean;
}

// ✅ Human-like delay
function getHumanDelay(base) {
  sendCount++;

  let delay = base + Math.random() * 6;

  if (Math.random() < 0.15) {
    delay += 10 + Math.random() * 10;
  }

  if (sendCount > 20) {
    delay += Math.random() * 5;
  }

  return delay * 1000;
}

// ✅ Stop check
async function shouldStop() {
  const data = await chrome.storage.local.get(['waStop']);
  return data.waStop === true;
}

async function processQueue() {
  const data = await chrome.storage.local.get(['waState']);
  if (!data.waState) return;

  if (await shouldStop()) {
    updateUI("Stopped");
    chrome.storage.local.remove('waState');
    return;
  }

  let { numbers, index, message, delay } = data.waState;

  if (index >= numbers.length) {
    console.log("Done all");
    chrome.storage.local.remove('waState');
    alert("All messages sent");
    return;
  }

  const number = normalizeNumber(numbers[index]);

  // Check if chat is already loaded by checking input box content
  const inputBox = document.querySelector('[contenteditable="true"]');

  if (!inputBox || inputBox.innerText.trim() === "") {
    await wait(5000); // give UI a chance
    index++;
    
    await chrome.storage.local.set({
      waState: { numbers, index, message, delay }
    });

    const url = `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
    window.location.href = url;

    return;
  }


  // STEP 2: Wait UI
  await wait(7000);

  const sendBtn = await waitForSendButton();

  if (sendBtn) {
    sendBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    sendBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    sendBtn.click();

    console.log("Sent:", number);

    index++;

    await chrome.storage.local.set({
      waState: { numbers, index, message, delay }
    });

    await wait((delay + Math.random() * 5) * 1000);
    //await wait(getHumanDelay(delay));

    processQueue(); // continue next
  } else {
    console.log("Failed:", number);

    index++;

    await chrome.storage.local.set({
      waState: { numbers, index, message, delay }
    });

    processQueue();
  }
}

// INIT from popup
chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.action === "INIT_WA") {
    await chrome.storage.local.set({
      waState: {
        numbers: msg.numbers,
        index: 0,
        message: msg.message,
        delay: msg.delay
      }
    });

    processQueue();
  }
});

// AUTO RESUME after reload
window.addEventListener('load', () => {
  setTimeout(processQueue, 4000);
});