import { CardData, Rank } from './deck';

const RANK_VALUE: Record<Rank, number> = {
  'A': 1, '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 10, 'Q': 10, 'K': 10,
};

export function calculatePoints(cards: CardData[]): number {
  return cards.reduce((sum, c) => sum + RANK_VALUE[c.rank], 0) % 10;
}

// 公牌 (0) is the highest. Treat 0 as 10 for comparison.
// Banker wins on tie.
export function compareHands(
  playerCards: CardData[],
  bankerCards: CardData[]
): 'player' | 'banker' {
  const playerPts = calculatePoints(playerCards);
  const bankerPts = calculatePoints(bankerCards);
  const eff = (p: number) => (p === 0 ? 10 : p);
  return eff(playerPts) > eff(bankerPts) ? 'player' : 'banker';
}
