/* ═══════════════════════════════════════════════════════
   state.js — Global Blockchain State Manager
   Stores provider, signer, contracts & user address
═══════════════════════════════════════════════════════ */

export let provider;      // Ethers provider
export let signer;        // Wallet signer
export let c = {};        // All contract instances
export let userAddress;   // Connected wallet address


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