import { getTeam, performLightAttack, performNormalAttack, performSpecialAttack } from "./battleCharacters.js";
import { CHARACTER_DEFINITIONS } from "./characters.js";

// --- Configuration ---
const BOARD_SIZE = 7;
const MANA_REGEN = 25;

// --- State ---
let board = []; // 1D array of 49 cells (null or Piece Object)
let p1Team = [];
let p2Team = [];
let p1ToPlace = [];
let p2ToPlace = [];
let turn = 1; // 1 for P1, 2 for P2
let gameState = "SELECT"; // SELECT, PLACE_P1, PLACE_P2, PLAY, COMBAT_RESOLVE
let selectedIndex = -1; // Index of board currently selected
let combatState = { attacker: null, defender: null, attackType: null };

// --- DOM Elements ---
const setupScreen = document.getElementById("setup-screen");
const gridBoard = document.getElementById("grid-board");
const p1Roster = document.getElementById("p1-roster");
const p2Roster = document.getElementById("p2-roster");
const gameMsg = document.getElementById("game-message");
const combatModal = document.getElementById("combat-modal");

// --- Initialization ---

function init() {
    populateSelectors();
    createGrid();
    document.getElementById("start-setup-btn").addEventListener("click", startPlacementPhase);
}

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
 * Creates the visual grid with Chess-like coordinates (A-G, 1-7).
 * The grid is visually 8x8, but logically maps to a 7x7 array (indices 0-48).
 */
function createGrid() {
    gridBoard.innerHTML = "";
    board = new Array(BOARD_SIZE * BOARD_SIZE).fill(null);

    const columns = ["", "A", "B", "C", "D", "E", "F", "G"];
    const rows = ["", "1", "2", "3", "4", "5", "6", "7"];

    // 1. Create the Top Header Row (Corner + A-G)
    columns.forEach(colLabel => {
        const labelDiv = document.createElement("div");
        labelDiv.className = "grid-element label-cell";
        labelDiv.textContent = colLabel;
        gridBoard.appendChild(labelDiv);
    });

    // 2. Create the Game Rows
    for (let r = 0; r < BOARD_SIZE; r++) {
        // a. Left Row Label (1-7)
        const rowLabel = document.createElement("div");
        rowLabel.className = "grid-element label-cell";
        rowLabel.textContent = rows[r + 1]; // +1 because index 0 is empty string above
        gridBoard.appendChild(rowLabel);

        // b. The 7 Game Cells for this row
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement("div");
            cell.classList.add("grid-element", "cell");

            // Calculate the logical index (0-48) based on row/col
            const logicalIndex = r * BOARD_SIZE + c;

            cell.dataset.index = logicalIndex;
            cell.addEventListener("click", () => handleCellClick(logicalIndex));

            // Store reference in a way we can easily find it later? 
            // Actually, renderBoard re-scans DOM or we rely on logic mapping.
            // Since our existing logic uses logicIndex, we rely on dataset.index

            gridBoard.appendChild(cell);
        }
    }
}

// --- Setup Phase ---

function startPlacementPhase() {
    const p1Picks = Array.from(document.querySelectorAll(".p1-pick")).map(s => s.value);
    const p2Picks = Array.from(document.querySelectorAll(".p2-pick")).map(s => s.value);

    // Create Logic Instances
    p1Team = getTeam(p1Picks[0], p1Picks[1], p1Picks[2]).map(c => ({ ...c, owner: 1, id: Math.random() }));
    p2Team = getTeam(p2Picks[0], p2Picks[1], p2Picks[2]).map(c => ({ ...c, owner: 2, id: Math.random() }));

    // Queue for placement
    p1ToPlace = [...p1Team];
    p2ToPlace = [...p2Team];

    setupScreen.style.display = "none";
    gridBoard.classList.remove("hidden");
    gameMsg.classList.remove("hidden");

    gameState = "PLACE_P1";
    updateMessage("Player 1: Click top row (Row 1) to place units.");
    updateStatsUI();
}

// --- Interaction Logic ---

function handleCellClick(index) {
    if (gameState === "PLACE_P1") handlePlacement(index, 1);
    else if (gameState === "PLACE_P2") handlePlacement(index, 2);
    else if (gameState === "PLAY") handlePlayInput(index);
}

