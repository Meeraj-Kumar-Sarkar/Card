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
export function performLightAttack(attacker, defender) {
    const atk = attacker.attacks.light;
    // console.log(atk);


    if (!atk) {
        throw new Error(`${attacker.id} has no light attack`);
    }

    if (attacker.currentMana < atk.mana) {
        return false; // insufficient mana
    }

    attacker.currentMana -= atk.mana;
    defender.currentLife -= atk.value;

    if (defender.currentLife < 0) {
        defender.currentLife = 0;
    }

    return true;
}
