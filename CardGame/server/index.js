import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

import {
    createTeam,
    performLightAttack,
    performNormalAttack,
    performSpecialAttack,
    performAreaAttack,
    activateDefense,
    isTeamDefeated,
    getAliveCharacters,
    regenerateTeamMana
} from '../battleCharacters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Simple request logger to help debug 405/empty responses from the browser
app.use((req, res, next) => {
    console.log('[REQ]', req.method, req.url, 'Origin=', req.headers.origin || '-', 'Content-Type=', req.headers['content-type'] || '-');
    next();
});

// Allow preflight OPTIONS requests for any path (useful if browser sends preflight)
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.use(express.static(path.join(__dirname, '..')));

// In-memory games store (map gameId -> game state)
const games = new Map();

function createGame(mode = '3v3') {
    const playerTeam = mode === '3v3' ? createTeam(['guillotine', 'spearman', 'cannon']) : [createTeam(['guillotine'])[0]];
    const enemyTeam = mode === '3v3' ? createTeam(['bomb', 'gladiator', 'foot_soldier']) : [createTeam(['bomb'])[0]];

    const game = {
        id: uuidv4(),
        mode,
        playerTeam,
        enemyTeam,
        currentPlayerCharIndex: 0,
        isGameOver: false,
        log: []
    };

    games.set(game.id, game);
    return game;
}

function addLog(game, message) {
    game.log.unshift(message);
}

function checkWin(game) {
    if (isTeamDefeated(game.enemyTeam)) {
        game.isGameOver = true;
        addLog(game, '🎉 VICTORY! Player Team Wins!');
        return 'player';
    }
    if (isTeamDefeated(game.playerTeam)) {
        game.isGameOver = true;
        addLog(game, '💀 DEFEAT! Enemy Team Wins!');
        return 'enemy';
    }
    return null;
}