function handlePlacement(index, player) {
    const row = Math.floor(index / BOARD_SIZE);

    // Validate Rows (P1 Top, P2 Bottom)
    if (player === 1 && row !== 0) return alert("P1 must place in top row.");
    if (player === 2 && row !== BOARD_SIZE - 1) return alert("P2 must place in bottom row.");
    if (board[index] !== null) return alert("Cell occupied.");

    const unit = player === 1 ? p1ToPlace.shift() : p2ToPlace.shift();
    board[index] = unit;
    renderBoard();

    if (player === 1 && p1ToPlace.length === 0) {
        gameState = "PLACE_P2";
        updateMessage("Player 2: Click bottom row (Row 7) to place units.");
    } else if (player === 2 && p2ToPlace.length === 0) {
        gameState = "PLAY";
        turn = 1;
        updateMessage("BATTLE START! Player 1's Turn.");
    }
}

function handlePlayInput(index) {
    const clickedUnit = board[index];
    const cells = document.querySelectorAll(".cell");

    // Case 1: Select own unit
    if (clickedUnit && clickedUnit.owner === turn) {
        selectedIndex = index;
        renderBoard(); // Clear previous highlights
        cells[index].classList.add("selected");

        // Highlight Moves
        const moves = getValidMoves(index);
        moves.forEach(idx => cells[idx].classList.add("valid-move"));
        return;
    }

    // Case 2: Move to empty spot
    if (selectedIndex !== -1 && board[index] === null) {
        if (isAdjacent(selectedIndex, index)) {
            movePiece(selectedIndex, index);
            return;
        }
    }

    // Deselect if clicking elsewhere invalid
    selectedIndex = -1;
    renderBoard();
}

// --- Gameplay Logic ---

function getValidMoves(index) {
    // 1 Block orthogonal
    const moves = [];
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);

    const candidates = [
        { r: y - 1, c: x }, { r: y + 1, c: x },
        { r: y, c: x - 1 }, { r: y, c: x + 1 }
    ];

    candidates.forEach(pos => {
        if (pos.r >= 0 && pos.r < BOARD_SIZE && pos.c >= 0 && pos.c < BOARD_SIZE) {
            const idx = pos.r * BOARD_SIZE + pos.c;
            if (board[idx] === null) moves.push(idx); // Can only move to empty
        }
    });
    return moves;
}

function isAdjacent(idx1, idx2) {
    const x1 = idx1 % BOARD_SIZE, y1 = Math.floor(idx1 / BOARD_SIZE);
    const x2 = idx2 % BOARD_SIZE, y2 = Math.floor(idx2 / BOARD_SIZE);
    return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

function movePiece(from, to) {
    board[to] = board[from];
    board[from] = null;
    selectedIndex = -1;
    renderBoard();

    // Check for combat
    const enemy = getAdjacentEnemy(to, board[to].owner);
    if (enemy) {
        initiateCombat(board[to], enemy);
    } else {
        endTurn();
    }
}

function getAdjacentEnemy(index, owner) {
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);
    const adj = [
        (y - 1) * BOARD_SIZE + x, (y + 1) * BOARD_SIZE + x,
        y * BOARD_SIZE + (x - 1), y * BOARD_SIZE + (x + 1)
    ];

    for (let i of adj) {
        if (i >= 0 && i < board.length && board[i] && board[i].owner !== owner) {
            return board[i]; // Return first found enemy
        }
    }
    return null;
}

function endTurn() {
    // Check Win
    const p1Alive = p1Team.some(c => c.currentLife > 0);
    const p2Alive = p2Team.some(c => c.currentLife > 0);

    if (!p1Alive) return alert("PLAYER 2 WINS!");
    if (!p2Alive) return alert("PLAYER 1 WINS!");

    turn = turn === 1 ? 2 : 1;
    updateMessage(`Player ${turn}'s Turn`);
    renderBoard(); // Clean highlights
}

// --- Combat System ---

function initiateCombat(attacker, defender) {
    combatState = { attacker, defender, attackType: null };

    // Show Modal
    combatModal.classList.remove("hidden");
    document.getElementById("combat-title").textContent = `${attacker.name} encounters ${defender.name}`;
    document.getElementById("combat-stage-1").classList.remove("hidden");
    document.getElementById("combat-stage-2").classList.add("hidden");
    document.getElementById("combat-log").innerHTML = "";

    // Generate Attack Buttons
    const btnContainer = document.getElementById("attack-options");
    btnContainer.innerHTML = "";

    const moves = ["light", "normal"];
    if (attacker.attacks.special) moves.push("special");

    moves.forEach(m => {
        const btn = document.createElement("button");
        btn.textContent = `Use ${m.toUpperCase()}`;
        btn.onclick = () => {
            combatState.attackType = m;
            document.getElementById("combat-stage-1").classList.add("hidden");
            document.getElementById("combat-stage-2").classList.remove("hidden");
        };
        btnContainer.appendChild(btn);
    });
}

