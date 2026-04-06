import { PLANETS, SCENE } from "./planet-data.mjs";

/**
 * Returns scene (pixel) coordinates for every body in PLANETS for a given Date.
 * Requires window.Astronomy (astronomy-engine library) to be loaded.
 *
 * @param {Date} date
 * @returns {{ id: string, sceneX: number, sceneY: number }[]}
 */
export function getPlanetPositions(date) {
  if (typeof Astronomy === "undefined") {
    ui.notifications?.error("Sine Patria | astronomy-engine library not found. See lib/SETUP.md.");
    return [];
  }

  const time = Astronomy.MakeTime(date);
  const results = [];

  for (const planet of PLANETS) {
    if (!planet.body) {
      // The Sun is always at scene centre.
      results.push({ id: planet.id, sceneX: SCENE.sunX, sceneY: SCENE.sunY });
      continue;
    }

    try {
      const vec = Astronomy.HelioVector(Astronomy.Body[planet.body], time);
      // Ecliptic x = toward vernal equinox (screen right)
      // Ecliptic y = 90° east in plane (screen up → negate)
      const sceneX = SCENE.sunX + vec.x * SCENE.scale;
      const sceneY = SCENE.sunY - vec.y * SCENE.scale;
      results.push({ id: planet.id, sceneX, sceneY });
    } catch (err) {
      console.warn(`Sine Patria | Could not compute position for ${planet.id}:`, err);
    }
  }

  return results;
}

/**
 * Convert a CSS hex colour string to a PIXI-compatible integer.
 * @param {string} hex  e.g. "#4A90D9"
 * @returns {number}
 */
export function hexToInt(hex) {
  return parseInt(hex.replace("#", "0x"), 16);
}
