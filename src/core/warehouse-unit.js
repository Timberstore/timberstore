import { TEXTS } from './texts.js';

// Grammatical form only; one pair remains one source unit, never two pieces.
export function stockUnit(unit, amount) {
  const forms = TEXTS.warehouseStock.pairUnit;
  if (unit.normalize('NFC').trim().toLocaleLowerCase('sk-SK') !== forms.one) return unit;
  if (!Number.isInteger(amount)) return forms.fraction;
  if (amount === 1) return forms.one;
  return amount >= 2 && amount <= 4 ? forms.few : forms.many;
}
