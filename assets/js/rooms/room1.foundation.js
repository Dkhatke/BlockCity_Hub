import { c } from "../core/state.js";
import {
  ensureConnected,
  showToast,
  showLoading,
  hideLoading,
  logTx,
  handleError,
  setStatValue
} from "../core/helpers.js";

/* READ FOUNDATION DATA */
export async function readFoundation() {

  if (!c.base) return;

  try {

    const name  = await c.base.cityName();
    const owner = await c.base.owner();
    const laws  = await c.base.lawCount();

    setStatValue("cityNameDisplay", name || "Not set");
    setStatValue("ownerDisplay", owner.slice(0,6)+"..."+owner.slice(-4));
    setStatValue("lawCountDisplay", laws.toString());

    if (name) {
      const hero = document.getElementById("heroTitle");
      const nav = document.getElementById("cityNameNav");

      if (hero) hero.textContent = name.toUpperCase();
      if (nav) nav.textContent = name.toUpperCase();
    }

    if (window.updateNavProgress) window.updateNavProgress();

  } catch (err) {
    console.error("Foundation read error:", err);
  }
}

/* UPDATE CITY NAME */
export async function updateCityName() {

  if (!ensureConnected()) return;

  const name = document.getElementById("newCityName").value.trim();
  if (!name) {
    showToast("error", "Enter a name first");
    return;
  }

  try {

    showLoading("Updating city name...");

    const tx = await c.base.setCityName(name); // ✅ FIXED
    await tx.wait();

    logTx("r1", `City renamed to "${name}"`, tx.hash);

    await readFoundation();

    hideLoading();
    showToast("success", "City updated");

  } catch (err) {
    hideLoading();
    handleError("updateCityName", err);
  }
}

/* ADD LAW */
export async function addLaw() {

  if (!ensureConnected()) return;

  const law = document.getElementById("newLaw")?.value.trim();
  if (!law) {
    showToast("error", "Enter law text");
    return;
  }

  try {
    showLoading("Adding law...");

    const tx = await c.base.addLaw(law);
    await tx.wait();

    logTx("r1", "Law added", tx.hash);

    document.getElementById("newLaw").value = "";
    await readFoundation();

    hideLoading();
    showToast("success", "Law added");
  } catch (err) {
    hideLoading();
    handleError("addLaw", err);
  }
}

/* VIEW LAW */
export async function viewLaw() {
  if (!c.base) return;

  const idValue = document.getElementById("lawIndex")?.value;
  if (idValue === "" || idValue === null || idValue === undefined) {
    showToast("error", "Enter law index");
    return;
  }

  try {
    const law = await c.base.getLaw(Number(idValue));
    setStatValue("lawOutput", law || "No law found");
  } catch (err) {
    handleError("viewLaw", err);
  }
}
