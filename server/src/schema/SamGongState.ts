import { Schema, type, MapSchema, ArraySchema, filter } from '@colyseus/schema';
import { Client } from 'colyseus';

// TODO[REVIEW-DEFERRED]: Finding: Suit/Rank/PlayerStatus/RoomPhase are duplicated from shared/types.ts (type drift risk) | Severity: LOW | Cannot-fix reason: tsconfig rootDir="./src" prevents direct relative imports of ../../shared/types; needs path alias or monorepo workspace config to resolve cleanly | Source: STEP 20 Round 1

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '10' | 'J' | 'Q' | 'K';
export type PlayerStatus =
  | 'waiting' | 'deciding' | 'called' | 'folded' | 'disconnected';
export type RoomPhase =
  | 'lobby' | 'banker_selection' | 'betting' | 'dealing'
  | 'reveal' | 'settling' | 'round_end';

export class Card extends Schema {
  @type('string') suit: Suit = 'spades';
  @type('string') rank: Rank = 'A';
  @type('boolean') revealed: boolean = false;
}

export class PlayerState extends Schema {
  @type('string') sessionId: string = '';
  @type('string') nickname: string = '';
  @type('string') status: PlayerStatus = 'waiting';
  @type('number') chips: number = 1000;
  @type('boolean') isBanker: boolean = false;
  @type('boolean') isHost: boolean = false;
  @type('boolean') hasBet: boolean = false;
  @type('number') seatIndex: number = 0;

  // ANTI-CHEAT: @filter ensures cards are only visible to the owner before reveal phase.
  // When filter returns false → cards field is OMITTED entirely from that client's patch.
  // When filter returns true → full suit/rank is broadcast.
  @filter(function (
    this: PlayerState,
    client: Client,
    value: ArraySchema<Card>,
    _root: SamGongState
  ) {
    const isOwner = this.sessionId === client.sessionId;
    const allRevealed =
      value.length > 0 && value.toArray().every((c) => c.revealed);
    return isOwner || allRevealed;
  })
  @type([Card]) cards = new ArraySchema<Card>();
}

export class SamGongState extends Schema {
  @type('string') roomPhase: RoomPhase = 'lobby';
  @type('string') roomCode: string = '';
  @type('number') betAmount: number = 0;
  @type('string') currentBankerId: string = '';
  @type('number') roundNumber: number = 0;
  @type('number') countdownSeconds: number = 0;

  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();

  // Seat order: sessionIds in join order. Used for banker rotation.
  // Players are never removed on leave (seat index stays stable for reconnection).
  @type(['string']) bankerQueue = new ArraySchema<string>();
}
