import { Dice, isDice } from "../types/Dice";
import { isDie } from "../types/Die";

function checkD100Combination(
  dice: Dice,
  values: Record<string, number>
): number | null {
  const bonus = dice.bonus || 0;
  if (
    dice.dice.length === 2 &&
    (dice.combination === undefined || dice.combination === "SUM")
  ) {
    const d1 = dice.dice[0];
    const d2 = dice.dice[1];
    if (isDie(d1) && isDie(d2) && d1.type === "D100" && d2.type === "D10") {
      const v1 = values[d1.id];
      const v2 = values[d2.id];
      if (v1 !== undefined && v2 !== undefined) {
        if (v1 === 0 && v2 === 0) {
          return 100 + bonus;
        } else {
          return v1 + v2 + bonus;
        }
      }
    }
  }
  return null;
}

// @param dice
// @param values 
// @returns

export function getCombinedDiceValue(
  dice: Dice,
  values: Record<string, number>
): number | null {
  const d100Value = checkD100Combination(dice, values);
  if (d100Value !== null) {
    return d100Value;
  }

  let currentValues: number[] = [];
  
  for (const dieOrDice of dice.dice) {
    if (isDie(dieOrDice)) {
      const value = values[dieOrDice.id];
      
      if (value !== undefined) {
        if (dieOrDice.style === "ASSIMILACAO" || 
            dieOrDice.style === "CAOS_SIMBOLOS" || 
            (dieOrDice.id && dieOrDice.id.includes("SIMBOLOS"))) {
           continue; 
        }
        if (value === 0 && dieOrDice.type === "D10") {
          currentValues.push(10);
        } else {
          currentValues.push(value);
        }
      }
    } else if (isDice(dieOrDice)) {
      const value = getCombinedDiceValue(dieOrDice, values);
      if (value !== null) {
        currentValues.push(value);
      }
    }
  }

  const bonus = dice.bonus || 0;

  if (currentValues.length === 0) {
    if (dice.combination === "NONE" && dice.bonus !== undefined) {
        return dice.bonus;
    }
    return null; 
  } 
  
  else if (dice.combination === "HIGHEST") {
    return Math.max(...currentValues) + bonus;
  } else if (dice.combination === "LOWEST") {
    return Math.min(...currentValues) + bonus;
  } else {
    return currentValues.reduce((a, b) => a + b, 0) + bonus;
  }
}