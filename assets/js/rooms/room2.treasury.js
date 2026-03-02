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

    const balance = await c.token.balanceOf(userAddress); // ✅ FIXED
    const supply  = await c.token.totalSupply();

    const formattedBal = ethers.formatUnits(balance, 18);
    const formattedSup = ethers.formatUnits(supply, 18);

    setStatValue("tokenBalance", formattedBal + " BCT");
    setStatValue("tokenBalanceHero", formattedBal + " BCT");
    setStatValue("totalSupply", formattedSup + " BCT");
    if (window.updateNavProgress) window.updateNavProgress();

  } catch (err) {
    console.error("Treasury read error:", err);
  }
}

/* MINT TOKENS */
export async function mintTokens() {

  if (!ensureConnected()) return;

  const to     = document.getElementById("mintAddress").value.trim();
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
