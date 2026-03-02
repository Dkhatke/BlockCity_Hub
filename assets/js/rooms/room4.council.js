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
    if (window.updateNavProgress) window.updateNavProgress();

  } catch (err) {
    console.error("Council read error:", err);
  }
}

/* CREATE PROPOSAL */
export async function createProposal() {

  if (!ensureConnected()) return;

  const title    = document.getElementById("proposalTitle").value.trim();
  const duration = document.getElementById("proposalDuration").value;

  if (!title || !duration) {
    showToast("error", "Fill all fields");
    return;
  }

  try {

    showLoading("Creating proposal...");

    const tx = await c.voting.createProposal(title, Number(duration));
    await tx.wait();

    logTx("r4", "Proposal created", tx.hash);

    await readCouncil();

    hideLoading();
    showToast("success", "Proposal Created");

  } catch (err) {
    hideLoading();
    handleError("createProposal", err);
  }
}

/* CAST VOTE */
export async function castVote(support) {

  if (!ensureConnected()) return;

  const proposalId = document.getElementById("voteProposalId")?.value;
  if (proposalId === "" || proposalId === null || proposalId === undefined) {
    showToast("error", "Enter proposal ID");
    return;
  }

  try {
    showLoading("Submitting vote...");

    const tx = await c.voting.vote(Number(proposalId), !!support);
    await tx.wait();

    logTx("r4", support ? "Voted YES" : "Voted NO", tx.hash);

    await checkResults();

    hideLoading();
    showToast("success", "Vote submitted");
  } catch (err) {
    hideLoading();
    handleError("castVote", err);
  }
}

/* CHECK RESULTS */
export async function checkResults() {
  if (!c.voting) return;

  const proposalId = document.getElementById("voteProposalId")?.value;
  if (proposalId === "" || proposalId === null || proposalId === undefined) {
    showToast("error", "Enter proposal ID");
    return;
  }

  try {
    const [yes, no, passed] = await c.voting.getResults(Number(proposalId));

    const yesNum = Number(yes);
    const noNum = Number(no);
    const total = yesNum + noNum;
    const yesPct = total > 0 ? Math.round((yesNum / total) * 100) : 0;

    setStatValue("yesCount", String(yesNum));
    setStatValue("noCount", String(noNum));

    const bar = document.getElementById("voteFill");
    if (bar) bar.style.width = `${yesPct}%`;

    const status = document.getElementById("voteStatus");
    if (status) status.textContent = passed ? "Passed" : "Not passed";

    const wrap = document.getElementById("voteBarWrap");
    if (wrap) wrap.style.display = "block";
  } catch (err) {
    handleError("checkResults", err);
  }
}

/* EXECUTE PROPOSAL */
export async function executeProposal() {

  if (!ensureConnected()) return;

  const proposalId = document.getElementById("voteProposalId")?.value;
  if (proposalId === "" || proposalId === null || proposalId === undefined) {
    showToast("error", "Enter proposal ID");
    return;
  }

  try {
    showLoading("Executing proposal...");

    const tx = await c.voting.execute(Number(proposalId));
    await tx.wait();

    logTx("r4", "Proposal executed", tx.hash);

    await checkResults();
    await readCouncil();

    hideLoading();
    showToast("success", "Proposal executed");
  } catch (err) {
    hideLoading();
    handleError("executeProposal", err);
  }
}
