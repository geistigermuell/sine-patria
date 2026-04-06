const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields;

/* -------------------------------------------- */
/*  Base Actor Models                           */
/* -------------------------------------------- */

class ActorDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    // All Actors have resources.
    return {
      resources: new SchemaField({
        health: new SchemaField({
          min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
          value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
          max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
        }),
        power: new SchemaField({
          min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
          value: new NumberField({ required: true, integer: true, min: 0, initial: 1 }),
          max: new NumberField({ required: true, integer: true, min: 0, initial: 3 })
        })
      })
    };
  }
}

class ImportantActorDataModel extends ActorDataModel {
  static defineSchema() {
    // Important Actors have a background and hair color.
    return {
      ...super.defineSchema(),
      background: new SchemaField({
        biography: new HTMLField({ required: true, blank: true }),
        hairColor: new StringField({ required: true, blank: true })
      })
    };
  }
}

/* -------------------------------------------- */
/*  Actor Subtypes                              */
/* -------------------------------------------- */

export class HeroDataModel extends ImportantActorDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      goodness: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 5 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),
      progress: new NumberField({ required: true, integer: true, min: 0, initial: 0, max: 150 })
    };
  }

  static migrateData(source) {
    // Migrate level to progress if old data exists.
    if ( Number.isNumeric(source.level) ) source.progress = source.level * 5;
    return super.migrateData(source);
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    // Determine the hero's current level from progress.
    this.level = Math.floor(this.progress / 5);
  }
}

export class VillainDataModel extends ImportantActorDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      wickedness: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 5 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 100 })
      })
    };
  }
}

export class PawnDataModel extends ActorDataModel {}

/* -------------------------------------------- */
/*  Base Item Model                             */
/* -------------------------------------------- */

class ItemDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      rarity: new StringField({
        required: true,
        blank: false,
        options: ["common", "uncommon", "rare", "legendary"],
        initial: "common"
      }),
      price: new NumberField({ required: true, integer: true, min: 0, initial: 20 })
    };
  }
}

/* -------------------------------------------- */
/*  Item Subtypes                               */
/* -------------------------------------------- */

export class WeaponDataModel extends ItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      damage: new NumberField({ required: true, integer: true, positive: true, initial: 5 })
    };
  }
}

export class SpellDataModel extends ItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      cost: new NumberField({ required: true, integer: true, positive: true, initial: 2 })
    };
  }
}
