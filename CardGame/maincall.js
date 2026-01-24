import readline from "readline";
import {
    getTeam,
    performLightAttack,
    performNormalAttack,
    performSpecialAttack
} from "./battleCharacters.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

/* ============================
   CORE HELPERS
============================ */

function isTeamAlive(team) {
    return team.some(c => c.currentLife > 0);
}

function getAlive(team) {
    return team.filter(c => c.currentLife > 0);
}

function chooseRandomAction(attacker) {
    const actions = [];
    if (attacker.attacks.light) actions.push("light");
    if (attacker.attacks.normal) actions.push("normal");
    if (attacker.attacks.special) actions.push("special");
    return actions[Math.floor(Math.random() * actions.length)];
}

function performAction(type, attacker, defender) {
    switch (type) {
        case "light":
            return performLightAttack(attacker, defender);
        case "normal":
            return performNormalAttack(attacker, defender);
        case "special":
            return performSpecialAttack(attacker, defender);
        default:
            return { success: false };
    }
}

/* ============================
   PLAYER TEAM SELECTION
============================ */

async function chooseTeam(playerName) {
    console.log(`\n${playerName}, choose your 3 characters.`);
    console.log("Enter character IDs separated by commas.");
    console.log("Example: guillotine,bomb,spearman\n");

    while (true) {
        try {
            const input = await ask("> ");
            const picks = input.split(",").map(p => p.trim());

            if (picks.length !== 3) {
                console.log("You must choose exactly 3 characters.");
                continue;
            }

            return getTeam(picks[0], picks[1], picks[2]);
        } catch (err) {
            console.log("Invalid selection. Try again.");
        }
    }
}

/* ============================
   BATTLE LOOP
============================ */

async function battle(teamA, teamB) {
    let turn = 0;

    console.log("\n=== BATTLE START ===\n");

    while (isTeamAlive(teamA) && isTeamAlive(teamB)) {
        turn++;

        const attackingTeam = turn % 2 === 1 ? teamA : teamB;
        const defendingTeam = turn % 2 === 1 ? teamB : teamA;

        const attacker = getAlive(attackingTeam)[0];
        const defender = getAlive(defendingTeam)[0];

        const action = chooseRandomAction(attacker);
        const result = performAction(action, attacker, defender);

        console.log(
            `[Turn ${turn}] ${attacker.name} uses ${action} on ${defender.name}`
        );

        if (result.success) {
            console.log(
                `${defender.name} HP: ${defender.currentLife}/${defender.maxLife}`
            );
        } else {
            console.log("Action failed:", result.reason);
        }

        if (defender.currentLife === 0) {
            console.log(`${defender.name} has fallen.`);
        }

        console.log("-----");
        await ask("Press ENTER to continue...");
    }

    const winner = isTeamAlive(teamA) ? "PLAYER 1" : "PLAYER 2";
    console.log(`\n=== ${winner} WINS ===\n`);
}

/* ============================
   MAIN FLOW
============================ */

async function main() {
    console.log("=== 3v3 TERMINAL BATTLE ===");

    const team1 = await chooseTeam("Player 1");
    const team2 = await chooseTeam("Player 2");

    await battle(team1, team2);

    rl.close();
}

main();
