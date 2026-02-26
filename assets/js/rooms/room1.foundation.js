import { c } from "../core/state.js";
import { ensureConnected, showToast, showLoading, hideLoading, logTx, handleError, setStatValue } from "../core/helpers.js";

/* READ FOUNDATION */
export async function readFoundation() {
  if (!c.base) return;
  try {
    const name = await c.base.cityName();
    const owner = await c.base.owner();
    setStatValue("cityNameDisplay", name || "Not set");
    setStatValue("ownerDisplay", owner.slice(0,6)+"..."+owner.slice(-4));
    if (name) {
      document.getElementById("heroTitle").textContent   = name.toUpperCase();
      document.getElementById("cityNameNav").textContent = name.toUpperCase();
    }
  } catch (err) { console.error("Foundation read:", err); }
}

/* UPDATE CITY NAME */
export async function updateCityName() {
  if (!ensureConnected()) return;

  const name = document.getElementById("newCityName").value.trim();
  if (!name) { showToast("error", "Enter a name first"); return; }

  try {
    showLoading("Sending transaction...");
    const tx = await c.base.setCity(name);
    showLoading("Waiting for confirmation...");
    await tx.wait();

    logTx("r1", `Set city name to "${name}"`, tx.hash);

    await readFoundation();

    hideLoading();
    showToast("success", `✅ City name updated to "${name}"`);
    document.getElementById("newCityName").value = "";

  } catch (err) {
    hideLoading(); 
    handleError("updateCityName", err);
  }
}