// TODO[REVIEW-DEFERRED]: Finding: Suit type is duplicated from shared/types.ts (type drift risk) | Severity: LOW | Cannot-fix reason: Client build system needs explicit shared path alias; safe to inline until monorepo import is configured | Source: STEP 20 Round 1
export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

export function getSuitSymbol(suit: Suit): string {
  return SUIT_SYMBOLS[suit];
}

export function formatPoints(points: number): string {
  return points === 0 ? '公牌 ✨' : `點數: ${points}`;
}

export function isValidRoomCode(code: string): boolean {
  return /^[A-Za-z0-9]{6}$/.test(code);
}

export function formatChips(chips: number): string {
  return chips.toLocaleString();
}
