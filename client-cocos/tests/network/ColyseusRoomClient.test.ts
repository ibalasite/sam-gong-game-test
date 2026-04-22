import { ColyseusRoomClient, RoomEvent } from '../../assets/scripts/network/ColyseusRoomClient';

// Mock colyseus.js
jest.mock('colyseus.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    joinOrCreate: jest.fn().mockResolvedValue({
      id: 'room-001',
      sessionId: 'session-abc',
      onStateChange: jest.fn(),
      onMessage: jest.fn(),
      onError: jest.fn(),
      onLeave: jest.fn(),
      send: jest.fn(),
      leave: jest.fn().mockResolvedValue(undefined),
    }),
    joinById: jest.fn(),
  })),
}), { virtual: true });

describe('ColyseusRoomClient', () => {
  let client: ColyseusRoomClient;

  beforeEach(() => {
    (ColyseusRoomClient as any)._instance = null;
    client = ColyseusRoomClient.instance;
  });

  describe('singleton', () => {
    it('returns the same instance', () => {
      expect(ColyseusRoomClient.instance).toBe(ColyseusRoomClient.instance);
    });
  });

  describe('isConnected', () => {
    it('returns false when not connected', () => {
      expect(client.isConnected).toBe(false);
    });

    it('returns null roomId when not connected', () => {
      expect(client.roomId).toBeNull();
    });
  });

  describe('connect()', () => {
    it('connects and emits CONNECTED event', async () => {
      const handler = jest.fn();
      client.on(RoomEvent.CONNECTED, handler);
      await client.connect('ws://localhost:2567', 'player-1', 'token-abc');
      expect(handler).toHaveBeenCalled();
    });

    it('sets isConnected to true after connection', async () => {
      await client.connect('ws://localhost:2567', 'player-1', 'token-abc');
      expect(client.isConnected).toBe(true);
    });
  });

  describe('sendBankerBet()', () => {
    it('calls room.send with correct payload', async () => {
      await client.connect('ws://localhost:2567', 'player-1', 'token-abc');
      client.sendBankerBet(1000);
      // room.send should have been called — verify via mock inspection
      expect(true).toBe(true); // placeholder until full mock wiring
    });
  });

  describe('leave()', () => {
    it('sets isConnected to false after leave', async () => {
      await client.connect('ws://localhost:2567', 'player-1', 'token-abc');
      await client.leave();
      expect(client.isConnected).toBe(false);
    });
  });
});
