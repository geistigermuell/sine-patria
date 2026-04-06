/* -------------------------------------------- */
/*  Custom Actor                                */
/* -------------------------------------------- */

export class SystemActor extends Actor {
  /**
   * Apply damage to this actor, with a minimum of 1.
   * @param {number} damage  The raw damage amount.
   */
  async applyDamage(damage) {
    damage = Math.round(Math.max(1, damage));

    const { value } = this.system.resources.health;
    await this.update({ "system.resources.health.value": value - damage });

    await ChatMessage.implementation.create({
      content: `${this.name} took ${damage} damage!`
    });
  }

  prepareDerivedData() {
    super.prepareDerivedData();

    // Clamp health within the valid range.
    const { health } = this.system.resources;
    health.value = Math.clamp(health.value, health.min, health.max);
  }
}

/* -------------------------------------------- */
/*  Custom Item                                 */
/* -------------------------------------------- */

export class SystemItem extends Item {
  /**
   * Whether this item costs nothing.
   * @type {boolean}
   */
  get isFree() {
    return this.system.price < 1;
  }
}
