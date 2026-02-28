/* ═══════════════════════════════════════════════════════
   helpers.js — UI + Utility Functions
   Used across all rooms
═══════════════════════════════════════════════════════ */

import { signer } from "./state.js";

/* ─────────────────────────────────────────────
   ENSURE WALLET CONNECTED
───────────────────────────────────────────── */

export function ensureConnected() {
  if (!signer) {
    showToast("error", "Connect your wallet first");
    return false;
  }
  return true;
}

/* ─────────────────────────────────────────────
   UPDATE STAT VALUE (with flash animation)
───────────────────────────────────────────── */

export function setStatValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = value;

  // Small flash animation
  el.classList.add("updating");
  setTimeout(() => {
    el.classList.remove("updating");
  }, 600);
}

/* ─────────────────────────────────────────────
   TRANSACTION LOG
───────────────────────────────────────────── */

export function logTx(roomClass, description, txHash) {

  const list = document.getElementById("txList");
  if (!list) return;

  const colors = {
    r1: getComputedStyle(document.documentElement).getPropertyValue('--r1').trim(),
    r2: getComputedStyle(document.documentElement).getPropertyValue('--r2').trim(),
    r3: getComputedStyle(document.documentElement).getPropertyValue('--r3').trim(),
    r4: getComputedStyle(document.documentElement).getPropertyValue('--r4').trim()
  };

  const item = document.createElement("li");
  item.className = "tx-item";

  const now = new Date().toLocaleTimeString();
  const shortHash = txHash ? txHash.slice(0, 8) + "..." + txHash.slice(-4) : "";
  const explorerUrl = txHash
    ? `https://sepolia.etherscan.io/tx/${txHash}`
    : "#";

  item.innerHTML = `
    <div class="tx-dot" style="background:${colors[roomClass] || '#999'};
         box-shadow:0 0 6px ${colors[roomClass] || '#999'}"></div>

    <div class="tx-desc">${description}</div>

    <a class="tx-hash" href="${explorerUrl}" target="_blank">
      ${shortHash}
    </a>

    <div class="tx-time">${now}</div>
  `;

  list.insertBefore(item, list.firstChild);

  // Keep max 15 items
  while (list.children.length > 15) {
    list.removeChild(list.lastChild);
  }
}

/* ─────────────────────────────────────────────
   TOAST NOTIFICATION SYSTEM
───────────────────────────────────────────── */

export function showToast(type, message) {

  const container = document.getElementById("toast");
  if (!container) return;

  const icons = {
    success: "✅",
    error:   "❌",
    info:    "ℹ️"
  };

  const toast = document.createElement("div");
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `
    <span>${icons[type] || ""}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3100);
}

/* ─────────────────────────────────────────────
   LOADING OVERLAY
───────────────────────────────────────────── */

export function showLoading(message = "Processing...") {

  const overlay = document.getElementById("loadingOverlay");
  const msgEl   = document.getElementById("loadingMsg");

  if (!overlay || !msgEl) return;

  msgEl.textContent = message;
  overlay.classList.add("active");
}

export function hideLoading() {

  const overlay = document.getElementById("loadingOverlay");
  if (!overlay) return;

  overlay.classList.remove("active");
}

/* ─────────────────────────────────────────────
   ERROR HANDLER
───────────────────────────────────────────── */

export function handleError(functionName, err) {

  console.error(`${functionName} error:`, err);

  const message =
    err?.reason ||
    err?.shortMessage ||
    err?.message ||
    "Transaction failed";

  showToast("error", message.slice(0, 90));
}