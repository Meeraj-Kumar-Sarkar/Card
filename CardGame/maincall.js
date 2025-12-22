import {
    createTeam,
    performLightAttack,
    performNormalAttack,
    performSpecialAttack,
    performAreaAttack,
    activateDefense,
    isCharacterAlive,
    isTeamDefeated,
    getAliveCharacters,
    regenerateTeamMana
} from "./battleCharacters.js";

// Game Mode: "1v1" or "3v3"
const GAME_MODE = "3v3"; // Change to "1v1" for single character battles

// Initialize Teams
let playerTeam, enemyTeam;
let currentPlayerCharIndex = 0; // Which player character is acting
let selectedTarget = null; // Which enemy to target
let isGameOver = false;

// DOM Elements
const elements = {
    status: document.getElementById("status"),
    log: document.getElementById("log"),
    playerCards: document.getElementById("player-cards"),
    enemyCards: document.getElementById("enemy-cards"),
    actionButtons: document.getElementById("action-buttons"),
    targetSelection: document.getElementById("target-selection"),
    rematchBtn: document.getElementById("rematch")
};

// Initialize Game
function initGame() {
    if (GAME_MODE === "3v3") {
        playerTeam = createTeam(["guillotine", "spearman", "cannon"]);
        enemyTeam = createTeam(["bomb", "gladiator", "foot_soldier"]);
    } else {
        playerTeam = [createTeam(["guillotine"])[0]];
        enemyTeam = [createTeam(["bomb"])[0]];
    }

    renderTeams();
    updateAllUI();
    elements.status.textContent = `${playerTeam[currentPlayerCharIndex].id}'s Turn! Choose action and target.`;
}

// Render Character Cards
function renderTeams() {
    elements.playerCards.innerHTML = "";
    elements.enemyCards.innerHTML = "";

    playerTeam.forEach((char, idx) => {
        const card = createCharacterCard(char, idx, true);
        elements.playerCards.appendChild(card);
    });

    enemyTeam.forEach((char, idx) => {
        const card = createCharacterCard(char, idx, false);
        elements.enemyCards.appendChild(card);
    });
}

function createCharacterCard(character, index, isPlayer) {
    const card = document.createElement("div");
    card.className = `character-card ${isPlayer ? 'player' : 'enemy'}`;
    card.dataset.index = index;
    card.dataset.isPlayer = isPlayer;

    if (!isCharacterAlive(character)) {
        card.classList.add("defeated");
    }

    if (isPlayer && index === currentPlayerCharIndex && isCharacterAlive(character)) {
        card.classList.add("active");
    }

    card.innerHTML = `
        <div class="char-name">${character.id}</div>
        <div class="char-stats">
            <div class="stat-bar">
                <span>HP: <span class="hp-value">${Math.ceil(character.currentLife)}</span>/${character.maxLife}</span>
                <div class="bar"><div class="bar-fill hp" style="width: ${(character.currentLife / character.maxLife) * 100}%"></div></div>
            </div>
            <div class="stat-bar">
                <span>MP: <span class="mp-value">${Math.ceil(character.currentMana)}</span>/100</span>
                <div class="bar"><div class="bar-fill mp" style="width: ${character.currentMana}%"></div></div>
            </div>
        </div>
        ${character.activeDefense ? `<div class="defense-badge">🛡️ ${character.activeDefense.type}</div>` : ''}
        ${!isCharacterAlive(character) ? '<div class="defeated-badge">💀 DEFEATED</div>' : ''}
    `;

    // Enemy cards are clickable for targeting
    if (!isPlayer) {
        card.addEventListener("click", () => selectTarget(index));
    }

    return card;
}

// Target Selection
function selectTarget(enemyIndex) {
    if (isGameOver || !isCharacterAlive(enemyTeam[enemyIndex])) return;

    selectedTarget = enemyIndex;

    // Update visual selection
    document.querySelectorAll(".character-card.enemy").forEach((card, idx) => {
        card.classList.toggle("selected", idx === enemyIndex);
    });

    elements.status.textContent = `Target: ${enemyTeam[enemyIndex].id}. Choose your action!`;
}

