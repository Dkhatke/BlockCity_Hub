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

/* READ COUNCIL */
export async function readCouncil() {
  if (!c.voting) return;

  try {
    const count = await c.voting.proposalCount();
    setStatValue("proposalCount", count.toString());

    // 🔥 Update nav progress
    if (window.updateNavProgress) window.updateNavProgress();

  } catch (err) {
    console.error("Council read:", err);
  }
}

/* CREATE PROPOSAL */
export async function createProposal() {
  if (!ensureConnected()) return;

  const title = document.getElementById("proposalTitle").value.trim();
  const duration = document.getElementById("proposalDuration").value;

  if (!title || !duration) {
    showToast("error", "Fill all fields");
    return;
  }

  try {
    showLoading("Creating proposal...");
    const tx = await c.voting.createProposal(title, Number(duration));
    await tx.wait();

    logTx("r4", `Created proposal`, tx.hash);

    await readCouncil();

    hideLoading();
    showToast("success", "Proposal Created");

  } catch (err) {
    hideLoading();
    handleError("createProposal", err);
  }
}