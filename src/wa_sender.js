let sendCount = 0;

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function normalizeNumber(num) {
  let clean = num.replace(/\D/g, '');
  if (clean.startsWith('91') && clean.length >= 12) return clean;
  if (clean.length === 10) return '91' + clean;
  if (clean.startsWith('0') && clean.length === 11) return '91' + clean.slice(1);
  return clean;
}

async function shouldStop() {
  const data = await chrome.storage.local.get(['waStop']);
  return data.waStop === true;
}

// 👆 Wait for WA Web React shell to finish loading
async function waitForWAShell(timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ready = document.querySelector('#app .two')
               || document.querySelector('[data-testid="chat-list"]')
               || document.querySelector('header [data-testid]');
    if (ready) return true;
    await wait(1500);
  }
  return false;
}

// 👆 Wait for send button + message text to both be present at the same time
async function waitForChatReady(timeoutMs = 40000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {

    let btn = document.querySelector('button[aria-label="Send"]');
    if (!btn) {
      const icon = document.querySelector('span[data-icon="wds-ic-send-filled"]');
      if (icon) btn = icon.closest('button');
    }

    const inputBox = document.querySelector('footer [contenteditable="true"]')
                  || document.querySelector('[data-testid="conversation-compose-box-input"]');

    if (btn && !btn.disabled && inputBox && inputBox.innerText.trim().length > 0) {
      return { btn, inputBox };
    }

    await wait(1500);
  }
  return null;
}

// 👆 Click and confirm by watching input box clear
async function clickAndVerify(btn, inputBox, maxAttempts = 4) {
  for (let i = 1; i <= maxAttempts; i++) {
    btn.focus();
    await wait(300);
    btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
    await wait(100);
    btn.dispatchEvent(new PointerEvent('pointerup',   { bubbles: true, cancelable: true }));
    await wait(100);
    btn.click();

    await wait(2500);

    if (!inputBox || inputBox.innerText.trim().length === 0) return true;

    console.warn(`Attempt ${i} failed, retrying...`);
    await wait(1000 * i);

    btn = document.querySelector('button[aria-label="Send"]')
       || (() => { const x = document.querySelector('span[data-icon="wds-ic-send-filled"]'); return x?.closest('button'); })();
    if (!btn) return true;
  }
  return false;
}

async function processQueue() {
  const data = await chrome.storage.local.get(['waState']);
  if (!data.waState) return;

  if (await shouldStop()) {
    chrome.storage.local.remove('waState');
    return;
  }

  let { numbers, index, message, delay, navigated } = data.waState;

  if (index >= numbers.length) {
    chrome.storage.local.remove('waState');
    alert("All messages sent!");
    return;
  }

  const number = normalizeNumber(numbers[index]);

  // 👆 KEY FIX: use a `navigated` flag instead of checking the URL
  // navigated = false → we haven't opened this number's chat yet → navigate now
  // navigated = true  → we already navigated, page just reloaded → proceed to send
  if (!navigated) {
    console.log("Navigating to:", number);

    // 👆 Set navigated = true BEFORE navigating so after reload we go straight to send
    await chrome.storage.local.set({
      waState: { numbers, index, message, delay, navigated: true }
    });

    window.location.href = `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
    return; // stop — load event resumes processQueue after reload
  }

  // ── navigated = true: we're on the chat page, proceed to send ──────────────

  console.log("Attempting send for:", number);

  // PHASE 1 — wait for WA shell
  const shellReady = await waitForWAShell();
  if (!shellReady) {
    console.warn("Shell timed out — reloading");
    // 👆 Keep navigated = true so after reload we try to send again, not re-navigate
    window.location.reload();
    return;
  }

  await wait(2000); // small buffer after shell

  // PHASE 2 — wait for send button + message in input box
  const ready = await waitForChatReady();

  if (ready) {
    const ok = await clickAndVerify(ready.btn, ready.inputBox);
    console.log(ok ? `✅ Sent: ${number}` : `⚠️ Uncertain: ${number}`);
  } else {
    console.warn(`⚠️ Chat never ready — skipping: ${number}`);
  }

  // ── Move to next number ────────────────────────────────────────────────────

  index++;

  // 👆 Reset navigated = false for the next number
  await chrome.storage.local.set({
    waState: { numbers, index, message, delay, navigated: false }
  });

  if (index < numbers.length) {
    await wait((delay + Math.random() * 3) * 1000);

    const next = normalizeNumber(numbers[index]);

    // 👆 Set navigated = true before navigating to next
    await chrome.storage.local.set({
      waState: { numbers, index, message, delay, navigated: true }
    });

    window.location.href = `https://web.whatsapp.com/send?phone=${next}&text=${encodeURIComponent(message)}`;
  } else {
    chrome.storage.local.remove('waState');
    alert("All messages sent!");
  }
}

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.action === "INIT_WA") {
    sendCount = 0;
    await chrome.storage.local.set({
      waState: {
        numbers: msg.numbers,
        index: 0,
        message: msg.message,
        delay: msg.delay,
        navigated: false // 👆 start with navigated = false
      }
    });
    processQueue();
  }
});

// 👆 5s after load gives WA enough time to start before we do anything
window.addEventListener('load', () => {
  setTimeout(processQueue, 5000);
});