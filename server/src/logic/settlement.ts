import { CardData } from './deck';
import { compareHands } from './evaluator';

export interface SettlementResult {
  sessionId: string;
  outcome: 'win' | 'lose';
  chipsChange: number;
}

interface PlayerData {
  cards: CardData[];
  hasBet: boolean;
  isBanker: boolean;
  chips: number;
}

export function settle(
  players: Map<string, PlayerData>,
  bankerId: string,
  betAmount: number
): SettlementResult[] {
  const banker = players.get(bankerId)!;
  const results: SettlementResult[] = [];

  for (const [sid, player] of players) {
    if (sid === bankerId) continue;
    if (!player.hasBet) continue;

    const outcome = compareHands(player.cards, banker.cards);
    const chipsChange = outcome === 'player' ? betAmount : -betAmount;
    results.push({ sessionId: sid, outcome: outcome === 'player' ? 'win' : 'lose', chipsChange });
  }

  const bankerChange = results.reduce((acc, r) => acc - r.chipsChange, 0);
  results.push({
    sessionId: bankerId,
    outcome: bankerChange >= 0 ? 'win' : 'lose',
    chipsChange: bankerChange,
  });

  return results;
}
