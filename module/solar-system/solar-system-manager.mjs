import { PLANETS, SCENE } from "./planet-data.mjs";
import { getPlanetPositions, hexToInt } from "./astronomy-utils.mjs";
import { SolarCalendarApp } from "./solar-calendar-app.mjs";

/** Foundry flag namespace / key for storing tile IDs in the scene. */
const FLAG_SCOPE = "sine-patria";
const FLAG_TILES = "solarTileIds";
const SCENE_NAME = "Solar System";
const SCENE_FLAG = "isSolarSystem";

/** Singleton calendar app instance. */
let _calendarApp = null;

export class SolarSystemManager {

  /* -------------------------------------------- */
  /*  Scene Creation                              */
  /* -------------------------------------------- */

  /**
   * Create (or re-open) the Solar System scene.
   * Safe to call multiple times — will not duplicate the scene.
   */
  static async createScene() {
    // Re-use existing scene if present.
    let scene = game.scenes.getName(SCENE_NAME);

    if (!scene) {
      scene = await Scene.create({
        name: SCENE_NAME,
        background: { src: "systems/sine-patria/assets/scenes/space-bckgrnd.jpg" },
        width: SCENE.width,
        height: SCENE.height,
        grid: { type: 0, size: 100 },   // Gridless
        padding: 0,
        darkness: 0,
        tokenVision: false,
        fogExploration: false
      });
      await scene.setFlag(FLAG_SCOPE, SCENE_FLAG, true);
      await SolarSystemManager._createPlanetTiles(scene);
    }

    await scene.view();
  }

  /* -------------------------------------------- */
  /*  Tile Management                             */
  /* -------------------------------------------- */

  /** @private */
  static async _createPlanetTiles(scene) {
    const today = new Date();
    const positions = getPlanetPositions(today);
    const posMap = Object.fromEntries(positions.map(p => [p.id, p]));

    const tilesData = PLANETS.map(planet => {
      const pos = posMap[planet.id] ?? { sceneX: SCENE.sunX, sceneY: SCENE.sunY };
      return {
        texture: { src: `systems/sine-patria/assets/planets/${planet.id}.svg` },
        width: planet.size,
        height: planet.size,
        x: pos.sceneX - planet.size / 2,
        y: pos.sceneY - planet.size / 2,
        overhead: false,
        occlusion: { mode: 0 },
        locked: true,
        flags: { [FLAG_SCOPE]: { planetId: planet.id } }
      };
    });

    const created = await scene.createEmbeddedDocuments("Tile", tilesData);

    // Store tile IDs keyed by planet id.
    const idMap = {};
    for (const tile of created) {
      const planetId = tile.getFlag(FLAG_SCOPE, "planetId");
      if (planetId) idMap[planetId] = tile.id;
    }
    await scene.setFlag(FLAG_SCOPE, FLAG_TILES, idMap);
    await scene.setFlag(FLAG_SCOPE, "calendarDate", today.toISOString().slice(0, 10));
  }

  /* -------------------------------------------- */
  /*  Position Updates                            */
  /* -------------------------------------------- */

  /**
   * Recalculate planet positions for the given date and move tiles accordingly.
   * @param {Date} date
   */
  static async updatePlanetPositions(date) {
    const scene = game.scenes.getName(SCENE_NAME);
    if (!scene) {
      ui.notifications.warn("Solar System scene not found. Create it first.");
      return;
    }

    const positions = getPlanetPositions(date);
    const idMap = scene.getFlag(FLAG_SCOPE, FLAG_TILES) ?? {};
    const updates = [];

    for (const pos of positions) {
      const tileId = idMap[pos.id];
      if (!tileId) continue;
      const planet = PLANETS.find(p => p.id === pos.id);
      if (!planet) continue;
      updates.push({
        _id: tileId,
        x: pos.sceneX - planet.size / 2,
        y: pos.sceneY - planet.size / 2
      });
    }

    if (updates.length) {
      await scene.updateEmbeddedDocuments("Tile", updates);
    }

    // Refresh the orbit overlay if the scene is currently active.
    if (canvas.scene?.id === scene.id) {
      SolarSystemManager.drawOrbits();
    }

    ui.notifications.info(`Solar System updated to ${date.toDateString()}.`);
  }

  /* -------------------------------------------- */
  /*  Orbit Drawing (PIXI)                        */
  /* -------------------------------------------- */

  /**
   * Draw semi-transparent orbit rings onto the canvas.
   * Called after canvasReady and after every position update.
   * Compatible with PIXI v7 (Foundry v13) and PIXI v8 (Foundry v14+).
   */
  static drawOrbits() {
    if (!canvas.ready) return;
    if (!canvas.scene?.getFlag(FLAG_SCOPE, SCENE_FLAG)) return;

    // Remove stale layer.
    const existing = canvas.primary?.getChildByName("sp-orbit-layer");
    if (existing) existing.destroy();

    const g = new PIXI.Graphics();
    g.name = "sp-orbit-layer";

    // Detect PIXI v8 context-style API vs v7 imperative API.
    const isPixiV8 = typeof g.stroke === "function";

    for (const planet of PLANETS) {
      if (!planet.orbit || planet.axis === 0) continue;
      const radius = planet.axis * SCENE.scale;
      const color  = hexToInt(planet.orbit);

      if (isPixiV8) {
        // PIXI v8: draw shape first, then apply stroke style.
        g.setStrokeStyle({ width: 1, color, alpha: 0.35 });
        g.circle(SCENE.sunX, SCENE.sunY, radius);
        g.stroke();
      } else {
        // PIXI v7: set line style before drawing.
        g.lineStyle({ width: 1, color, alpha: 0.35 });
        g.drawCircle(SCENE.sunX, SCENE.sunY, radius);
      }
    }

    // Add above background (index 1) but below tiles and tokens.
    const primary = canvas.primary;
    if (primary) {
      const insertAt = Math.min(1, primary.children.length);
      primary.addChildAt(g, insertAt);
    }
  }

  /* -------------------------------------------- */
  /*  Calendar App                                */
  /* -------------------------------------------- */

  static openCalendar() {
    if (!_calendarApp) _calendarApp = new SolarCalendarApp();
    _calendarApp.render({ force: true });
  }

  static closeCalendar() {
    _calendarApp?.close();
    _calendarApp = null;
  }
}
