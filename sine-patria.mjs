import { SystemActor, SystemItem } from "./module/documents.mjs";
import {
  HeroDataModel,
  VillainDataModel,
  PawnDataModel,
  WeaponDataModel,
  SpellDataModel
} from "./module/data-models.mjs";
import { SolarSystemManager } from "./module/solar-system/solar-system-manager.mjs";

/* -------------------------------------------- */
/*  System Initialisation                       */
/* -------------------------------------------- */

Hooks.once("init", () => {
  console.log("Sine Patria | Initializing system");

  // Configure custom Document implementations.
  CONFIG.Actor.documentClass = SystemActor;
  CONFIG.Item.documentClass = SystemItem;

  // Configure System Data Models.
  CONFIG.Actor.dataModels = {
    hero: HeroDataModel,
    villain: VillainDataModel,
    pawn: PawnDataModel
  };
  CONFIG.Item.dataModels = {
    weapon: WeaponDataModel,
    spell: SpellDataModel
  };

  // Configure trackable attributes for token bars.
  CONFIG.Actor.trackableAttributes = {
    hero: {
      bar: ["resources.health", "resources.power", "goodness"],
      value: ["progress"]
    },
    villain: {
      bar: ["resources.health", "resources.power", "wickedness"],
      value: []
    },
    pawn: {
      bar: ["resources.health", "resources.power"],
      value: []
    }
  };

  // Pre-load any shared Handlebars partials here if needed in future.
});

/* -------------------------------------------- */
/*  Solar System Scene Hooks                    */
/* -------------------------------------------- */

/** Draw orbit rings when the Solar System scene becomes active. */
Hooks.on("canvasReady", () => {
  SolarSystemManager.drawOrbits();
});

/** Open the calendar widget when entering the Solar System scene. */
Hooks.on("canvasReady", () => {
  if (canvas.scene?.getFlag("sine-patria", "isSolarSystem")) {
    SolarSystemManager.openCalendar();
  } else {
    SolarSystemManager.closeCalendar();
  }
});

/* -------------------------------------------- */
/*  GM Controls — Scene Creation Button         */
/* -------------------------------------------- */

/**
 * Adds a "Create Solar System" button to the Scene Directory sidebar.
 * Only shown to GMs. Compatible with Foundry v13/v14 (AppV2 sidebar).
 */
Hooks.on("renderSceneDirectory", (_app, html) => {
  if (!game.user.isGM) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sp-create-solar-system";
  btn.textContent = "☀ Create Solar System Scene";
  btn.addEventListener("click", () => SolarSystemManager.createScene());

  // html is a plain HTMLElement in v14 AppV2, jQuery object in older versions.
  const root = html instanceof HTMLElement ? html : html[0];

  // Try known footer selectors across Foundry versions.
  const footer = root.querySelector(".directory-footer")
    ?? root.querySelector(".action-buttons")
    ?? root.querySelector("footer")
    ?? root;

  footer.append(btn);
});
