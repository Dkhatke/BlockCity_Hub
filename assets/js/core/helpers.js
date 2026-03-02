/* ═══════════════════════════════════════════════════════
   helpers.js — Shared UI & Utility Functions
   Used Across All Rooms
═══════════════════════════════════════════════════════ */

import { signer } from "./state.js";


/* ═══════════════════════════════════════════════════════
   ENSURE WALLET IS CONNECTED
   Used before any transaction
═══════════════════════════════════════════════════════ */

export function ensureConnected() {

  if (!signer) {
    showToast("error", "Connect your wallet first");
    return false;
  }

  return true;
}


/* ═══════════════════════════════════════════════════════
   UPDATE STAT VALUE (with flash animation)
═══════════════════════════════════════════════════════ */

export function setStatValue(id, value) {

  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = value;

  el.classList.add("updating");
  setTimeout(() => {
    el.classList.remove("updating");
  }, 600);
}


/* ═══════════════════════════════════════════════════════
   TRANSACTION LOG SYSTEM
   Logs every transaction with Etherscan link
═══════════════════════════════════════════════════════ */

export function logTx(roomClass, description, txHash) {

  const list = document.getElementById("txList");
  if (!list) return;

  const now = new Date().toLocaleTimeString();
  const shortHash = txHash
    ? txHash.slice(0, 8) + "..." + txHash.slice(-4)
    : "";

  const explorerUrl = txHash
    ? `https://sepolia.etherscan.io/tx/${txHash}`
    : "#";

  const item = document.createElement("li");
  item.className = "tx-item";

  item.innerHTML = `
    <div class="tx-desc">${description}</div>
    <a class="tx-hash" href="${explorerUrl}" target="_blank">
      ${shortHash}
    </a>
    <div class="tx-time">${now}</div>
  `;

  list.insertBefore(item, list.firstChild);

  while (list.children.length > 15) {
    list.removeChild(list.lastChild);
  }
}


/* ═══════════════════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
═══════════════════════════════════════════════════════ */

export function showToast(type, message) {

  const container = document.getElementById("toast");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-item ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}


/* ═══════════════════════════════════════════════════════
   LOADING OVERLAY CONTROLLER
═══════════════════════════════════════════════════════ */

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


/* ═══════════════════════════════════════════════════════
   STANDARDIZED ERROR HANDLER
═══════════════════════════════════════════════════════ */

export function handleError(functionName, err) {

  console.error(`${functionName} error:`, err);

  const message =
    err?.reason ||
    err?.shortMessage ||
    err?.message ||
    "Transaction failed";

  showToast("error", message.slice(0, 90));
}