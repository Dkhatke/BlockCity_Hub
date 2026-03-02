/* ═══════════════════════════════════════════════════════
   connect.js — Wallet Connection & Contract Initialization
   Network: Sepolia
   Purpose: 
   - Connect MetaMask
   - Switch network
   - Initialize Ethers provider + signer
   - Create contract instances
   - Load all blockchain data
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


/* ═══════════════════════════════════════════════════════
   CONNECT WALLET FUNCTION
   This is the entry point of the dApp
═══════════════════════════════════════════════════════ */

export async function connectWallet() {

  // Check if MetaMask exists in browser
  if (!window.ethereum) {
    showToast("error", "MetaMask not found");
    return;
  }

  try {

    /* STEP 1 — Force Sepolia Network */
    showLoading("Switching to Sepolia...");

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }]   // Sepolia Chain ID
    });

    /* STEP 2 — Request Wallet Access */
    await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    /* STEP 3 — Create Provider & Signer */
    const _provider = new ethers.BrowserProvider(window.ethereum);
    const _signer   = await _provider.getSigner();
    const _address  = await _signer.getAddress();

    // Save globally
    setProvider(_provider);
    setSigner(_signer);
    setUserAddress(_address);

    /* STEP 4 — Create Contract Instances */
    const contracts = {

      base: new ethers.Contract(
        CONTRACTS.base.address,
        CONTRACTS.base.abi,
        _signer
      ),

      token: new ethers.Contract(
        CONTRACTS.token.address,
        CONTRACTS.token.abi,
        _signer
      ),

      badge: new ethers.Contract(
        CONTRACTS.badge.address,
        CONTRACTS.badge.abi,
        _signer
      ),

      voting: new ethers.Contract(
        CONTRACTS.voting.address,
        CONTRACTS.voting.abi,
        _signer
      )
    };

    // Save contracts globally
    setContracts(contracts);

    /* STEP 5 — Update UI */
    const short = _address.slice(0,6) + "..." + _address.slice(-4);

    document.getElementById("walletDisplay").textContent  = short;
    document.getElementById("networkDisplay").textContent = "Sepolia";
    document.getElementById("connectBtn").textContent     = short;
    document.getElementById("connectBtn").classList.add("connected");

    /* STEP 6 — Load Blockchain Data */
    showLoading("Loading blockchain data...");
    await loadAllData();

    hideLoading();
    showToast("success", "Connected to Sepolia");

  } catch (err) {

    hideLoading();
    console.error("Connection error:", err);
    showToast("error", "Connection failed");

  }
}