/* ═══════════════════════════════════════════════════════
   connect.js — Wallet Connection (Sepolia)
═══════════════════════════════════════════════════════ */

import CONTRACTS from "../config/contracts.js";
import {
  setProvider,
  setSigner,
  setContracts,
  setUserAddress
} from "./state.js";

import { loadAllData } from "./loader.js";
import { showToast, showLoading, hideLoading } from "./helpers.js";

/* CONNECT WALLET */
export async function connectWallet() {

  if (!window.ethereum) {
    showToast("error", "MetaMask not found");
    return;
  }

  try {

    showLoading("Switching to Sepolia...");

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }]
    });

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const _provider = new ethers.BrowserProvider(window.ethereum);
    const _signer   = await _provider.getSigner();
    const _address  = await _signer.getAddress();

    setProvider(_provider);
    setSigner(_signer);
    setUserAddress(_address);

    /* CREATE CONTRACT INSTANCES */
    const contracts = {
      base:   new ethers.Contract(CONTRACTS.base.address,   CONTRACTS.base.abi,   _signer),
      token:  new ethers.Contract(CONTRACTS.token.address,  CONTRACTS.token.abi,  _signer),
      badge:  new ethers.Contract(CONTRACTS.badge.address,  CONTRACTS.badge.abi,  _signer),
      voting: new ethers.Contract(CONTRACTS.voting.address, CONTRACTS.voting.abi, _signer)
    };

    setContracts(contracts);

    /* UPDATE UI */
    const short = _address.slice(0,6) + "..." + _address.slice(-4);

    document.getElementById("walletDisplay").textContent  = short;
    document.getElementById("networkDisplay").textContent = "Sepolia";
    document.getElementById("connectBtn").textContent     = short;
    document.getElementById("connectBtn").classList.add("connected");

    showLoading("Loading blockchain data...");

    await loadAllData();   // 🔥 THIS NOW TRIGGERS NAV UPDATE

    hideLoading();
    showToast("success", "Connected to Sepolia");

  } catch (err) {
    hideLoading();
    console.error("Connection error:", err);
    showToast("error", "Connection failed");
  }
}