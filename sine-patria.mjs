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
 * Only shown to GMs.
 */
Hooks.on("renderSceneDirectory", (_app, html) => {
  if (!game.user.isGM) return;

  const btn = $(`
    <button type="button" class="sp-create-solar-system">
      ☀ Create Solar System Scene
    </button>
  `);

  btn.on("click", () => SolarSystemManager.createScene());
  html.find(".directory-footer").append(btn);
});
