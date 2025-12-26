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
    }),

    /* =======================
   Common+
======================= */

    knight: Object.freeze({
        id: "knight",
        rarity: "Common+",
        power: 160,
        life: 200,
        attacks: {
            light: { damage: 24, mana: 8 },
            normal: { damage: 36, mana: 10 },
            special: null
        },
        defense: {
            normal: { value: 30, mana: 8 },
            hard: { value: 42, mana: 10 }
        }
    }),

    joker: Object.freeze({
        id: "joker",
        rarity: "Common+",
        power: 150,
        life: 180,
        attacks: {
            light: { damage: 26, mana: 8 },
            normal: { damage: 32, mana: 9 },
            special: { damage: 50, mana: 12 }
        },
        defense: {
            normal: { value: 22, mana: 7 },
            hard: { value: 30, mana: 9 }
        }
    }),

    orc: Object.freeze({
        id: "orc",
        rarity: "Common+",
        power: 170,
        life: 220,
        attacks: {
            light: { damage: 22, mana: 7 },
            normal: { damage: 44, mana: 10 },
            special: { damage: 56, mana: 12 }
        },
        defense: {
            normal: { value: 26, mana: 8 },
            hard: { value: 38, mana: 10 }
        }
    }),

    elvion: Object.freeze({
        id: "elvion",
        rarity: "Common+",
        power: 165,
        life: 190,
        attacks: {
            light: { damage: 28, mana: 8 },
            normal: { damage: 34, mana: 9 },
            special: { damage: 52, mana: 12 }
        },
        defense: {
            normal: { value: 24, mana: 7 },
            hard: { value: 34, mana: 9 }
        }
    }),

    crossbow_knight: Object.freeze({
        id: "crossbow_knight",
        rarity: "Common+",
        power: 168,
        life: 210,
        attacks: {
            light: { damage: 30, mana: 8 },
            normal: { damage: 40, mana: 10 },
            special: null
        },
        defense: {
            normal: { value: 26, mana: 8 },
            hard: { value: 36, mana: 10 }
        }
    }),

    war_drummer: Object.freeze({
        id: "war_drummer",
        rarity: "Common+",
        power: 158,
        life: 195,
        attacks: {
            light: { damage: 18, mana: 7 },
            normal: { damage: 30, mana: 9 },
            special: { damage: 48, mana: 12 }
        },
        defense: {
            normal: { value: 24, mana: 7 },
            hard: { value: 32, mana: 9 }
        }
    }),

    shadow_thief: Object.freeze({
        id: "shadow_thief",
        rarity: "Common+",
        power: 155,
        life: 170,
        attacks: {
            light: { damage: 34, mana: 8 },
            normal: { damage: 28, mana: 9 },
            special: { damage: 54, mana: 12 }
        },
        defense: {
            normal: { value: 20, mana: 6 },
            hard: { value: 28, mana: 8 }
        }
    }),

    flame_adept: Object.freeze({
        id: "flame_adept",
        rarity: "Common+",
        power: 162,
        life: 185,
        attacks: {
            light: { damage: 26, mana: 8 },
            normal: { damage: 32, mana: 9 },
            special: { damage: 60, mana: 12 }
        },
        defense: {
            normal: { value: 22, mana: 7 },
            hard: { value: 30, mana: 9 }
        }
    }),

    /* =======================
       Uncommon
    ======================= */

    trio_knight: Object.freeze({
        id: "trio_knight",
        rarity: "Uncommon",
        power: 220,
        life: 280,
        attacks: {
            light: { damage: 30, mana: 12 },
            normal: { damage: 44, mana: 15 },
            special: { damage: 60, mana: 18 }
        },
        defense: {
            normal: { value: 36, mana: 14 },
            hard: { value: 50, mana: 18 }
        }
    }),

    agela: Object.freeze({
        id: "agela",
        rarity: "Uncommon",
        power: 230,
        life: 300,
        attacks: {
            light: { damage: 28, mana: 12 },
            normal: { damage: 48, mana: 16 },
            special: { damage: 70, mana: 20 }
        },
        defense: {
            normal: { value: 34, mana: 14 },
            hard: { value: 46, mana: 18 }
        }
    }),

    mune: Object.freeze({
        id: "mune",
        rarity: "Uncommon",
        power: 250,
        life: 340,
        attacks: {
            light: { damage: 26, mana: 12 },
            normal: { damage: 52, mana: 18 },
            special: { damage: 76, mana: 22 }
        },
        defense: {
            normal: { value: 42, mana: 16 },
            hard: { value: 60, mana: 20 }
        }
    }),

    iota: Object.freeze({
        id: "iota",
        rarity: "Uncommon",
        power: 235,
        life: 310,
        attacks: {
            light: { damage: 30, mana: 12 },
            normal: { damage: 46, mana: 16 },
            special: { damage: 72, mana: 20 }
        },
        defense: {
            normal: { value: 32, mana: 14 },
            hard: { value: 48, mana: 18 }
        }
    }),

    scith: Object.freeze({
        id: "scith",
        rarity: "Uncommon",
        power: 240,
        life: 320,
        attacks: {
            light: { damage: 32, mana: 12 },
            normal: { damage: 50, mana: 17 },
            special: { damage: 74, mana: 21 }
        },
        defense: {
            normal: { value: 34, mana: 14 },
            hard: { value: 52, mana: 19 }
        }
    }),

    rune_archer: Object.freeze({
        id: "rune_archer",
        rarity: "Uncommon",
        power: 225,
        life: 290,
        attacks: {
            light: { damage: 36, mana: 12 },
            normal: { damage: 44, mana: 15 },
            special: { damage: 68, mana: 20 }
        },
        defense: {
            normal: { value: 30, mana: 13 },
            hard: { value: 44, mana: 17 }
        }
    }),

    war_cleric: Object.freeze({
        id: "war_cleric",
        rarity: "Uncommon",
        power: 245,
        life: 330,
        attacks: {
            light: { damage: 26, mana: 12 },
            normal: { damage: 46, mana: 16 },
            special: { damage: 78, mana: 22 }
        },
        defense: {
            normal: { value: 40, mana: 15 },
            hard: { value: 58, mana: 19 }
        }
    }),

    stone_golem: Object.freeze({
        id: "stone_golem",
        rarity: "Uncommon",
        power: 260,
        life: 380,
        attacks: {
            light: { damage: 20, mana: 12 },
            normal: { damage: 48, mana: 18 },
            special: null
        },
        defense: {
            normal: { value: 50, mana: 16 },
            hard: { value: 70, mana: 22 }
        }
    }),

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
        maxLife: base.life,
        currentLife: base.life,
        currentMana: 100, // example starting mana
        statusEffects: [],
        cooldowns: {}
    });
}
