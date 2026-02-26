import { signer } from "./state.js";

export function ensureConnected() {
  if (!signer) {
    showToast("error", "Connect your wallet first");
    return false;
  }
  return true;
}

export function setStatValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  el.classList.add("updating");
  setTimeout(() => el.classList.remove("updating"), 700);
}

export function logTx(roomClass, description, txHash) {
  const colors = {
    r1:getComputedStyle(document.documentElement).getPropertyValue('--r1').trim(),
    r2:getComputedStyle(document.documentElement).getPropertyValue('--r2').trim(),
    r3:getComputedStyle(document.documentElement).getPropertyValue('--r3').trim(),
    r4:getComputedStyle(document.documentElement).getPropertyValue('--r4').trim()
  };
  const list = document.getElementById("txList");
  const item = document.createElement("li");
  item.className = "tx-item";
  const now = new Date().toLocaleTimeString();
  const shortHash = txHash ? txHash.slice(0,8)+"..."+txHash.slice(-4) : "";
  const explorerUrl = txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : "#";
  item.innerHTML = `
    <div class="tx-dot" style="background:${colors[roomClass]};box-shadow:0 0 6px ${colors[roomClass]}"></div>
    <div class="tx-desc">${description}</div>
    <a class="tx-hash" href="${explorerUrl}" target="_blank">${shortHash}</a>
    <div class="tx-time">${now}</div>
  `;
  list.insertBefore(item, list.firstChild);
  while (list.children.length > 15) list.removeChild(list.lastChild);
}

export function showToast(type, message) {
  const container = document.getElementById("toast");
  const icons = { success:"✅", error:"❌", info:"ℹ️" };
  const t = document.createElement("div");
  t.className = `toast-item ${type}`;
  t.innerHTML = `<span>${icons[type]||""}</span> ${message}`;
  container.appendChild(t);
  setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 3100);
}

export function showLoading(msg) {
  document.getElementById("loadingMsg").textContent = msg || "Processing...";
  document.getElementById("loadingOverlay").classList.add("active");
}

export function hideLoading() {
  document.getElementById("loadingOverlay").classList.remove("active");
}

export function handleError(fnName, err) {
  console.error(`${fnName} error:`, err);
  const msg = err?.reason || err?.message || "Transaction failed";
  showToast("error", msg.slice(0, 80));
}