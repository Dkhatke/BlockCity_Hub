/* ═══════════════════════════════════════════════════════
   loader.js — Loads All Room Data
═══════════════════════════════════════════════════════ */

import { readFoundation } from "../rooms/room1.foundation.js";
import { readTreasury }   from "../rooms/room2.treasury.js";
import { readIdentity }   from "../rooms/room3.identity.js";
import { readCouncil }    from "../rooms/room4.council.js";

export async function loadAllData() {

  await readFoundation();
  await readTreasury();
  await readIdentity();
  await readCouncil();

  // 🔥 Trigger Nav Progress Update
  if (window.updateNavProgress) {
    window.updateNavProgress();
  }
}