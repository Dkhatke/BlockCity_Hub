import CONTRACTS from "../config/contracts.js";
import { 
  provider,
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
    showToast("error", "⚠️ MetaMask not found — please install it");
    return;
  }

  try {
    showLoading("Switching to Sepolia network...");

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }]
      });
    } catch (switchErr) {
      showToast("error", "Please switch MetaMask to Sepolia manually");
      hideLoading(); 
      return;
    }

    showLoading("Requesting wallet access...");

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const _provider = new ethers.BrowserProvider(window.ethereum);
    const _signer   = await _provider.getSigner();
    const _address  = await _signer.getAddress();

    setProvider(_provider);
    setSigner(_signer);
    setUserAddress(_address);

    showLoading("Connecting to contracts...");

    const contracts = {
      base:   new ethers.Contract(CONTRACTS.base.address,   CONTRACTS.base.abi,   _signer),
      token:  new ethers.Contract(CONTRACTS.token.address,  CONTRACTS.token.abi,  _signer),
      badge:  new ethers.Contract(CONTRACTS.badge.address,  CONTRACTS.badge.abi,  _signer),
      voting: new ethers.Contract(CONTRACTS.voting.address, CONTRACTS.voting.abi, _signer)
    };

    setContracts(contracts);

    await checkContractHealth(_provider);

    const short = _address.slice(0,6) + "..." + _address.slice(-4);

    document.getElementById("walletDisplay").textContent  = short;
    document.getElementById("walletDisplay").className    = "wstat-value green";
    document.getElementById("networkDisplay").textContent = "Sepolia";
    document.getElementById("networkDisplay").className   = "wstat-value green";
    document.getElementById("connectBtn").textContent     = short;
    document.getElementById("connectBtn").classList.add("connected");

    showLoading("Loading blockchain data...");
    await loadAllData();

    hideLoading();
    showToast("success", "✅ Connected to Sepolia");

  } catch (err) {
    hideLoading();
    console.error("Connection error:", err);
    showToast("error", "Connection failed — check console");
  }
}

/* CHECK CONTRACT HEALTH */
async function checkContractHealth(_provider) {

  const checks = [
    { key:"base",   dot:"dot-r1" },
    { key:"token",  dot:"dot-r2" },
    { key:"badge",  dot:"dot-r3" },
    { key:"voting", dot:"dot-r4" }
  ];

  for (const { key, dot } of checks) {
    try {
      const code = await _provider.getCode(CONTRACTS[key].address);
      if (code !== "0x") {
        document.getElementById(dot).classList.add("live");
      }
    } catch (_) {}
  }
}