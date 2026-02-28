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

/* READ TREASURY */
export async function readTreasury() {
  if (!c.token || !userAddress) return;

  try {
    const bal = await c.token.readableBalance(userAddress);

    setStatValue("tokenBalance", bal.toString() + " BCT");
    setStatValue("tokenBalanceHero", bal.toString() + " BCT");

    // 🔥 Update nav progress
    if (window.updateNavProgress) window.updateNavProgress();

  } catch (err) {
    console.error("Treasury read:", err);
  }
}

/* MINT TOKENS */
export async function mintTokens() {
  if (!ensureConnected()) return;

  const to = document.getElementById("mintAddress").value.trim();
  const amount = document.getElementById("mintAmount").value;

  if (!to || !amount) {
    showToast("error", "Fill address and amount");
    return;
  }

  try {
    showLoading("Minting tokens...");
    const tx = await c.token.mint(to, Number(amount));
    await tx.wait();

    logTx("r2", `Minted ${amount} BCT`, tx.hash);

    await readTreasury();

    hideLoading();
    showToast("success", `Minted ${amount} BCT`);

  } catch (err) {
    hideLoading();
    handleError("mintTokens", err);
  }
}