// Update All UI
function updateAllUI() {
    // Re-render cards to update stats
    renderTeams();
}

function addToLog(message) {
    const entry = document.createElement("div");
    entry.textContent = `> ${message}`;
    entry.className = "log-entry";
    elements.log.prepend(entry);
}

// Execute Attack
function executeAttack(attacker, defender, actionType) {
    let result;

    switch (actionType) {
        case "light":
            result = performLightAttack(attacker, defender);
            break;
        case "normal":
            result = performNormalAttack(attacker, defender);
            break;
        case "special":
            result = performSpecialAttack(attacker, defender);
            break;
        default:
            return { success: false, reason: "INVALID_ACTION" };
    }

    if (result.success) {
        if (result.wasDefended) {
            addToLog(
                `${attacker.id} attacked ${defender.id} (${result.baseDamage} dmg) ` +
                `but defense blocked ${result.defenseBlocked}!`
            );
        }
        addToLog(`${attacker.id} dealt ${result.damageDealt} damage to ${defender.id}!`);

        if (result.targetDefeated) {
            addToLog(`💀 ${defender.id} has been defeated!`);
        }

        triggerAnimation(document.querySelector(`.character-card.enemy[data-index="${defender.teamPosition}"]`), actionType);
    }

    return result;
}

// Handle Player Turn
function handlePlayerAction(actionType) {
    if (isGameOver) return;

    const attacker = playerTeam[currentPlayerCharIndex];

    if (!isCharacterAlive(attacker)) {
        addToLog(`${attacker.id} is defeated and cannot act!`);
        return;
    }

    let turnSuccess = false;

    // Defense Action
    if (actionType.startsWith("def_")) {
        const defType = actionType.split("_")[1];
        const result = activateDefense(attacker, defType);

        if (result.success) {
            addToLog(`${attacker.id} activated ${defType} defense (blocks ${result.defenseValue} dmg)`);
            turnSuccess = true;
        } else {
            addToLog(`${attacker.id} failed to defend: ${result.reason}`);
        }
    }
    // Area Attack
    else if (actionType === "area") {
        const result = performAreaAttack(attacker, enemyTeam, "normal");

        if (result.success) {
            addToLog(`${attacker.id} unleashed an area attack hitting ${result.totalTargets} enemies!`);
            result.results.forEach((res, idx) => {
                const target = getAliveCharacters(enemyTeam)[idx];
                if (target) {
                    addToLog(`  → ${target.id} took ${res.damageDealt} damage!`);
                    if (res.targetDefeated) {
                        addToLog(`  💀 ${target.id} defeated!`);
                    }
                }
            });
            turnSuccess = true;
        } else {
            addToLog(`${attacker.id} failed area attack: ${result.reason}`);
        }
    }
    // Single Target Attack
    else {
        if (selectedTarget === null) {
            addToLog("⚠️ Please select a target first!");
            return;
        }

        const defender = enemyTeam[selectedTarget];
        const result = executeAttack(attacker, defender, actionType);

        if (result.success) {
            turnSuccess = true;
        } else {
            addToLog(`${attacker.id} failed ${actionType}: ${result.reason}`);
        }
    }

    if (turnSuccess) {
        updateAllUI();

        if (checkWinCondition()) return;

        // Move to next character or enemy turn
        advanceToNextCharacter();
    }
}

// Advance to Next Character
function advanceToNextCharacter() {
    selectedTarget = null;
    document.querySelectorAll(".character-card.enemy").forEach(card => {
        card.classList.remove("selected");
    });

    // Regenerate small amount of mana per turn
    regenerateTeamMana(playerTeam, 3);

    // Find next alive player character
    let nextIndex = (currentPlayerCharIndex + 1) % playerTeam.length;
    let attempts = 0;

    while (!isCharacterAlive(playerTeam[nextIndex]) && attempts < playerTeam.length) {
        nextIndex = (nextIndex + 1) % playerTeam.length;
        attempts++;
    }

    // If we've cycled through all characters, it's enemy turn
    if (nextIndex <= currentPlayerCharIndex || attempts >= playerTeam.length) {
        elements.status.textContent = "Enemy Team's Turn...";
        toggleControls(false);
        setTimeout(enemyTurn, 1500);
    } else {
        currentPlayerCharIndex = nextIndex;
        elements.status.textContent = `${playerTeam[currentPlayerCharIndex].id}'s Turn!`;
        updateAllUI();
    }
}