// Bind Reaction Buttons (only once)
document.querySelectorAll("#combat-modal button[data-reaction]").forEach(btn => {
    btn.addEventListener("click", (e) => resolveCombat(e.target.dataset.reaction));
});

function resolveCombat(reaction) {
    const { attacker, defender, attackType } = combatState;
    let log = "";
    let damage = 0;

    // 1. Calculate Base Damage based on type (Simulated calls)
    let result = { success: true, damageDealt: 0 };
    if (attackType === 'special') result = performSpecialAttack(attacker, defender);
    else if (attackType === 'normal') result = performNormalAttack(attacker, defender);
    else result = performLightAttack(attacker, defender);

    damage = result.damageDealt;

    // 2. Apply Reaction Modifiers
    if (reaction === "defend") {
        damage = Math.floor(damage * 0.5);
        log += `Defender braced! Damage reduced to ${damage}. `;
    } else if (reaction === "evade") {
        const chance = Math.random();
        if (chance > 0.5) {
            damage = 0;
            log += `Defender Dodged completely! `;
        } else {
            damage = Math.floor(damage * 1.2); // Critical hit if dodge fails
            log += `Dodge failed! Critical hit received. `;
        }
    } else if (reaction === "counter") {
        // Defender takes full damage, but deals 50% back
        const counterDmg = Math.floor(damage * 0.5);
        attacker.currentLife -= counterDmg;
        log += `Counter! Attacker took ${counterDmg} recoil. `;
    }

    // 3. Apply Damage
    defender.currentLife -= damage;
    log += `${attacker.name} hit for ${damage}. `;

    if (defender.currentLife <= 0) {
        defender.currentLife = 0;
        log += `${defender.name} was defeated!`;
        // Remove from board
        const idx = board.indexOf(defender);
        if (idx > -1) board[idx] = null;
    }

    if (attacker.currentLife <= 0) {
        attacker.currentLife = 0;
        const idx = board.indexOf(attacker);
        if (idx > -1) board[idx] = null;
    }

    // 4. Show Result and Close
    document.getElementById("combat-log").textContent = log;

    setTimeout(() => {
        combatModal.classList.add("hidden");
        updateStatsUI();
        renderBoard();
        endTurn();
    }, 2500);
}

// --- UI Rendering ---

function updateMessage(msg) {
    gameMsg.textContent = msg;
    gameMsg.style.color = turn === 1 ? "var(--p1-primary)" : "var(--p2-primary)";
}

function renderBoard() {
    // Select only the playable cells, ignoring the labels
    const cells = document.querySelectorAll(".cell");

    // We can now iterate 0 to 48 safely because querySelectorAll(".cell") 
    // returns exactly the 49 game cells in order.
    for (let i = 0; i < cells.length; i++) {
        const unit = board[i];

        // Reset cell state
        cells[i].innerHTML = "";
        cells[i].className = "grid-element cell"; // Reset to base classes

        // Re-apply selection state if this index is selected
        if (selectedIndex === i) {
            cells[i].classList.add("selected");
        }

        // Render Unit if present
        if (unit) {
            const el = document.createElement("div");
            el.className = `piece p${unit.owner}`;
            el.textContent = unit.name.substring(0, 2).toUpperCase();

            // Add visual health indicator ring (optional advanced polish)
            // el.style.borderColor = `rgba(255, 255, 255, ${unit.currentLife / unit.maxLife})`;

            cells[i].appendChild(el);
        }
    }
}

function updateStatsUI() {
    renderRoster(p1Team, p1Roster, "p1");
    renderRoster(p2Team, p2Roster, "p2");
}

function renderRoster(team, container, prefix) {
    container.innerHTML = team.map(c => `
        <div class="mini-card ${prefix} ${c.currentLife <= 0 ? 'dead' : ''}">
            <strong>${c.name}</strong>
            <div class="bar"><div class="fill-hp" style="width:${(c.currentLife / c.maxLife) * 100}%"></div></div>
            <small>${c.currentLife}/${c.maxLife} HP</small>
        </div>
    `).join("");
}

// Start
init();