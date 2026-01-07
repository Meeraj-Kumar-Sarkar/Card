import { getCharacter, performLightAttack, performNormalAttack, performSpecialAttack } from "./battleCharacters.js";

const firstChar = getCharacter("guillotine");
const secondChar = getCharacter("bomb");
let count = 1

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
            return { success: false, reason: "INVALID_ACTION" };
    }
}

while (firstChar.currentLife != 0 && secondChar.currentLife != 0) {
    const attacker = count % 2 === 0 ? firstChar : secondChar;
    const defender = count % 2 === 0 ? secondChar : firstChar;
    count++;

    const action = chooseAction(attacker);
    const result = performAction(action, attacker, defender);

    console.log(`${attacker.id} uses ${action}`);
    console.log(result);
    console.log(`${defender.id} Life: ${defender.currentLife}`);
    console.log(`${attacker.id} Mana: ${attacker.currentMana}`);
    console.log("-----");
    if (count != 1 && count != 2) {
        defender.currentMana += 25;
        attacker.currentLife += 20;
    }


}

// console.log(firstChar)
// console.log(secondChar)

let winner = firstChar.currentLife == 0 ? secondChar.id : firstChar.id;
console.log("The Winner is " + winner);