// Enemy AI Turn
function enemyTurn() {
    if (isGameOver) return;

    regenerateTeamMana(enemyTeam, 3);

    const aliveEnemies = getAliveCharacters(enemyTeam);
    const alivePlayers = getAliveCharacters(playerTeam);

    if (aliveEnemies.length === 0 || alivePlayers.length === 0) {
        checkWinCondition();
        return;
    }

    // Each alive enemy takes a turn
    aliveEnemies.forEach((enemy, idx) => {
        setTimeout(() => {
            if (isGameOver) return;

            // Simple AI logic
            let action;
            if (enemy.currentLife < 30 && enemy.currentMana >= 10) {
                action = Math.random() > 0.5 ? "def_hard" : "def_normal";
            } else {
                const actions = ["light", "normal", "special"];
                action = actions[Math.floor(Math.random() * actions.length)];
            }

            // Pick random alive player as target
            const aliveTargets = getAliveCharacters(playerTeam);
            const target = aliveTargets[Math.floor(Math.random() * aliveTargets.length)];

            if (action.startsWith("def_")) {
                const defType = action.split("_")[1];
                const result = activateDefense(enemy, defType);
                if (result.success) {
                    addToLog(`${enemy.id} defended with ${defType}!`);
                }
            } else {
                const result = executeAttack(enemy, target, action);
                if (result.success) {
                    triggerAnimation(document.querySelector(`.character-card.player[data-index="${target.teamPosition}"]`), action);
                }
            }

            updateAllUI();
            checkWinCondition();

            // After last enemy acts, return to player
            if (idx === aliveEnemies.length - 1 && !isGameOver) {
                setTimeout(() => {
                    currentPlayerCharIndex = 0;
                    while (!isCharacterAlive(playerTeam[currentPlayerCharIndex])) {
                        currentPlayerCharIndex = (currentPlayerCharIndex + 1) % playerTeam.length;
                    }
                    elements.status.textContent = `${playerTeam[currentPlayerCharIndex].id}'s Turn!`;
                    toggleControls(true);
                    updateAllUI();
                }, 500);
            }
        }, idx * 1000);
    });
}

// Check Win Condition
function checkWinCondition() {
    if (isTeamDefeated(enemyTeam)) {
        isGameOver = true;
        elements.status.textContent = "🎉 VICTORY! Player Team Wins!";
        toggleControls(false);
        elements.rematchBtn.disabled = false;
        return true;
    }

    if (isTeamDefeated(playerTeam)) {
        isGameOver = true;
        elements.status.textContent = "💀 DEFEAT! Enemy Team Wins!";
        toggleControls(false);
        elements.rematchBtn.disabled = false;
        return true;
    }

    return false;
}

function toggleControls(enabled) {
    const buttons = elements.actionButtons.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = !enabled);
}

function triggerAnimation(card, type) {
    if (!card) return;
    const className = type === "special" ? "shake-heavy" : "shake-light";
    card.classList.add(className);
    setTimeout(() => card.classList.remove(className), 500);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Action buttons
    document.getElementById("light-btn")?.addEventListener("click", () => handlePlayerAction("light"));
    document.getElementById("normal-btn")?.addEventListener("click", () => handlePlayerAction("normal"));
    document.getElementById("special-btn")?.addEventListener("click", () => handlePlayerAction("special"));
    document.getElementById("area-btn")?.addEventListener("click", () => handlePlayerAction("area"));
    document.getElementById("def-normal-btn")?.addEventListener("click", () => handlePlayerAction("def_normal"));
    document.getElementById("def-hard-btn")?.addEventListener("click", () => handlePlayerAction("def_hard"));

    // Rematch
    elements.rematchBtn?.addEventListener("click", () => window.location.reload());

    initGame();
});