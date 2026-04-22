import { GameManager, GameEvent, LocalPlayerInfo } from '../../assets/scripts/managers/GameManager';
import { ColyseusRoomClient, RoomEvent, RoomState } from '../../assets/scripts/network/ColyseusRoomClient';

// Mock ColyseusRoomClient
jest.mock('../../assets/scripts/network/ColyseusRoomClient', () => {
  const { EventTarget } = require('../../tests/__mocks__/cc');
  return {
    RoomEvent: {
      STATE_CHANGED: 'room:state_changed',
      SHOWDOWN_REVEAL: 'room:showdown_reveal',
      SETTLEMENT: 'room:settlement',
      RECONNECTING: 'room:reconnecting',
      DISCONNECTED: 'room:disconnected',
    },
    ColyseusRoomClient: {
      instance: new EventTarget(),
    },
  };
});

const makeState = (overrides: Partial<RoomState> = {}): RoomState => ({
  phase: 'waiting',
  pot: 0,
  players: [],
  banker_seat: 0,
  current_turn_seat: -1,
  min_bet: 100,
  max_bet: 100000,
  round_id: 'round-001',
  ...overrides,
});

describe('GameManager', () => {
  let gm: GameManager;
  let mockNode: any;

  beforeEach(() => {
    mockNode = { active: true, name: 'GameManager', destroy: jest.fn(), on: jest.fn(), off: jest.fn(), emit: jest.fn(), getComponent: jest.fn(), children: [] };
    (GameManager as any)._instance = null;
    gm = new GameManager();
    gm.node = mockNode;
    gm.onLoad();
  });

  afterEach(() => {
    gm.onDestroy();
  });

  describe('setLocalPlayer()', () => {
    it('stores local player info', () => {
      const info: LocalPlayerInfo = { playerId: 'p1', nickname: '測試玩家', seatIndex: 0, token: 'tok' };
      gm.setLocalPlayer(info);
      expect(gm.localPlayer).toEqual(info);
    });
  });

  describe('state', () => {
    it('returns null before any state update', () => {
      expect(gm.state).toBeNull();
    });
  });

  describe('isMyTurn', () => {
    it('returns false when state is null', () => {
      expect(gm.isMyTurn).toBe(false);
    });

    it('returns true when current_turn_seat matches my seat', () => {
      gm.setLocalPlayer({ playerId: 'p1', nickname: 'Alice', seatIndex: 2, token: '' });
      const state = makeState({
        current_turn_seat: 2,
        players: [{ seat_index: 2, player_id: 'p1', nickname: 'Alice', chip_balance: 5000, current_bet: 0, has_acted: false, is_banker: false, is_connected: true, avatar_id: 1 }],
      });
      // Simulate state change
      (gm as any)._onStateChanged(state);
      expect(gm.isMyTurn).toBe(true);
    });

    it('returns false when current_turn_seat differs from my seat', () => {
      gm.setLocalPlayer({ playerId: 'p1', nickname: 'Alice', seatIndex: 2, token: '' });
      const state = makeState({
        current_turn_seat: 3,
        players: [{ seat_index: 2, player_id: 'p1', nickname: 'Alice', chip_balance: 5000, current_bet: 0, has_acted: false, is_banker: false, is_connected: true, avatar_id: 1 }],
      });
      (gm as any)._onStateChanged(state);
      expect(gm.isMyTurn).toBe(false);
    });
  });

  describe('phase change events', () => {
    it('emits PHASE_CHANGED event when phase transitions', () => {
      const handler = jest.fn();
      gm.events.on(GameEvent.PHASE_CHANGED, handler);
      (gm as any)._onStateChanged(makeState({ phase: 'banker-bet' }));
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({ phase: 'banker-bet', prev: '' }));
    });

    it('does not emit PHASE_CHANGED when phase stays same', () => {
      const handler = jest.fn();
      (gm as any)._onStateChanged(makeState({ phase: 'banker-bet' }));
      gm.events.on(GameEvent.PHASE_CHANGED, handler);
      (gm as any)._onStateChanged(makeState({ phase: 'banker-bet' }));
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Server-Authoritative constraint', () => {
    it('stores state as-is without any computation', () => {
      const state = makeState({ pot: 99999 });
      (gm as any)._onStateChanged(state);
      // pot value must be stored exactly as received from server
      expect(gm.state?.pot).toBe(99999);
    });
  });
});
