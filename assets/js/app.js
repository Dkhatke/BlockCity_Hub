/* ═══════════════════════════════════════════════════════
   app.js — Main Entry (ANVAY BlockCity)
   Handles:
   • Wallet exposure
   • Room function exposure
   • Nav progress tracking
   • Certificate preview updates
═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   IMPORT CORE + ROOMS
───────────────────────────────────────────── */

import { connectWallet } from "./core/connect.js";

import * as room1 from "./rooms/room1.foundation.js";
import * as room2 from "./rooms/room2.treasury.js";
import * as room3 from "./rooms/room3.identity.js";
import * as room4 from "./rooms/room4.council.js";

/* ─────────────────────────────────────────────
   EXPOSE FUNCTIONS TO WINDOW (for HTML onclick)
───────────────────────────────────────────── */

window.connectWallet = connectWallet;

// Expose all room functions globally
Object.assign(window, room1, room2, room3, room4);

/* ─────────────────────────────────────────────
   AUTO UPDATE CERTIFICATE PREVIEW
───────────────────────────────────────────── */

document.addEventListener("input", () => {
  if (window.updateCertificatePreview) {
    window.updateCertificatePreview();
  }
});

/* ─────────────────────────────────────────────
   LOAD ALL ROOM DATA AFTER WALLET CONNECT
───────────────────────────────────────────── */

export async function loadAllData() {

  // Read Room 1 data
  if (room1.readFoundation) await room1.readFoundation();

  // Read Room 2 data
  if (room2.readTreasury) await room2.readTreasury();

  // Read Room 3 data
  if (room3.readIdentity) await room3.readIdentity();

  // Read Room 4 data
  if (room4.readCouncil) await room4.readCouncil();

  // After all reads → update nav progress
  updateNavProgress();
}

/* ─────────────────────────────────────────────
   NAV PROGRESS LOGIC
   Glows dot when each room is completed
───────────────────────────────────────────── */

function updateNavProgress() {

  const r1 = document.getElementById("nav-r1");
  const r2 = document.getElementById("nav-r2");
  const r3 = document.getElementById("nav-r3");
  const r4 = document.getElementById("nav-r4");
  const wrapper = document.querySelector(".nav-progress");

  let completed = 0;

  /* ROOM 1 → If at least 1 law exists */
  const lawCount = parseInt(
    document.getElementById("lawCountDisplay")?.textContent || "0"
  );

  if (lawCount > 0) {
    r1?.classList.add("active");
    completed++;
  }

  /* ROOM 2 → If total supply loaded */
  const supplyText = document.getElementById("totalSupply")?.textContent;

  if (supplyText && supplyText !== "—") {
    r2?.classList.add("active");
    completed++;
  }

  /* ROOM 3 → If at least 1 NFT minted */
  const badgeCount = parseInt(
    document.getElementById("badgeCount")?.textContent || "0"
  );

  if (badgeCount > 0) {
    r3?.classList.add("active");
    completed++;
  }

  /* ROOM 4 → If at least 1 proposal exists */
  const proposalCount = parseInt(
    document.getElementById("proposalCount")?.textContent || "0"
  );

  if (proposalCount > 0) {
    r4?.classList.add("active");
    completed++;
  }

  /* IF ALL 4 ROOMS COMPLETE → Special glow */
  if (completed === 4) {
    wrapper?.classList.add("complete");
  }
}

/* ─────────────────────────────────────────────
   AUTO CALL NAV UPDATE AFTER ANY TX
   (Optional but recommended)
───────────────────────────────────────────── */

window.updateNavProgress = updateNavProgress;