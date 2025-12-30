// All game logic now runs on the server via a simple REST API.
// This client only renders UI and calls the server to perform actions.

let gameId = null;
let state = null;
let selectedTarget = null;
const GAME_MODE = "3v3"; // "1v1" supported by server

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

async function apiInit(mode = "3v3") {
    try {
        const res = await fetch('/api/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode })
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('apiInit failed', res.status, text);
            return { success: false, reason: text || `HTTP_${res.status}` };
        }

        try {
            return await res.json();
        } catch (err) {
            const raw = await res.text();
            console.error('apiInit invalid JSON:', raw);
            return { success: false, reason: 'INVALID_JSON', raw };
        }
    } catch (err) {
        console.error('apiInit network error', err);
        return { success: false, reason: 'NETWORK_ERROR' };
    }
}

async function apiAction(actionType, targetIndex) {
    try {
        const res = await fetch('/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId, actionType, targetIndex })
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('apiAction failed', res.status, text);
            return { success: false, reason: text || `HTTP_${res.status}` };
        }

        try {
            return await res.json();
        } catch (err) {
            const raw = await res.text();
            console.error('apiAction invalid JSON:', raw);
            return { success: false, reason: 'INVALID_JSON', raw };
        }
    } catch (err) {
        console.error('apiAction network error', err);
        return { success: false, reason: 'NETWORK_ERROR' };
    }
}

async function apiState() {
    const res = await fetch(`/api/state?gameId=${encodeURIComponent(gameId)}`);
    return res.json();
}

// Start or restart a game
async function startNewGame() {
    const resp = await apiInit(GAME_MODE);
    if (!resp.success) {
        console.error('Failed to init game', resp);
        return;
    }
    gameId = resp.gameId;
    state = resp.state;
    selectedTarget = null;

    elements.rematchBtn.disabled = true;
    renderAll();
}

function isCharacterAlive(character) {
    return character && character.isAlive && character.currentLife > 0;
}

function renderAll() {
    renderTeams();
    renderLog();
    updateStatus();
}

function renderTeams() {
    elements.playerCards.innerHTML = '';
    elements.enemyCards.innerHTML = '';

    (state.playerTeam || []).forEach((char, idx) => {
        const card = createCharacterCard(char, idx, true);
        elements.playerCards.appendChild(card);
    });

    (state.enemyTeam || []).forEach((char, idx) => {
        const card = createCharacterCard(char, idx, false);
        elements.enemyCards.appendChild(card);
    });
}

function createCharacterCard(character, index, isPlayer) {
    const card = document.createElement('div');
    card.className = `uiverse-card ${isPlayer ? 'player' : 'enemy'}`;

    // Check if character has active defense and add class for CSS glow
    if (character.activeDefense) {
        card.classList.add('has-defense');
    }

    card.dataset.index = index;
    card.dataset.isPlayer = isPlayer;

    if (!isCharacterAlive(character)) card.classList.add('defeated');
    if (!isPlayer && selectedTarget === index) card.classList.add('selected');
    if (isPlayer && index === state.currentPlayerCharIndex && isCharacterAlive(character)) card.classList.add('active');

    // ... rest of your innerHTML generation ...
    const hpPercent = character.maxLife ? Math.ceil((character.currentLife / character.maxLife) * 100) : 0;

    card.innerHTML = `
        <div class="top-section">
            <div class="border"></div>
            <div class="icons">
                <div class="logo">
                   <span class="char-id-tag">${character.id.substring(0, 2).toUpperCase()}</span>
                </div>
                <div class="status-icon">
                    ${character.activeDefense ? '🛡️' : '⚡'}
                </div>
            </div>
            <div class="card-name-overlay">${character.id}</div>
        </div>
        <div class="bottom-section">
            <span class="title">UNIT_STATISTICS</span>
            <div class="row row1">
                <div class="item">
                    <span class="big-text">${Math.ceil(character.currentLife)}</span>
                    <span class="regular-text">HEALTH</span>
                </div>
                <div class="item">
                    <span class="big-text">${Math.ceil(character.currentMana)}</span>
                    <span class="regular-text">MANA</span>
                </div>
                <div class="item">
                    <span class="big-text">${hpPercent}%</span>
                    <span class="regular-text">INTEGRITY</span>
                </div>
            </div>
        </div>
        ${!isCharacterAlive(character) ? '<div class="defeated-badge">OFFLINE</div>' : ''}
    `;

    if (!isPlayer) {
        card.addEventListener('click', () => selectTarget(index));
    }

    return card;
}

