// battleCharacters.js
// This file consumes IMMUTABLE character blueprints
// and works only with RUNTIME INSTANCES.

import { createCharacterInstance } from "./characters.js";

/**
 * Creates a playable team from an array of character IDs.
 * Example: ["spearman", "cannon", "gladiator"]
 */
export function createTeam(characterIds) {
    if (!Array.isArray(characterIds)) {
        throw new Error("createTeam expects an array of character IDs");
    }

    return characterIds.map(id => createCharacterInstance(id));
}

/**
 * Fetch a single character instance.
 * Example: getCharacter("spearman")
 */
export function getCharacter(characterId) {
    return createCharacterInstance(characterId);
}

/**
 * Example combat operation
 * Demonstrates how instance data is safely mutable
 */

// Light Attack
export function performLightAttack(attacker, defender) {
    const atk = attacker.attacks.light;
    // console.log(atk);


    if (!atk) {
        return {
            success: false,
            reason: "NO_LIGHT_ATTACK"
        }
    }

    if (attacker.currentMana < atk.mana) {
        return {
            success: false,
            reason: "INSUFFICIENT_MANA"
        } // insufficient mana
    }

    attacker.currentMana -= atk.mana;
    defender.currentLife -= atk.damage ?? atk.value;

    if (defender.currentLife < 0) {
        defender.currentLife = 0;
    }

    return {
        success: true,
        damageDealt: atk.damage ?? atk.value
    };
}

// Normal Attack
export function performNormalAttack(attacker, defender) {
    const atk = attacker.attacks.normal;
    // console.log(atk);


    if (!atk) {
        return {
            success: false,
            reason: "NO_NORMAL_ATTACK"
        };
    }

    if (attacker.currentMana < atk.mana) {
        return {
            success: false,
            reason: "INSUFFICIENT_MANA"
        } // insufficient mana
    }

    attacker.currentMana -= atk.mana;
    defender.currentLife -= atk.damage ?? atk.value;

    if (defender.currentLife < 0) {
        defender.currentLife = 0;
    }

    return {
        success: true,
        damageDealt: atk.damage ?? atk.value
    };
}

// Special Attack
export function performSpecialAttack(attacker, defender) {
    const atk = attacker.attacks.special;

    if (!atk) {
        return {
            success: false,
            reason: "NO_SPECIAL_ATTACK"
        };
    }

    if (attacker.currentMana < atk.mana) {
        return {
            success: false,
            reason: "INSUFFICIENT_MANA"
        };
    }

    attacker.currentMana -= atk.mana;
    defender.currentLife -= atk.damage ?? atk.value;

    if (defender.currentLife < 0) {
        defender.currentLife = 0;
    }

    return {
        success: true,
        damageDealt: atk.damage ?? atk.value
    };
}
