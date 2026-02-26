import { c, userAddress } from "../core/state.js";
import { ensureConnected, showToast, showLoading, hideLoading, logTx, handleError, setStatValue } from "../core/helpers.js";

/* READ TREASURY */
export async function readTreasury() {
  if (!c.token || !userAddress) return;
  try {
    const bal = await c.token.readableBalance(userAddress);
    setStatValue("tokenBalance",     bal.toString() + " BCT");
    setStatValue("tokenBalanceHero", bal.toString() + " BCT");
  } catch (err) { 
    console.error("Treasury read:", err); 
  }
}

/* MINT TOKENS */
export async function mintTokens() {
  if (!ensureConnected()) return;

  const to     = document.getElementById("mintAddress").value.trim();
  const amount = document.getElementById("mintAmount").value;

  if (!to || !amount) { 
    showToast("error", "Fill in address and amount"); 
    return; 
  }

  if (!ethers.isAddress(to)) { 
    showToast("error", "Invalid address"); 
    return; 
  }

  try {
    showLoading("Minting tokens...");
    const tx = await c.token.mint(to, Number(amount));
    await tx.wait();

    logTx("r2", `Minted ${amount} BCT to ${to.slice(0,6)}...`, tx.hash);

    await readTreasury();

    hideLoading();
    showToast("success", `✅ Minted ${amount} BCT`);

    document.getElementById("mintAddress").value = "";
    document.getElementById("mintAmount").value  = "";

  } catch (err) {
    hideLoading(); 
    handleError("mintTokens", err);
  }
}

/* REWARD USER */
export async function rewardUser() {
  if (!ensureConnected()) return;

  const to     = document.getElementById("mintAddress").value.trim();
  const amount = document.getElementById("mintAmount").value;

  if (!to || !amount) { 
    showToast("error", "Fill in address and amount"); 
    return; 
  }

  if (!ethers.isAddress(to)) { 
    showToast("error", "Invalid address"); 
    return; 
  }

  try {
    showLoading("Sending reward...");
    const tx = await c.token.rewardUser(to, Number(amount));
    await tx.wait();

    logTx("r2", `Rewarded ${amount} BCT to ${to.slice(0,6)}...`, tx.hash);

    await readTreasury();

    hideLoading();
    showToast("success", `⭐ Rewarded ${amount} BCT`);

  } catch (err) {
    hideLoading(); 
    handleError("rewardUser", err);
  }
}