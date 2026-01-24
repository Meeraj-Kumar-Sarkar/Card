import {
    getTeam,
    performLightAttack,
    performNormalAttack,
    performSpecialAttack
} from "./battleCharacters.js";
import { CHARACTER_DEFINITIONS } from "./characters.js";

// --- State Management ---
let player1Team = [];
let player2Team = [];
let turn = 0;
let isBattleActive = false;

// --- DOM Elements ---
const setupScreen = document.getElementById("setup-screen");
const battleArena = document.getElementById("battle-arena");
const logContainer = document.getElementById("log");
const nextTurnBtn = document.getElementById("next-turn-btn");

/**
 * Populates the <select> elements with character IDs from CHARACTER_DEFINITIONS.
 */
function populateSelectors() {
    const selectors = document.querySelectorAll(".char-selector");
    const charIds = Object.keys(CHARACTER_DEFINITIONS);

    selectors.forEach(select => {
        charIds.forEach(id => {
            const option = document.createElement("option");
            option.value = id;
            option.textContent = CHARACTER_DEFINITIONS[id].name;
            select.appendChild(option);
        });
    });
}

/**
 * Initializes team instances based on user selection.
 */
function startBattle() {
    const p1Picks = Array.from(document.querySelectorAll(".p1-pick")).map(s => s.value);
    const p2Picks = Array.from(document.querySelectorAll(".p2-pick")).map(s => s.value);

    // Creates runtime instances using the character blueprints
    player1Team = getTeam(p1Picks[0], p1Picks[1], p1Picks[2]);
    player2Team = getTeam(p2Picks[0], p2Picks[1], p2Picks[2]);

    setupScreen.style.display = "none";
    battleArena.style.display = "block";
    isBattleActive = true;
    updateUI();
    addLog("=== BATTLE START ===");
}

/**
 * Logic for a single turn, ported from terminal logic.
 */
function playTurn() {
    if (!isBattleActive) return;

    const attackingTeam = turn % 2 === 0 ? player1Team : player2Team;
    const defendingTeam = turn % 2 === 0 ? player2Team : player1Team;

    const aliveAttackers = attackingTeam.filter(c => c.currentLife > 0);
    const aliveDefenders = defendingTeam.filter(c => c.currentLife > 0);

    if (aliveAttackers.length === 0 || aliveDefenders.length === 0) {
        endBattle();
        return;
    }

    const attacker = aliveAttackers[0];
    const defender = aliveDefenders[0];

    // Randomly choose an attack type based on available moves
    const move = chooseMove(attacker);
    const result = executeMove(move, attacker, defender);

    addLog(`[Turn ${turn + 1}] ${attacker.name} used ${move} on ${defender.name}`);
    if (result.success) {
        addLog(`Hit! ${result.damageDealt} damage dealt.`);
    } else {
        addLog(`Failed: ${result.reason}`);
    }

    if (defender.currentLife <= 0) {
        addLog(`${defender.name} has been defeated!`);
    }

    turn++;
    updateUI();
    checkWinCondition();
}

/**
 * Helper to map string move types to attack functions.
 */
function executeMove(type, attacker, defender) {
    if (type === "special") return performSpecialAttack(attacker, defender);
    if (type === "normal") return performNormalAttack(attacker, defender);
    return performLightAttack(attacker, defender);
}

function chooseMove(attacker) {
    const moves = ["light", "normal"];
    if (attacker.attacks.special) moves.push("special");
    return moves[Math.floor(Math.random() * moves.length)];
}

function updateUI() {
    renderTeam(player1Team, "p1-display");
    renderTeam(player2Team, "p2-display");
}

function renderTeam(team, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = team.map(c => {
        const hpPercent = (c.currentLife / c.maxLife) * 100;
        const mpPercent = (c.currentMana / 100) * 100; // Assuming 100 is max mana

        return `
            <div class="char-card ${c.currentLife <= 0 ? 'dead' : ''}">
                <strong>${c.name}</strong>
                <div class="stat-text">HP: ${c.currentLife}/${c.maxLife}</div>
                <div class="bar-container">
                    <div class="hp-fill" style="width: ${hpPercent}%"></div>
                </div>
                <div class="stat-text">MP: ${c.currentMana}</div>
                <div class="bar-container">
                    <div class="mp-fill" style="width: ${mpPercent}%"></div>
                </div>
            </div>
        `;
    }).join("");
}

function addLog(msg) {
    const entry = document.createElement("div");
    entry.textContent = msg;
    logContainer.prepend(entry);
}

function checkWinCondition() {
    const p1Alive = player1Team.some(c => c.currentLife > 0);
    const p2Alive = player2Team.some(c => c.currentLife > 0);

    if (!p1Alive || !p2Alive) {
        endBattle(p1Alive ? "Player 1" : "Player 2");
    }
}

function endBattle(winner) {
    isBattleActive = false;
    addLog(`=== ${winner.toUpperCase()} WINS ===`);
    nextTurnBtn.disabled = true;
}

// Event Listeners
document.getElementById("start-btn").addEventListener("click", startBattle);
nextTurnBtn.addEventListener("click", playTurn);
populateSelectors();