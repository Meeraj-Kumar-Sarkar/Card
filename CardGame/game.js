document.addEventListener('DOMContentLoaded', () => {
    // Utilities
    function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    // DOM
    const backMain = document.getElementById('backMain');
    const useSavedDeck = document.getElementById('useSavedDeck');
    const autoFillDeck = document.getElementById('autoFillDeck');
    const startGame = document.getElementById('startGame');
    const heroSelect = document.getElementById('heroSelect');

    const mulliganArea = document.getElementById('mulliganArea');
    const mulliganHand = document.getElementById('mulliganHand');
    const confirmMulligan = document.getElementById('confirmMulligan');

    const boardArea = document.getElementById('boardArea');
    const playerHandEl = document.getElementById('playerHand');
    const playerBoardEl = document.getElementById('playerBoard');
    const enemyBoardEl = document.getElementById('enemyBoard');
    const gameLog = document.getElementById('gameLog');
    const endTurnBtn = document.getElementById('endTurnBtn');
    const playerHealthEl = document.getElementById('playerHealth');
    const enemyHealthEl = document.getElementById('enemyHealth');
    const turnOwnerEl = document.getElementById('turnOwner');
    const playerManaEl = document.getElementById('playerMana');
    const playerCrystalsEl = document.getElementById('playerCrystals');

    backMain.addEventListener('click', () => { window.location.href = 'new-game.html'; });

    // deck preference buttons
    if (useSavedDeck) useSavedDeck.addEventListener('click', () => {
        deckPreference = 'saved';
        useSavedDeck.classList.add('selected');
        autoFillDeck.classList.remove('selected');
        addLog('Deck preference: saved');
    });
    if (autoFillDeck) autoFillDeck.addEventListener('click', () => {
        deckPreference = 'auto';
        autoFillDeck.classList.add('selected');
        useSavedDeck.classList.remove('selected');
        addLog('Deck preference: auto-fill');
    });

    // Game state
    let player = null; let enemy = null; let activePlayer = null; // 'player' or 'enemy'
    let playerDeck = []; let enemyDeck = [];
    let fatigue = { player: 0, enemy: 0 };
    let deckPreference = 'either'; // 'either' | 'saved' | 'auto'
    let gameOver = false;
    let lastDrawnCard = null;

    // Build a 30-card deck from savedDeck, collection or random based on deckPreference
    function buildDeckFromSavedOrCollection() {
        const saved = JSON.parse(localStorage.getItem('savedDeck') || 'null');
        let d = [];
        if (deckPreference === 'saved') {
            if (saved && saved.length) d = saved.slice();
            else { alert('No saved deck found. Falling back to collection/random fill.'); }
        } else if (deckPreference === 'auto') {
            // intentionally start empty and fill randomly
            d = [];
        } else {
            if (saved && saved.length >= 1) d = saved.slice();
            // fallback: use collection
            if (d.length < 30) {
                const collection = JSON.parse(localStorage.getItem('collection') || '[]');
                if (collection && collection.length) d = d.concat(collection);
            }
        }

        // If still not 30, fill random from window.CARDS
        const all = (window.CARDS || []).map(c => c.id);
        while (d.length < 30) {
            const pick = all[Math.floor(Math.random() * all.length)];
            d.push(pick);
        }
        // trim to 30
        d = d.slice(0, 30);
        shuffle(d);
        return d;
    }

    // Card stats (simple mapping from tier)
    const COST_MAP = { 'Mwah': 1, 'Common': 2, 'Uncommon': 3, 'Uncommon+': 3, 'Uncommon++': 4, 'Uncommon+++': 4, 'Rare': 4, 'Rare+': 5, 'Rare++': 6, 'Epic': 6, 'Epic+': 7, 'Legendary': 7, 'Legendary+': 8, 'Supreme': 9, 'Supreme+': 9, 'S': 8, 'S+': 9, 'SS': 10, 'SSS': 10, 'SSSS': 10, 'Extra': 10 };
    function costFromTier(t) { return COST_MAP[t] || 3; }
    function statsFromCard(card) { const cost = costFromTier(card.tier); return { cost, atk: Math.max(1, Math.floor(cost * 0.8)), hp: Math.max(1, Math.floor(cost * 1.2)) }; }

    // Map tier -> CSS variable color for visual accents
    function rarityColor(tier) {
        if (!tier) return 'var(--primary)';
        if (tier.includes('Uncommon')) return 'var(--uncommon)';
        if (tier.includes('Epic')) return 'var(--epic)';
        if (tier.includes('Rare')) return 'var(--rare)';
        if (tier.includes('Legendary') || tier.includes('Supreme') || tier.startsWith('S')) return 'var(--legendary)';
        return 'var(--common)';
    }

    function addLog(msg) { const el = document.createElement('div'); el.textContent = msg; gameLog.prepend(el); }

    // Draw with fatigue handling
    function drawFor(p) {
        const d = (p === 'player') ? playerDeck : enemyDeck;
        const hand = (p === 'player') ? player.hand : enemy.hand;
        if (d.length === 0) {
            fatigue[p] = (fatigue[p] || 0) + 1;
            const dmg = fatigue[p];
            if (p === 'player') { player.health -= dmg; playerHealthEl.textContent = player.health; addLog(`Fatigue ${dmg} to you`); }
            else { enemy.health -= dmg; enemyHealthEl.textContent = enemy.health; addLog(`Fatigue ${dmg} to enemy`); }
            checkWin();
            return;
        }
        const id = d.shift(); hand.push(id);
        if (p === 'player') lastDrawnCard = id; // mark to animate draw
        addLog(`${p === 'player' ? 'You' : 'Enemy'} drew: ${(window.CARDS.find(c => c.id === id) || { name: id }).name}`);
    }

    // Simple play card from hand
    function playCardFromHand(p, idx) {
        const state = (p === 'player') ? player : enemy;
        const hand = state.hand;
        const id = hand[idx]; if (!id) return;
        const card = window.CARDS.find(c => c.id === id) || { id, name: id, tier: 'Common' };
        const s = statsFromCard(card);
        if (state.currentMana < s.cost) { if (p === 'player') addLog('Not enough mana'); return; }
        state.currentMana -= s.cost; updateManaDisplay();
        // Put minion on board
        const min = { id: card.id, name: card.name, atk: s.atk, hp: s.hp, canAttack: false, justPlayed: true };
        state.board.push(min);
        hand.splice(idx, 1);
        addLog(`${p === 'player' ? 'You' : 'Enemy'} played ${card.name} (${s.cost})`);
        renderAll();
    }

    function updateManaDisplay() {
        if (!player) return;
        playerManaEl.textContent = player.currentMana;
        playerCrystalsEl.textContent = player.manaCrystals;
    }

    function renderAll() {
        // player hand
        playerHandEl.innerHTML = '';
        player.hand.forEach((id, i) => {
            const card = window.CARDS.find(c => c.id === id) || { name: id, tier: 'Common' };
            const s = statsFromCard(card);

            const el = document.createElement('div');
            el.className = 'hand-card playHand card-visual';

            const costEl = document.createElement('div');
            costEl.className = 'card-cost';
            costEl.textContent = s.cost;
            costEl.style.borderColor = rarityColor(card.tier);

            const body = document.createElement('div'); body.className = 'card-body-mini';
            const name = document.createElement('div'); name.className = 'card-name'; name.textContent = card.name;
            const tier = document.createElement('div'); tier.className = 'card-tier'; tier.textContent = card.tier;
            const stats = document.createElement('div'); stats.className = 'card-stats'; stats.innerHTML = `<span class="atk">${s.atk}</span> / <span class="hp">${s.hp}</span>`;
            body.appendChild(name); body.appendChild(tier); body.appendChild(stats);

            el.appendChild(costEl); el.appendChild(body);

            el.addEventListener('click', () => { if (activePlayer === 'player') playCardFromHand('player', i); });
            playerHandEl.appendChild(el);

            // animate recently drawn card
            if (id === lastDrawnCard) {
                el.classList.add('drawn');
                setTimeout(() => { el.classList.remove('drawn'); lastDrawnCard = null; }, 700);
            }
        });
        // player board
        playerBoardEl.innerHTML = '';
        player.board.forEach((m, i) => {
            const el = document.createElement('div'); el.className = 'minion card-visual-board';
            const atk = document.createElement('div'); atk.className = 'stat-bubble atk'; atk.textContent = m.atk;
            const name = document.createElement('div'); name.className = 'minion-name'; name.textContent = m.name + (m.canAttack ? '' : ' (summoning)');
            const hp = document.createElement('div'); hp.className = 'stat-bubble hp'; hp.textContent = m.hp;
            el.appendChild(atk); el.appendChild(name); el.appendChild(hp);
            el.addEventListener('click', () => { if (activePlayer === 'player' && m.canAttack) playerAttackFrom(i); });
            playerBoardEl.appendChild(el);

            // play animation for minions that were just played
            if (m.justPlayed) { el.classList.add('just-played'); setTimeout(() => { el.classList.remove('just-played'); delete m.justPlayed; }, 650); }
        });
        // enemy board
        enemyBoardEl.innerHTML = '';
        enemy.board.forEach((m, i) => {
            const el = document.createElement('div'); el.className = 'minion enemy-minion card-visual-board';
            const atk = document.createElement('div'); atk.className = 'stat-bubble atk'; atk.textContent = m.atk;
            const name = document.createElement('div'); name.className = 'minion-name'; name.textContent = m.name;
            const hp = document.createElement('div'); hp.className = 'stat-bubble hp'; hp.textContent = m.hp;
            el.appendChild(atk); el.appendChild(name); el.appendChild(hp);
            el.addEventListener('click', () => { if (activePlayer === 'player') playerAttackTarget(i); });
            enemyBoardEl.appendChild(el);
        });

        playerHealthEl.textContent = player.health;
        enemyHealthEl.textContent = enemy.health;
    }

    function playerAttackFrom(i) {
        if (gameOver) return;
        const m = player.board[i]; if (!m || !m.canAttack) return;
        // default attack enemy hero
        const dmg = m.atk;
        enemy.health -= dmg; addLog(`Your ${m.name} attacked enemy hero for ${dmg}`);
        // update enemy health display immediately
        enemyHealthEl.textContent = enemy.health;
        // small flash
        enemyHealthEl.style.transition = 'transform 0.12s'; enemyHealthEl.style.transform = 'scale(1.06)'; setTimeout(() => { enemyHealthEl.style.transform = ''; }, 120);
        m.canAttack = false;
        renderAll(); if (!checkWin()) { /* continue */ }
    }
    function playerAttackTarget(i) {
        const attacker = player.board.find(m => m.canAttack);
        if (!attacker) { addLog('No ready minion to attack.'); return; }
        const target = enemy.board[i]; if (!target) return;
        // simultaneous damage
        target.hp -= attacker.atk; attacker.hp -= target.atk;
        addLog(`Your ${attacker.name} attacked ${target.name} (${attacker.atk}/${target.atk})`);
        attacker.canAttack = false;
        // remove dead
        enemy.board = enemy.board.filter(x => x.hp > 0);
        player.board = player.board.filter(x => x.hp > 0);
        renderAll(); checkWin();
    }

    function checkWin() {
        if (enemy.health <= 0) { addLog('You win!'); endGame('You win'); return true; }
        if (player.health <= 0) { addLog('You lose!'); endGame('You lose'); return true; }
        return false;
    }

    function endGame(msg) {
        gameOver = true;
        addLog('Game over: ' + msg);
        boardArea.style.display = 'none';
        // show result overlay
        const overlay = document.getElementById('gameResult');
        if (overlay) {
            const title = document.getElementById('resultTitle');
            const text = document.getElementById('resultText');
            if (title) title.textContent = msg;
            if (text) text.textContent = msg;
            overlay.setAttribute('aria-hidden', 'false');
        } else {
            alert(msg);
        }
    }

    function startTurn(p) {
        if (gameOver) return;
        activePlayer = p; turnOwnerEl.textContent = p === 'player' ? 'You' : 'Enemy';
        const state = (p === 'player') ? player : enemy;
        state.manaCrystals = clamp(state.manaCrystals + 1, 0, 10);
        state.currentMana = state.manaCrystals;
        // Coin: if state.hasCoin and not used, apply coin as temporary mana for first turn only if it's enemy? We'll simply model coin as +1 currentMana on first turn for who got it.
        if (state.hasCoin && !state.coinUsed) { state.currentMana += 1; state.coinUsed = true; addLog(`${p === 'player' ? 'You' : 'Enemy'} received the Coin (+1 mana this turn)`); }
        updateManaDisplay(); drawFor(p);
        // ready minions
        state.board.forEach(m => m.canAttack = true);
        renderAll();
        if (p === 'enemy') setTimeout(() => { if (!gameOver) enemyTurn(); }, 600);
    }

    function endTurn() {
        if (activePlayer === 'player') {
            // unused mana lost
            player.currentMana = 0; updateManaDisplay();
            startTurn('enemy');
        } else {
            enemy.currentMana = 0;
            startTurn('player');
        }
    }

    endTurnBtn.addEventListener('click', () => { endTurn(); });

    function enemyTurn() {
        if (gameOver) return;
        // simple AI: play cheapest playable cards and attack hero
        const state = enemy;
        // play cards from hand cheapest-first
        enemy.hand.sort((a, b) => (costFromTier((window.CARDS.find(c => c.id === a) || { tier: 'Common' }).tier) - costFromTier((window.CARDS.find(c => c.id === b) || { tier: 'Common' }).tier)));
        for (let i = enemy.hand.length - 1; i >= 0; i--) {
            if (gameOver) return;
            const id = enemy.hand[i]; const card = window.CARDS.find(c => c.id === id) || { tier: 'Common' };
            const c = costFromTier(card.tier);
            if (state.currentMana >= c) {
                // play
                playCardFromHand('enemy', i);
            }
        }
        // attack hero with all ready
        const ready = state.board.filter(m => m.canAttack);
        for (const m of ready) {
            if (gameOver) return;
            enemyAttackWith(m);
            if (checkWin()) return;
        }
        // end enemy turn
        endTurn();
    }

    function enemyAttackWith(m) {
        const dmg = m.atk; player.health -= dmg; addLog(`Enemy ${m.name} attacked you for ${dmg}`);
        m.canAttack = false; playerHealthEl.textContent = player.health; checkWin();
    }

    // Mulligan logic - allows selecting up to 3 to replace
    let mulliganSelection = new Set();
    function showMulligan() {
        mulliganArea.style.display = 'block'; mulliganHand.innerHTML = '';
        player.hand.forEach((id, i) => {
            const c = window.CARDS.find(cc => cc.id === id) || { name: id };
            const el = document.createElement('div'); el.className = 'hand-card'; el.textContent = c.name;
            el.addEventListener('click', () => {
                if (mulliganSelection.has(i)) { mulliganSelection.delete(i); el.style.opacity = '1'; }
                else { if (mulliganSelection.size < 3) { mulliganSelection.add(i); el.style.opacity = '0.5'; } }
            });
            mulliganHand.appendChild(el);
        });
    }

    confirmMulligan.addEventListener('click', () => {
        if (!player || !player.deck) return;
        const idxs = Array.from(mulliganSelection).sort((a, b) => b - a);
        for (const idx of idxs) {
            const id = player.hand[idx]; player.hand.splice(idx, 1);
            // return to deck and reshuffle
            player.deck.push(id);
        }
        shuffle(player.deck);
        // draw same number
        for (let i = 0; i < idxs.length; i++) drawFor('player');
        mulliganArea.style.display = 'none'; renderAll();
        // start first turn depending on who is first
        if (player.isFirst) startTurn('player'); else startTurn('enemy');
    });

    // Start game handler
    startGame.addEventListener('click', () => {
        gameOver = false;
        const res = document.getElementById('gameResult'); if (res) res.setAttribute('aria-hidden', 'true');

        playerDeck = buildDeckFromSavedOrCollection(); enemyDeck = buildDeckFromSavedOrCollection();
        // create players
        player = { health: 30, manaCrystals: 0, currentMana: 0, hand: [], board: [], deck: playerDeck, isFirst: Math.random() < 0.5, hasCoin: false, coinUsed: false };
        enemy = { health: 30, manaCrystals: 0, currentMana: 0, hand: [], board: [], deck: enemyDeck, isFirst: !player.isFirst, hasCoin: false, coinUsed: false };
        // assign coin to who goes second
        if (player.isFirst) { enemy.hasCoin = true; } else { player.hasCoin = true; }
        // draw initial hands (first draws 3, second draws 4)
        const first = player.isFirst ? 'player' : 'enemy';
        for (let i = 0; i < 3; i++) { drawFor(first); drawFor(first === 'player' ? 'enemy' : 'player'); }
        // extra card for second
        const second = (first === 'player') ? 'enemy' : 'player'; drawFor(second);

        // show mulligan for player regardless (player is allowed up to 3)
        mulliganSelection.clear(); showMulligan();
        boardArea.style.display = 'block';
        // attach deck references to convenience
        player.deck = playerDeck; enemy.deck = enemyDeck;
        renderAll();
        // hide the initial setup panel so the UI is focused on the match
        const setup = document.getElementById('setupArea'); if (setup) { setup.classList.remove('active'); setup.style.display = 'none'; }
    });

    // Overlay result handlers
    const resultOverlay = document.getElementById('gameResult');
    if (resultOverlay) {
        const closeBtn = document.getElementById('resultClose');
        const toMenu = document.getElementById('resultToMenu');
        const restartBtn = document.getElementById('resultRestart');
        if (closeBtn) closeBtn.addEventListener('click', () => { resultOverlay.setAttribute('aria-hidden', 'true'); });
        if (toMenu) toMenu.addEventListener('click', () => { window.location.href = 'main.html'; });
        if (restartBtn) restartBtn.addEventListener('click', () => { window.location.href = 'game.html'; });
    }

});