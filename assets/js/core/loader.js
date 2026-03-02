/* ═══════════════════════════════════════════════════════
   loader.js — Loads All Room Data After Wallet Connect
   Ensures UI stays synchronized with blockchain
═══════════════════════════════════════════════════════ */

import { readFoundation } from "../rooms/room1.foundation.js";
import { readTreasury }   from "../rooms/room2.treasury.js";
import { readIdentity }   from "../rooms/room3.identity.js";
import { readCouncil }    from "../rooms/room4.council.js";


export async function loadAllData() {

  // Load all modules in sequence
  await readFoundation();
  await readTreasury();
  await readIdentity();
  await readCouncil();

  // Update navbar progress after loading
  if (window.updateNavProgress) {
    window.updateNavProgress();
  }
}