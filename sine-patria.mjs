import { SolarSystemManager } from "./module/solar-system/solar-system-manager.mjs";

/* -------------------------------------------- */
/*  Solar System Scene Hooks                    */
/* -------------------------------------------- */

Hooks.on("canvasReady", async () => {
  if (!canvas.scene?.getFlag("sine-patria", "isSolarSystem")) {
    SolarSystemManager.closeCalendar();
    return;
  }
  await SolarSystemManager.initializeScene();
  SolarSystemManager.drawOrbits();
  SolarSystemManager.openCalendar();
});

/* -------------------------------------------- */
/*  GM Controls — Scene Creation Button         */
/* -------------------------------------------- */

Hooks.on("renderSceneDirectory", (_app, html) => {
  if (!game.user.isGM) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sp-create-solar-system";
  btn.textContent = "☀ Create Solar System Scene";
  btn.addEventListener("click", () => SolarSystemManager.createScene());

  const root = html instanceof HTMLElement ? html : html[0];
  const footer = root.querySelector(".directory-footer")
    ?? root.querySelector(".action-buttons")
    ?? root.querySelector("footer")
    ?? root;

  footer.append(btn);
});
