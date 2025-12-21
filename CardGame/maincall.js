import { getCharacter, performLightAttack, performNormalAttack, performSpecialAttack } from "./battleCharacters.js";

// 1. Initialize Characters
const player = getCharacter("guillotine");
const enemy = getCharacter("bomb");
let isGameOver = false;

// 2. Select DOM Elements
const elements = {
    p1Name: document.getElementById("p1-name"),
    p1Life: document.getElementById("p1-life"),
    p1Mana: document.getElementById("p1-mana"),
    p2Name: document.getElementById("p2-name"),
    p2Life: document.getElementById("p2-life"),
    p2Mana: document.getElementById("p2-mana"),
    status: document.getElementById("status"),
    log: document.getElementById("log"),
    playerCard: document.querySelector(".card.player"),
    enemyCard: document.querySelector(".card.enemy"),
    playerActions: document.querySelectorAll(".player .actions button"),
    rematchBtn: document.getElementById("rematch")
};

// 3. Game Initialization
function initGame() {
    elements.p1Name.textContent = player.id;
    elements.p2Name.textContent = enemy.id;
    updateUI();
    elements.status.textContent = "Your Turn! Choose to Attack or Defend.";
}

// 4. Update UI with Mana Clamping
function updateUI() {
    // Ensure mana never exceeds 100
    player.currentMana = Math.min(player.currentMana, 100);
    enemy.currentMana = Math.min(enemy.currentMana, 100);

    // Update Text
    elements.p1Life.textContent = Math.max(0, Math.ceil(player.currentLife));
    elements.p1Mana.textContent = Math.ceil(player.currentMana);
    elements.p2Life.textContent = Math.max(0, Math.ceil(enemy.currentLife));
    elements.p2Mana.textContent = Math.ceil(enemy.currentMana);
}

function addToLog(message) {
    const entry = document.createElement("div");
    entry.textContent = `> ${message}`;
    elements.log.prepend(entry);
}

// 5. Combat and Defense Logic
function applyDamage(attacker, defender, actionType) {
    let result;
    // Perform the base attack logic
    switch (actionType) {
        case "light": result = performLightAttack(attacker, defender); break;
        case "normal": result = performNormalAttack(attacker, defender); break;
        case "special": result = performSpecialAttack(attacker, defender); break;
    }

    if (result && result.success) {
        let finalDamage = result.damageDealt;

        // Apply Defense Mitigation: Life -= (Atk - DefValue)
        if (defender.activeDefense) {
            const defValue = defender.activeDefense.value;
            finalDamage = Math.max(0, finalDamage - defValue);

            // Revert the raw damage applied by battleCharacters.js and apply mitigated damage
            defender.currentLife += result.damageDealt;
            defender.currentLife -= finalDamage;

            addToLog(`${defender.id} blocked with ${defender.activeDefense.type} defense!`);
            defender.activeDefense = null; // Defense is consumed after one attack
        }

        return { success: true, damage: finalDamage };
    }
    return result;
}

// 6. Main Action Handler
async function handleTurn(actionType, isPlayerTurn) {
    if (isGameOver) return;

    const attacker = isPlayerTurn ? player : enemy;
    const defender = isPlayerTurn ? enemy : player;
    let turnSuccess = false;

    // Defense Logic: If player chooses defense, they can't attack
    if (actionType.startsWith("def_")) {
        const defType = actionType.split("_")[1]; // 'normal' or 'hard'
        const defStats = attacker.defense[defType];

        if (attacker.currentMana >= defStats.mana) {
            attacker.currentMana -= defStats.mana;
            attacker.activeDefense = { type: defType, value: defStats.value };
            addToLog(`${attacker.id} prepared ${defType} defense.`);
            turnSuccess = true;
        } else {
            addToLog(`${attacker.id} has insufficient mana to defend!`);
        }
    } else {
        // Attack Logic
        const combat = applyDamage(attacker, defender, actionType);
        if (combat.success) {
            addToLog(`${attacker.id} dealt ${combat.damage} damage!`);
            triggerAnimation(isPlayerTurn ? elements.enemyCard : elements.playerCard, actionType);
            turnSuccess = true;
        } else {
            addToLog(`${attacker.id} failed ${actionType}: ${combat.reason}`);
        }
    }

    if (turnSuccess) {
        updateUI();
        if (checkWinCondition()) return; // Stop immediately if someone died

        if (isPlayerTurn) {
            toggleControls(false);
            elements.status.textContent = "Enemy is thinking...";
            setTimeout(enemyTurn, 1000);
        }
    }
}

// 7. Enemy AI Turn
function enemyTurn() {
    if (isGameOver) return;

    // Simple AI: Defend if low life, otherwise attack
    let choice;
    if (enemy.currentLife < 30 && enemy.currentMana >= 10) {
        choice = Math.random() > 0.5 ? "def_hard" : "def_normal";
    } else {
        const attacks = ["light", "normal", "special"];
        choice = attacks[Math.floor(Math.random() * attacks.length)];
    }

    handleTurn(choice, false);
    if (!isGameOver) {
        elements.status.textContent = "Your Turn!";
        toggleControls(true);
    }
}

// 8. Win Condition and UI State
function checkWinCondition() {
    let winner = null;
    if (enemy.currentLife <= 0) winner = player.id;
    else if (player.currentLife <= 0) winner = enemy.id;

    if (winner) {
        isGameOver = true;
        elements.status.textContent = `GAME OVER - ${winner.toUpperCase()} WINS!`;
        toggleControls(false);
        elements.rematchBtn.disabled = false;
        return true;
    }
    return false;
}

function toggleControls(enabled) {
    elements.playerActions.forEach(btn => btn.disabled = !enabled);
}

function triggerAnimation(card, type) {
    const className = type === "special" ? "shake-heavy" : "shake-light";
    card.classList.add(className);
    setTimeout(() => card.classList.remove(className), 500);
}

// 9. Event Listeners
elements.playerActions.forEach(btn => {
    btn.addEventListener("click", () => {
        handleTurn(btn.getAttribute("data-action"), true);
    });
});

elements.rematchBtn.addEventListener("click", () => window.location.reload());

initGame();