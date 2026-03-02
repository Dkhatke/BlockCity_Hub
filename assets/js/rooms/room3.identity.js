import { c } from "../core/state.js";
import {
  ensureConnected,
  showToast,
  showLoading,
  hideLoading,
  logTx,
  handleError,
  setStatValue
} from "../core/helpers.js";

/* ═══════════════════════════════════════
   READ CERTIFICATE DATA
═══════════════════════════════════════ */

export async function readIdentity() {

  if (!c.badge) return;

  try {

    const count = await c.badge.totalCertificates();
    setStatValue("badgeCount", count.toString());
    if (window.updateNavProgress) window.updateNavProgress();

  } catch (err) {
    console.error("Identity read error:", err);
  }
}

/* LIVE CERTIFICATE PREVIEW */
export function updateCertificatePreview() {
  const name = document.getElementById("studentName")?.value?.trim();
  const citizenId = document.getElementById("citizenId")?.value?.trim();
  const today = new Date().toISOString().slice(0, 10);

  setStatValue("previewName", name || "YOUR NAME");
  setStatValue("previewCitizenId", citizenId || "BC-0000");
  setStatValue("certDate", today);
}

// Backward-compatible alias used in index.html inline handlers.
export function updateCertPreview() {
  updateCertificatePreview();
}

/* ═══════════════════════════════════════
   MINT CERTIFICATE NFT
═══════════════════════════════════════ */

export async function mintCertificate() {

  if (!ensureConnected()) return;

  const name = document.getElementById("studentName").value.trim();
  const citizenId = document.getElementById("citizenId").value.trim();
  const recipient = document.getElementById("badgeAddress").value.trim();

  if (!name || !citizenId || !recipient) {
    showToast("error", "Fill all fields");
    return;
  }

  try {

    showLoading("Minting certificate...");

    const courseName = "BlockCity Web3 Workshop";
    const issueDate = new Date().toISOString().slice(0, 10);
    const metadataURI = "ipfs://placeholder";

    const tx = await c.badge.mintCertificate(
      recipient,
      name,
      courseName,
      issueDate,
      metadataURI
    );
    await tx.wait();

    logTx("r3", `Certificate minted for ${name}`, tx.hash);

    await readIdentity();
    updateCertificatePreview();

    hideLoading();
    showToast("success", "Certificate Minted!");

  } catch (err) {
    hideLoading();
    handleError("mintCertificate", err);
  }
}

/* ═══════════════════════════════════════
   LOOKUP OWNER
═══════════════════════════════════════ */

export async function lookupOwner() {

  const id = document.getElementById("lookupTokenId").value;

  if (!id) {
    showToast("error", "Enter token ID");
    return;
  }

  try {

    const owner = await c.badge.ownerOf(Number(id));

    document.getElementById("lookupResult").style.display = "flex";
    document.getElementById("lookupLabel").textContent = "Owner";
    document.getElementById("lookupValue").textContent =
      owner.slice(0,6) + "..." + owner.slice(-4);

  } catch (err) {
    handleError("lookupOwner", err);
  }
}
