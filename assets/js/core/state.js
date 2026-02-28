/* ═══════════════════════════════════════════════════════
   state.js — Global Blockchain State
═══════════════════════════════════════════════════════ */

export let provider;
export let signer;
export let c = {};          // contracts
export let userAddress = null;

/* SETTERS */

export function setProvider(p) {
  provider = p;
}

export function setSigner(s) {
  signer = s;
}

export function setContracts(obj) {
  c = obj;
}

export function setUserAddress(addr) {
  userAddress = addr;
}