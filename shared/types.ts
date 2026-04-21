export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '10' | 'J' | 'Q' | 'K';
export type RoomPhase =
  | 'lobby' | 'banker_selection' | 'betting' | 'dealing'
  | 'reveal' | 'settling' | 'round_end';
export type PlayerStatus =
  | 'waiting' | 'deciding' | 'called' | 'folded' | 'disconnected';

export interface CardData {
  suit: Suit;
  rank: Rank;
}

export interface SettlementResult {
  sessionId: string;
  outcome: 'win' | 'lose' | 'no_game';
  chipsChange: number;
  finalChips: number;
  isBanker: boolean;
}

/** Allowed bet amounts (whitelist enforced server-side) */
export const BET_AMOUNTS = [10, 20, 50, 100] as const;
export type BetAmount = (typeof BET_AMOUNTS)[number];

/** Starting chip count for every new session */
export const INITIAL_CHIPS = 1000;

/** Max players per room */
export const MAX_PLAYERS = 6;

/** Server-authoritative error codes (sent as S→C "error" messages) */
export const ERROR_CODES = {
  ROOM_NOT_FOUND:     4001, // joinById with unknown room code
  ROOM_FULL:          4002, // room already has MAX_PLAYERS
  UNAUTHORIZED:       4003, // non-host sending start_game; non-banker sending set_bet_amount
  WRONG_PHASE:        4004, // message sent in incorrect RoomPhase
  INSUFFICIENT_CHIPS: 4005, // chips < betAmount when calling
  INVALID_BET:        4006, // betAmount not in BET_AMOUNTS whitelist
  INVALID_ACTION:     4007, // player_action not "call"|"fold"
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/** Countdown durations (seconds) — mirrors server .env defaults */
export const COUNTDOWN = {
  BETTING: 30,
  REVEAL: 10,
} as const;

export const VALID_TRANSITIONS: Record<RoomPhase, RoomPhase[]> = {
  lobby:            ['banker_selection'],
  banker_selection: ['betting'],
  betting:          ['dealing', 'round_end'],
  dealing:          ['reveal'],
  reveal:           ['settling'],
  settling:         ['round_end'],
  round_end:        ['betting', 'lobby'],
};