function pickAliveRandom(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

function enemyAIAct(game) {
    const aliveEnemies = getAliveCharacters(game.enemyTeam);
    const alivePlayers = getAliveCharacters(game.playerTeam);

    for (const enemy of aliveEnemies) {
        if (game.isGameOver) break;

        let action;
        if (enemy.currentLife < 30 && enemy.currentMana >= 10) {
            action = Math.random() > 0.5 ? 'def_hard' : 'def_normal';
        } else {
            const actions = ['light', 'normal', 'special'];
            action = actions[Math.floor(Math.random() * actions.length)];
        }
        const target = pickAliveRandom(getAliveCharacters(game.playerTeam));

        if (!target) continue;

        if (action.startsWith('def_')) {
            const defType = action.split('_')[1];
            const res = activateDefense(enemy, defType);
            if (res.success) addLog(game, `${enemy.id} defended with ${defType} (${res.defenseValue} block)`);
            else addLog(game, `${enemy.id} failed to defend: ${res.reason}`);
        } else {
            let res;
            if (action === 'light') res = performLightAttack(enemy, target);
            else if (action === 'normal') res = performNormalAttack(enemy, target);
            else if (action === 'special') res = performSpecialAttack(enemy, target);

            if (res && res.success) {
                addLog(game, `${enemy.id} used ${action} on ${target.id} for ${res.damageDealt} dmg` + (res.wasDefended ? ` (blocked ${res.defenseBlocked})` : ''));
                if (res.targetDefeated) addLog(game, `💀 ${target.id} defeated!`);
            } else if (res) {
                addLog(game, `${enemy.id} failed to ${action}: ${res.reason}`);
            }
        }

        regenerateTeamMana(game.enemyTeam, 0); // no-op but keep hook if needed
        checkWin(game);
    }
}

app.post('/api/init', (req, res) => {
    const { mode } = req.body || {};
    const game = createGame(mode || '3v3');
    addLog(game, `Game created (mode=${game.mode})`);
    res.json({ success: true, gameId: game.id, state: sanitizeGameState(game) });
});

app.get('/api/state', (req, res) => {
    const { gameId } = req.query;
    const game = games.get(gameId);
    if (!game) return res.status(404).json({ success: false, reason: 'GAME_NOT_FOUND' });
    res.json({ success: true, state: sanitizeGameState(game) });
});

app.post('/api/action', (req, res) => {
    const { gameId, actionType, targetIndex } = req.body || {};
    const game = games.get(gameId);

    if (!game) return res.status(404).json({ success: false, reason: 'GAME_NOT_FOUND' });
    if (game.isGameOver) return res.json({ success: false, reason: 'GAME_OVER', state: sanitizeGameState(game) });

    const attacker = game.playerTeam[game.currentPlayerCharIndex];

    if (!attacker || !attacker.isAlive) {
        addLog(game, `${attacker?.id || 'Player'} cannot act (dead)`);
        return res.json({ success: false, reason: 'ATTACKER_DEFEATED', state: sanitizeGameState(game) });
    }

    let actionResult = null;

    if (actionType?.startsWith('def_')) {
        const defType = actionType.split('_')[1];
        actionResult = activateDefense(attacker, defType);
        if (actionResult.success) addLog(game, `${attacker.id} activated ${defType} defense (blocks ${actionResult.defenseValue})`);
        else addLog(game, `${attacker.id} failed to defend: ${actionResult.reason}`);
    } else if (actionType === 'area') {
        const resArea = performAreaAttack(attacker, game.enemyTeam, 'normal');
        actionResult = resArea;
        if (resArea.success) {
            addLog(game, `${attacker.id} unleashed an area attack hitting ${resArea.totalTargets} enemies!`);
            resArea.results.forEach((r, idx) => {
                const target = getAliveCharacters(game.enemyTeam)[idx];
                if (target) {
                    addLog(game, `  → ${target.id} took ${r.damageDealt} damage!`);
                    if (r.targetDefeated) addLog(game, `  💀 ${target.id} defeated!`);
                }
            });
        } else {
            addLog(game, `${attacker.id} failed area attack: ${resArea.reason}`);
        }
    } else {
        if (typeof targetIndex !== 'number') {
            addLog(game, 'No target selected!');
            return res.json({ success: false, reason: 'NO_TARGET', state: sanitizeGameState(game) });
        }

        const defender = game.enemyTeam[targetIndex];
        if (!defender) {
            return res.json({ success: false, reason: 'INVALID_TARGET', state: sanitizeGameState(game) });
        }

        if (actionType === 'light') actionResult = performLightAttack(attacker, defender);
        else if (actionType === 'normal') actionResult = performNormalAttack(attacker, defender);
        else if (actionType === 'special') actionResult = performSpecialAttack(attacker, defender);

        if (actionResult && actionResult.success) {
            if (actionResult.wasDefended) addLog(game, `${attacker.id} attacked ${defender.id} (${actionResult.baseDamage} dmg) but defense blocked ${actionResult.defenseBlocked}!`);
            addLog(game, `${attacker.id} dealt ${actionResult.damageDealt} damage to ${defender.id}!`);
            if (actionResult.targetDefeated) addLog(game, `💀 ${defender.id} has been defeated!`);
        } else {
            addLog(game, `${attacker.id} failed ${actionType}: ${actionResult?.reason}`);
        }
    }

    // After player action, regenerate small mana for player team
    regenerateTeamMana(game.playerTeam, 3);

    // Check win condition now
    if (!checkWin(game)) {
        // Enemy takes its turn(s)
        enemyAIAct(game);

        // Regenerate player mana a bit for next round
        regenerateTeamMana(game.playerTeam, 0);

        // Move currentPlayerCharIndex to first alive player
        let idx = 0;
        while (idx < game.playerTeam.length && !game.playerTeam[idx].isAlive) idx++;
        if (idx >= game.playerTeam.length) idx = 0; // fallback
        game.currentPlayerCharIndex = idx;

        // Check win condition again
        checkWin(game);
    }

    res.json({ success: true, result: actionResult, state: sanitizeGameState(game) });
});

function sanitizeGameState(game) {
    // Return small snapshot for frontend
    return {
        id: game.id,
        mode: game.mode,
        playerTeam: game.playerTeam,
        enemyTeam: game.enemyTeam,
        currentPlayerCharIndex: game.currentPlayerCharIndex,
        isGameOver: game.isGameOver,
        log: game.log.slice(0, 50)
    };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});