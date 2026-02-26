import { c } from "../core/state.js";
import { ensureConnected, showToast, showLoading, hideLoading, logTx, handleError, setStatValue } from "../core/helpers.js";

/* READ COUNCIL */
export async function readCouncil() {
  if (!c.voting) return;
  try {
    const count = await c.voting.proposalCount();
    setStatValue("proposalCount", count.toString());
  } catch (err) { 
    console.error("Council read:", err); 
  }
}

/* CREATE PROPOSAL */
export async function createProposal() {
  if (!ensureConnected()) return;

  const title    = document.getElementById("proposalTitle").value.trim();
  const duration = document.getElementById("proposalDuration").value;

  if (!title)    { showToast("error", "Enter a proposal title"); return; }
  if (!duration) { showToast("error", "Enter a duration in minutes"); return; }

  try {
    showLoading("Creating proposal...");
    const tx = await c.voting.createProposal(title, Number(duration));
    await tx.wait();

    logTx("r4", `Created proposal: "${title}"`, tx.hash);

    await readCouncil();

    hideLoading();
    showToast("success", `✅ Proposal created: "${title}"`);

    document.getElementById("proposalTitle").value    = "";
    document.getElementById("proposalDuration").value = "10";

  } catch (err) {
    hideLoading(); 
    handleError("createProposal", err);
  }
}

/* CAST VOTE */
export async function castVote(support) {
  if (!ensureConnected()) return;

  const id = document.getElementById("voteProposalId").value;
  if (id === "") { 
    showToast("error", "Enter a proposal ID"); 
    return; 
  }

  try {
    showLoading(`Casting ${support ? "YES" : "NO"} vote...`);
    const tx = await c.voting.vote(Number(id), support);
    await tx.wait();

    logTx("r4", `Voted ${support ? "YES ✓" : "NO ✗"} on proposal #${id}`, tx.hash);

    hideLoading();
    showToast("success", `✅ Vote cast: ${support ? "YES" : "NO"}`);

    await checkResults();

  } catch (err) {
    hideLoading(); 
    handleError("castVote", err);
  }
}

/* CHECK RESULTS */
export async function checkResults() {
  if (!c.voting) return;

  const id = document.getElementById("voteProposalId").value;
  if (id === "") { 
    showToast("error", "Enter a proposal ID"); 
    return; 
  }

  try {
    const [yes, no, passed] = await c.voting.getResults(Number(id));

    const yesNum = Number(yes);
    const noNum  = Number(no);
    const total  = yesNum + noNum;
    const pct    = total > 0 ? Math.round((yesNum / total) * 100) : 0;

    document.getElementById("voteBarWrap").style.display = "block";
    document.getElementById("yesCount").textContent = yesNum;
    document.getElementById("noCount").textContent  = noNum;
    document.getElementById("voteFill").style.width  = pct + "%";
    document.getElementById("voteStatus").textContent =
      `Proposal #${id} — ${total} votes — ${passed ? "✅ PASSING" : "❌ FAILING"}`;

    document.getElementById("voteFill").style.background =
      passed ? "var(--r5)" : "var(--danger)";

  } catch (err) {
    showToast("error", `Proposal #${id} not found`);
  }
}

/* EXECUTE PROPOSAL */
export async function executeProposal() {
  if (!ensureConnected()) return;

  const id = document.getElementById("voteProposalId").value;
  if (id === "") { 
    showToast("error", "Enter a proposal ID"); 
    return; 
  }

  try {
    showLoading("Executing proposal...");
    const tx = await c.voting.execute(Number(id));
    await tx.wait();

    logTx("r4", `Executed proposal #${id}`, tx.hash);

    await readCouncil();

    hideLoading();
    showToast("success", `✅ Proposal #${id} executed`);

  } catch (err) {
    hideLoading(); 
    handleError("executeProposal", err);
  }
}