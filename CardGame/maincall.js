import {
    getTeam,
    performLightAttack,
    performNormalAttack,
    performSpecialAttack
} from "./battleCharacters.js";

const teamA = getTeam("guillotine", "bomb", "spearman");
const teamB = getTeam("war_cleric", "war_cleric", "cannon");

let turn = 0;

function isTeamAlive(team) {
    return team.some(char => char.currentLife > 0);
}

function getRandomAlive(team) {
    const alive = team.filter(c => c.currentLife > 0);
    return alive[Math.floor(Math.random() * alive.length)];
}

function chooseAction(attacker) {
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

while (isTeamAlive(teamA) && isTeamAlive(teamB)) {
    turn++;

    const attackingTeam = turn % 2 === 1 ? teamA : teamB;
    const defendingTeam = turn % 2 === 1 ? teamB : teamA;

    const attacker = getRandomAlive(attackingTeam);
    const defender = getRandomAlive(defendingTeam);

    const action = chooseAction(attacker);
    const result = performAction(action, attacker, defender);

    console.log(
        `[Turn ${turn}] ${attacker.name} attacks ${defender.name} with ${action}`
    );

    if (result.success) {
        console.log(
            `${defender.name} HP: ${defender.currentLife}`
        );
    } else {
        console.log(`Action failed: ${result.reason}`);
    }

    console.log("-----");
}

const winner = isTeamAlive(teamA) ? "TEAM A" : "TEAM B";
console.log(`Winner: ${winner}`);
