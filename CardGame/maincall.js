import { getCharacter, createTeam, performLightAttack, performSpecialAttack } from "./battleCharacters.js";

const spearman = getCharacter("spearman");
const cannon = getCharacter("cannon");
console.log("Cannon Life: " + cannon.currentLife);
console.log("Spearman Attacks: ");
console.log(spearman.attacks);
// console.log(spearman);


let result = performLightAttack(spearman, cannon);
console.log(result);
console.log("Cannon Life: " + cannon.currentLife);
console.log("Spearman Mana: " + spearman.currentMana);


