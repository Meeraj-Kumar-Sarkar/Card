// characters.js
// This file defines IMMUTABLE character blueprints.
// These must NEVER be mutated directly during gameplay.

const CHARACTER_DEFINITIONS = Object.freeze({
    gladiator: Object.freeze({
        id: "gladiator",
        rarity: "Common",
        power: 120,
        life: 160,
        attacks: {
            light: { damage: 18, mana: 5 },
            normal: { damage: 28, mana: 8 },
            special: null
        },
        defense: {
            normal: { value: 22, mana: 6 },
            hard: { value: 30, mana: 9 }
        }
    }),

    bandits: Object.freeze({
        id: "bandits",
        rarity: "Common",
        power: 110,
        life: 140,
        attacks: {
            light: { damage: 20, mana: 5 },
            normal: { damage: 26, mana: 7 },
            special: { damage: 34, mana: 10 }
        },
        defense: {
            normal: { value: 18, mana: 5 },
            hard: { value: 24, mana: 8 }
        }
    }),

    cannon: Object.freeze({
        id: "cannon",
        rarity: "Common",
        power: 130,
        life: 120,
        attacks: {
            light: { damage: 14, mana: 4 },
            normal: { damage: 40, mana: 10 },
            special: null
        },
        defense: {
            normal: { value: 15, mana: 5 },
            hard: { value: 20, mana: 7 }
        }
    }),

    guillotine: Object.freeze({
        id: "guillotine",
        rarity: "Common",
        power: 125,
        life: 130,
        attacks: {
            light: { damage: 16, mana: 5 },
            normal: { damage: 36, mana: 9 },
            special: { damage: 48, mana: 10 }
        },
        defense: {
            normal: { value: 14, mana: 4 },
            hard: { value: 22, mana: 7 }
        }
    }),

    poison: Object.freeze({
        id: "poison",
        rarity: "Common",
        power: 115,
        life: 135,
        attacks: {
            light: { damage: 12, mana: 4 },
            normal: { damage: 24, mana: 6 },
            special: { damage: 42, mana: 10 }
        },
        defense: {
            normal: { value: 16, mana: 5 },
            hard: { value: 20, mana: 7 }
        }
    }),

    bomb: Object.freeze({
        id: "bomb",
        rarity: "Common",
        power: 115,
        life: 100,
        attacks: {
            light: { value: 10, mana: 3 },
            normal: { value: 50, mana: 10 },
            special: { value: 65, mana: 10 }
        },
        defense: {
            normal: { value: 10, mana: 4 },
            hard: { value: 15, mana: 6 }
        }
    }),

    spearman: Object.freeze({
        id: "spearman",
        rarity: "Common",
        power: 118,
        life: 150,
        attacks: {
            light: { value: 22, mana: 5 },
            normal: { value: 30, mana: 8 },
            special: null
        },
        defense: {
            normal: { value: 20, mana: 6 },
            hard: { value: 26, mana: 8 }
        }
    }),

    shield_bearer: Object.freeze({
        id: "shield_bearer",
        rarity: "Common",
        power: 122,
        life: 180,
        attacks: {
            light: { damage: 14, mana: 4 },
            normal: { damage: 22, mana: 7 },
            special: null
        },
        defense: {
            normal: { value: 28, mana: 7 },
            hard: { value: 36, mana: 10 }
        }
    }),

    sling_archer: Object.freeze({
        id: "sling_archer",
        rarity: "Commmon",
        power: 112,
        life: 140,
        attack: {
            light: { value: 24, mana: 5 },
            normal: { value: 26, mana: 7 },
            special: null
        },
        defense: {
            normal: { value: 16, mana: 5 },
            hard: { value: 22, mana: 7 }
        }
    }),

    foot_soldier: Object.freeze({
        id: "foot_soldier",
        rarity: "Common",
        power: 116,
        life: 155,
        attack: {
            light: { value: 18, mana: 5 },
            normal: { value: 28, mana: 8 },
            special: null
        },
        defense: {
            normal: { value: 20, value: 6 },
            hard: { value: 28, mana: 8 }
        }
    }),

    scout: Object.freeze({
        id: "scout",
        rarity: "Common",
        power: 105,
        life: 130,
        attack: {
            light: { value: 26, mana: 5 },
            normal: { value: 30, mana: 7 },
            special: null
        },
        defense: {
            normal: { value: 14, mana: 4 },
            hard: { value: 20, mana: 7 }
        }
    }),

    torch_unit: Object.freeze({
        id: "touch_unit",
        rarity: "Common",
        power: 120,
        life: 145,
        attack: {
            light: { value: 20, mana: 5 },
            normal: { value: 30, mana: 8 },
            special: { value: 40, mana: 10 }
        },
        defense: {
            normal: { value: 18, mana: 5 },
            hard: { value: 24, mana: 8 }
        }
    })
})

/**
 * Creates a RUNTIME INSTANCE of a character.
 * This is the object the game mutates.
 */
export function createCharacterInstance(characterId) {
    const base = CHARACTER_DEFINITIONS[characterId];

    if (!base) {
        throw new Error(`Character '${characterId}' does not exist.`);
    }

    // Deep clone so runtime changes do NOT affect the blueprint
    return structuredClone({
        ...base,
        currentLife: base.life,
        currentMana: 100, // example starting mana
        statusEffects: [],
        cooldowns: {}
    });
}
