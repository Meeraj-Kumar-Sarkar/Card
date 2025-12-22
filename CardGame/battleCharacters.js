// battleCharacters.js
// Enhanced battle system supporting both 1v1 and 3v3 gameplay

import { createCharacterInstance } from "./characters.js";

/**
 * Creates a playable team from an array of character IDs.
 */
export function createTeam(characterIds) {
    if (!Array.isArray(characterIds)) {
        throw new Error("createTeam expects an array of character IDs");
    }
    return characterIds.map((id, index) => {
        const character = createCharacterInstance(id);
        character.teamPosition = index; // 0, 1, 2 for team positions
        character.isAlive = true;
        return character;
    });
}

/**
 * Fetch a single character instance.
 */
export function getCharacter(characterId) {
    const character = createCharacterInstance(characterId);
    character.teamPosition = 0;
    character.isAlive = true;
    return character;
}

/**
 * Check if character is alive and can act
 */
export function isCharacterAlive(character) {
    return character.isAlive && character.currentLife > 0;
}

/**
 * Get all alive characters from a team
 */
export function getAliveCharacters(team) {
    return team.filter(char => isCharacterAlive(char));
}

/**
 * Check if entire team is defeated
 */
export function isTeamDefeated(team) {
    return getAliveCharacters(team).length === 0;
}

/**
 * Mark character as dead if life reaches 0
 */
function updateCharacterStatus(character) {
    if (character.currentLife <= 0) {
        character.currentLife = 0;
        character.isAlive = false;
    }
}

/**
 * Centralized damage calculation system
 * Handles: Mana check → Base damage → Defense mitigation → Life reduction
 */
function calculateDamage(attacker, defender, attackData) {
    // Step 1: Validate attacker is alive
    if (!isCharacterAlive(attacker)) {
        return {
            success: false,
            reason: "ATTACKER_DEFEATED",
            damageDealt: 0
        };
    }

    // Step 2: Validate defender is alive
    if (!isCharacterAlive(defender)) {
        return {
            success: false,
            reason: "TARGET_ALREADY_DEFEATED",
            damageDealt: 0
        };
    }

    // Step 3: Validate attack exists
    if (!attackData) {
        return {
            success: false,
            reason: "ATTACK_NOT_AVAILABLE",
            damageDealt: 0
        };
    }

    // Step 4: Check mana requirement
    if (attacker.currentMana < attackData.mana) {
        return {
            success: false,
            reason: "INSUFFICIENT_MANA",
            damageDealt: 0
        };
    }

    // Step 5: Calculate base damage
    const baseDamage = attackData.damage ?? attackData.value ?? 0;

    // Step 6: Apply defense mitigation if active
    let finalDamage = baseDamage;
    let defenseBlocked = 0;

    if (defender.activeDefense) {
        const defenseValue = defender.activeDefense.value ?? 0;
        defenseBlocked = Math.min(baseDamage, defenseValue);
        finalDamage = Math.max(0, baseDamage - defenseValue);
    }

    // Step 7: Deduct mana from attacker
    attacker.currentMana -= attackData.mana;

    // Step 8: Apply damage to defender
    defender.currentLife = Math.max(0, defender.currentLife - finalDamage);

    // Step 9: Update character status
    updateCharacterStatus(defender);

    // Step 10: Clear defense after use
    const wasDefended = !!defender.activeDefense;
    if (defender.activeDefense) {
        defender.activeDefense = null;
    }

    return {
        success: true,
        baseDamage,
        defenseBlocked,
        damageDealt: finalDamage,
        wasDefended,
        attackerManaUsed: attackData.mana,
        targetDefeated: !defender.isAlive
    };
}

/**
 * Light Attack - Low damage, low mana cost
 */
export function performLightAttack(attacker, defender) {
    return calculateDamage(attacker, defender, attacker.attacks?.light);
}

/**
 * Normal Attack - Medium damage, medium mana cost
 */
export function performNormalAttack(attacker, defender) {
    return calculateDamage(attacker, defender, attacker.attacks?.normal);
}

/**
 * Special Attack - High damage, high mana cost
 */
export function performSpecialAttack(attacker, defender) {
    return calculateDamage(attacker, defender, attacker.attacks?.special);
}

/**
 * Area attack - hits all enemies (reduced damage)
 */
export function performAreaAttack(attacker, defenderTeam, attackType = "normal") {
    if (!isCharacterAlive(attacker)) {
        return {
            success: false,
            reason: "ATTACKER_DEFEATED"
        };
    }

    const aliveEnemies = getAliveCharacters(defenderTeam);
    if (aliveEnemies.length === 0) {
        return {
            success: false,
            reason: "NO_VALID_TARGETS"
        };
    }

    // Get attack data and reduce damage by 60% for area effect
    const attackData = attacker.attacks?.[attackType];
    if (!attackData) {
        return {
            success: false,
            reason: "ATTACK_NOT_AVAILABLE"
        };
    }

    // Area attacks cost 1.5x mana
    const areaCost = Math.ceil(attackData.mana * 1.5);
    if (attacker.currentMana < areaCost) {
        return {
            success: false,
            reason: "INSUFFICIENT_MANA"
        };
    }

    // Deduct mana
    attacker.currentMana -= areaCost;

    // Apply reduced damage to all alive enemies
    const results = aliveEnemies.map(enemy => {
        const reducedAttack = {
            ...attackData,
            damage: Math.floor((attackData.damage ?? attackData.value) * 0.6),
            mana: 0 // Mana already deducted
        };
        return calculateDamage(attacker, enemy, reducedAttack);
    });

    return {
        success: true,
        results,
        totalTargets: results.length,
        manaUsed: areaCost
    };
}

/**
 * Activate defense stance
 */
export function activateDefense(character, defenseType) {
    if (!isCharacterAlive(character)) {
        return {
            success: false,
            reason: "CHARACTER_DEFEATED"
        };
    }

    const defenseData = character.defense?.[defenseType];

    if (!defenseData) {
        return {
            success: false,
            reason: "DEFENSE_NOT_AVAILABLE"
        };
    }

    if (character.currentMana < defenseData.mana) {
        return {
            success: false,
            reason: "INSUFFICIENT_MANA"
        };
    }

    character.currentMana -= defenseData.mana;
    character.activeDefense = {
        type: defenseType,
        value: defenseData.value ?? 0
    };

    return {
        success: true,
        defenseType,
        defenseValue: defenseData.value,
        manaUsed: defenseData.mana
    };
}

/**
 * Regenerate mana for a character (e.g., per turn)
 */
export function regenerateMana(character, amount = 5) {
    if (isCharacterAlive(character)) {
        character.currentMana = Math.min(100, character.currentMana + amount);
    }
}

/**
 * Regenerate mana for entire team
 */
export function regenerateTeamMana(team, amount = 5) {
    team.forEach(char => regenerateMana(char, amount));
}