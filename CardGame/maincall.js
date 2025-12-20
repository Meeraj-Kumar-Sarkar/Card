import { getCharacter, createTeam, performLightAttack } from "./battleCharacters.js";

const spearman = getCharacter("spearman");
const cannon = getCharacter("cannon");
console.log("Cannon Life: " + cannon.currentLife);
console.log("Spearman Attacks: ");
console.log(spearman.attacks);
// console.log(spearman);


performLightAttack(spearman, cannon);
console.log("Cannon Life: " + cannon.currentLife);
console.log("Spearman Mana: " + spearman.currentMana);


