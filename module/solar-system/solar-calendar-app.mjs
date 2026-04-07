import { SolarSystemManager } from "./solar-system-manager.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Floating calendar widget that drives the solar system scene.
 * Uses ApplicationV2 (Foundry v13+).
 * Opens automatically when the Solar System scene is viewed.
 *
 * All buttons use data-action — no form submission is involved,
 * which avoids AppV2 re-render side-effects that can disrupt the Foundry UI.
 */
export class SolarCalendarApp extends HandlebarsApplicationMixin(ApplicationV2) {

  /** @override */
  static DEFAULT_OPTIONS = {
    id: "sine-patria-solar-calendar",
    window: {
      title: "Solar System — Date",
      minimizable: true,
      resizable: false
    },
    position: {
      width: 340
    },
    actions: {
      today:  SolarCalendarApp._onToday,
      step:   SolarCalendarApp._onStep,
      update: SolarCalendarApp._onUpdate
    }
  };

  /** @override */
  static PARTS = {
    form: {
      template: "systems/sine-patria/templates/solar-calendar.hbs"
    }
  };

  /* -------------------------------------------- */
  /*  Data                                        */
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(_options = {}) {
    const stored = canvas.scene?.getFlag("sine-patria", "calendarDate");
    return {
      date: stored ?? SolarCalendarApp._todayString()
    };
  }

  /* -------------------------------------------- */
  /*  Actions                                     */
  /* -------------------------------------------- */

  /**
   * Read the current date input and update planet positions.
   * @param {PointerEvent}  event
   * @param {HTMLElement}   _target
   */
  static async _onUpdate(event, _target) {
    const input = this.element.querySelector('[name="date"]');
    if (!input) return;
    const dateStr = input.value;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      ui.notifications.warn("Invalid date.");
      return;
    }
    await canvas.scene?.update(
      { "flags.sine-patria.calendarDate": dateStr },
      { render: false }
    );
    await SolarSystemManager.updatePlanetPositions(date);
  }

  /**
   * Set the date input to today.
   * @param {PointerEvent}  event
   * @param {HTMLElement}   _target
   */
  static async _onToday(event, _target) {
    const input = this.element.querySelector('[name="date"]');
    if (input) input.value = SolarCalendarApp._todayString();
  }

  /**
   * Step the date input by a number of days.
   * @param {PointerEvent}  event
   * @param {HTMLElement}   target  — must have data-delta attribute
   */
  static async _onStep(event, target) {
    const delta = parseInt(target.dataset.delta, 10);
    const input = this.element.querySelector('[name="date"]');
    if (!input) return;
    const d = new Date(input.value);
    if (isNaN(d.getTime())) return;
    d.setDate(d.getDate() + delta);
    input.value = d.toISOString().slice(0, 10);
  }

  /* -------------------------------------------- */
  /*  Helpers                                     */
  /* -------------------------------------------- */

  static _todayString() {
    return new Date().toISOString().slice(0, 10);
  }
}