function selectTarget(enemyIndex) {
    if (!state || state.isGameOver) return;
    const enemy = state.enemyTeam?.[enemyIndex];
    if (!isCharacterAlive(enemy)) return;

    selectedTarget = enemyIndex;
    document.querySelectorAll('.character-card.enemy').forEach((card, idx) => card.classList.toggle('selected', idx === enemyIndex));
    elements.status.textContent = `Target: ${enemy.id}. Choose your action!`;
}

function renderLog() {
    elements.log.innerHTML = '';
    // server.log has newest first; we'll render newest at top
    (state.log || []).forEach(msg => {
        const entry = document.createElement('div');
        entry.textContent = `> ${msg}`;
        entry.className = 'log-entry';
        elements.log.prepend(entry);
    });
}

function updateStatus() {
    if (!state) return;
    if (state.isGameOver) {
        elements.status.textContent = state.log[0] || 'Game Over';
        toggleControls(false);
        elements.rematchBtn.disabled = false;
    } else {
        const cur = state.playerTeam?.[state.currentPlayerCharIndex];
        elements.status.textContent = cur ? `${cur.id}'s Turn! Choose action and target.` : 'Player Turn';
        toggleControls(true);
        elements.rematchBtn.disabled = true;
    }
}

function toggleControls(enabled) {
    const buttons = elements.actionButtons.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = !enabled);
}

function triggerAnimation(card, type) {
    if (!card) return;
    const className = type === 'special' ? 'shake-heavy' : 'shake-light';
    card.classList.add(className);
    setTimeout(() => card.classList.remove(className), 500);
}

// Send player action to server and apply returned state
async function handlePlayerAction(actionType) {
    if (!state || state.isGameOver) return;

    // For single target actions ensure target selected
    if (['light', 'normal', 'special'].includes(actionType) && selectedTarget == null) {
        elements.status.textContent = '⚠️ Please select a target first!';
        return;
    }

    const targetIndex = ['light', 'normal', 'special'].includes(actionType) ? selectedTarget : undefined;

    const resp = await apiAction(actionType, targetIndex);
    if (!resp.success) {
        elements.status.textContent = resp.reason || 'Action failed';
        // refresh state if available
        if (resp.state) { state = resp.state; renderAll(); }
        return;
    }

    // Update local state and re-render
    state = resp.state;
    selectedTarget = null;
    renderAll();

    // Animate player's target for single-target actions
    if (resp.result && resp.result.success && targetIndex != null) {
        const card = document.querySelector(`.character-card.enemy[data-index="${targetIndex}"]`);
        triggerAnimation(card, actionType);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('light-btn')?.addEventListener('click', () => handlePlayerAction('light'));
    document.getElementById('normal-btn')?.addEventListener('click', () => handlePlayerAction('normal'));
    document.getElementById('special-btn')?.addEventListener('click', () => handlePlayerAction('special'));
    document.getElementById('area-btn')?.addEventListener('click', () => handlePlayerAction('area'));
    document.getElementById('def-normal-btn')?.addEventListener('click', () => handlePlayerAction('def_normal'));
    document.getElementById('def-hard-btn')?.addEventListener('click', () => handlePlayerAction('def_hard'));

    elements.rematchBtn?.addEventListener('click', () => startNewGame());

    startNewGame();
});