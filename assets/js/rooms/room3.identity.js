import { c, userAddress } from "../core/state.js";
import {
  ensureConnected,
  showToast,
  showLoading,
  hideLoading,
  logTx,
  handleError,
  setStatValue
} from "../core/helpers.js";

/* READ CERTIFICATE COUNT */
export async function readIdentity() {
  if (!c.badge) return;

  try {
    const count = await c.badge.totalCertificates();
    setStatValue("badgeCount", count.toString());

    // 🔥 Update nav progress
    if (window.updateNavProgress) window.updateNavProgress();

  } catch (err) {
    console.error("Certificate read error:", err);
  }
}

/* MINT CERTIFICATE */
export async function mintCertificate() {

  if (!ensureConnected()) return;

  const name = document.getElementById("studentName").value.trim();
  const course = document.getElementById("courseName").value.trim();
  const uri = document.getElementById("badgeURI").value.trim();

  if (!name || !course || !uri) {
    showToast("error", "Fill all fields");
    return;
  }

  try {
    showLoading("Minting Certificate NFT...");

    const today = new Date().toISOString().split("T")[0];

    const tx = await c.badge.mintCertificate(
      userAddress,
      name,
      course,
      today,
      uri
    );

    await tx.wait();

    logTx("r3", `Certificate minted`, tx.hash);

    await readIdentity();

    hideLoading();
    showToast("success", "Certificate Minted!");

  } catch (err) {
    hideLoading();
    handleError("mintCertificate", err);
  }
}