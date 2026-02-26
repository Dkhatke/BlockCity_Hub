import { c } from "../core/state.js";
import { ensureConnected, showToast, showLoading, hideLoading, logTx, handleError, setStatValue } from "../core/helpers.js";

/* READ IDENTITY */
export async function readIdentity() {
  if (!c.badge) return;
  try {
    const count = await c.badge.tokenCounter();
    setStatValue("badgeCount", count.toString());
  } catch (err) { 
    console.error("Identity read:", err); 
  }
}

/* MINT BADGE */
export async function mintBadge() {
  if (!ensureConnected()) return;

  const to  = document.getElementById("badgeAddress").value.trim();
  const uri = document.getElementById("badgeURI").value.trim();

  if (!to || !uri) { 
    showToast("error", "Fill in address and IPFS URI"); 
    return; 
  }

  if (!ethers.isAddress(to)) { 
    showToast("error", "Invalid address"); 
    return; 
  }

  if (!uri.startsWith("ipfs://")) { 
    showToast("error", "URI must start with ipfs://"); 
    return; 
  }

  try {
    showLoading("Minting badge NFT...");
    const tx = await c.badge.mintBadge(to, uri);
    await tx.wait();

    logTx("r3", `Minted NFT badge to ${to.slice(0,6)}...`, tx.hash);

    await readIdentity();

    hideLoading();
    showToast("success", "✅ Badge minted!");

    document.getElementById("badgeAddress").value = "";
    document.getElementById("badgeURI").value     = "";

  } catch (err) {
    hideLoading(); 
    handleError("mintBadge", err);
  }
}

/* LOOKUP OWNER */
export async function lookupOwner() {
  if (!c.badge) return;

  const id = document.getElementById("lookupTokenId").value;
  if (id === "") { 
    showToast("error", "Enter a token ID"); 
    return; 
  }

  try {
    const owner = await c.badge.ownerOf(Number(id));

    document.getElementById("lookupResult").style.display = "flex";
    document.getElementById("lookupLabel").textContent    = `Owner of #${id}`;
    document.getElementById("lookupValue").textContent    = owner;

  } catch (err) {
    showToast("error", `Token #${id} not found`);
  }
}

/* LOOKUP URI */
export async function lookupURI() {
  if (!c.badge) return;

  const id = document.getElementById("lookupTokenId").value;
  if (id === "") { 
    showToast("error", "Enter a token ID"); 
    return; 
  }

  try {
    const uri = await c.badge.tokenURI(Number(id));

    document.getElementById("lookupResult").style.display = "flex";
    document.getElementById("lookupLabel").textContent    = `URI of #${id}`;
    document.getElementById("lookupValue").textContent    = uri;

  } catch (err) {
    showToast("error", `Token #${id} not found`);
  }
}