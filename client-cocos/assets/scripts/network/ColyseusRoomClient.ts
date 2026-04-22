/**
 * ColyseusRoomClient — Colyseus 連線管理器
 * 負責建立/斷線/重連 Room 連線，廣播 Room State 變化事件。
 * Client 只顯示 Server 廣播資料，不計算任何遊戲邏輯。
 */
import { EventTarget } from 'cc';

export interface RoomState {
  phase: string;
  pot: number;
  players: PlayerState[];
  banker_seat: number;
  current_turn_seat: number;
  min_bet: number;
  max_bet: number;
  round_id: string;
}

export interface PlayerState {
  seat_index: number;
  player_id: string;
  nickname: string;
  chip_balance: number;
  current_bet: number;
  has_acted: boolean;
  is_banker: boolean;
  is_connected: boolean;
  avatar_id: number;
}

export interface SettlementEntry {
  player_id: string;
  seat_index: number;
  net_chips: number;
  hand_type: string;
  cards: string[];
}

export const RoomEvent = {
  STATE_CHANGED:    'room:state_changed',
  PHASE_CHANGED:    'room:phase_changed',
  SHOWDOWN_REVEAL:  'room:showdown_reveal',
  SETTLEMENT:       'room:settlement',
  CHAT_MESSAGE:     'room:chat_message',
  PLAYER_JOINED:    'room:player_joined',
  PLAYER_LEFT:      'room:player_left',
  ERROR:            'room:error',
  CONNECTED:        'room:connected',
  DISCONNECTED:     'room:disconnected',
  RECONNECTING:     'room:reconnecting',
  RECONNECTED:      'room:reconnected',
} as const;

export class ColyseusRoomClient extends EventTarget {
  private static _instance: ColyseusRoomClient;
  private _room: any = null;
  private _client: any = null;
  private _reconnectAttempts = 0;
  private readonly MAX_RECONNECT = 5;
  private readonly RECONNECT_DELAY_MS = 2000;

  static get instance(): ColyseusRoomClient {
    if (!ColyseusRoomClient._instance) {
      ColyseusRoomClient._instance = new ColyseusRoomClient();
    }
    return ColyseusRoomClient._instance;
  }

  get isConnected(): boolean { return this._room !== null; }
  get roomId(): string | null { return this._room?.id ?? null; }
  get sessionId(): string | null { return this._room?.sessionId ?? null; }

  async connect(serverUrl: string, playerId: string, token: string): Promise<void> {
    const { Client } = await import('colyseus.js');
    this._client = new Client(serverUrl);
    await this._joinOrCreate(playerId, token);
  }

  async joinById(roomId: string, playerId: string, token: string): Promise<void> {
    await this._joinRoom(roomId, { player_id: playerId, token });
  }

  private async _joinOrCreate(playerId: string, token: string): Promise<void> {
    const options = { player_id: playerId, token };
    this._room = await this._client.joinOrCreate('SamGongRoom', options);
    this._bindRoomEvents();
    this.emit(RoomEvent.CONNECTED);
    this._reconnectAttempts = 0;
  }

  private async _joinRoom(roomId: string, options: object): Promise<void> {
    this._room = await this._client.joinById(roomId, options);
    this._bindRoomEvents();
    this.emit(RoomEvent.CONNECTED);
    this._reconnectAttempts = 0;
  }

  private _bindRoomEvents(): void {
    const room = this._room;

    room.onStateChange((state: RoomState) => {
      this.emit(RoomEvent.STATE_CHANGED, state);
    });

    room.onMessage('showdown_reveal', (data: { hands: Record<string, string[]>; hand_types: Record<string, string> }) => {
      this.emit(RoomEvent.SHOWDOWN_REVEAL, data);
    });

    room.onMessage('settlement', (data: SettlementEntry[]) => {
      this.emit(RoomEvent.SETTLEMENT, data);
    });

    room.onMessage('chat', (data: { player_id: string; nickname: string; message: string; timestamp: number }) => {
      this.emit(RoomEvent.CHAT_MESSAGE, data);
    });

    room.onError((code: number, message: string) => {
      this.emit(RoomEvent.ERROR, { code, message });
    });

    room.onLeave(async (code: number) => {
      this._room = null;
      if (code > 1000 && this._reconnectAttempts < this.MAX_RECONNECT) {
        this.emit(RoomEvent.RECONNECTING, { attempt: this._reconnectAttempts + 1 });
        await this._attemptReconnect();
      } else {
        this.emit(RoomEvent.DISCONNECTED, { code });
      }
    });
  }

  private async _attemptReconnect(): Promise<void> {
    await new Promise(r => setTimeout(r, this.RECONNECT_DELAY_MS * (this._reconnectAttempts + 1)));
    try {
      this._reconnectAttempts++;
      await this._room.reconnect();
      this._bindRoomEvents();
      this.emit(RoomEvent.RECONNECTED);
      this._reconnectAttempts = 0;
    } catch {
      if (this._reconnectAttempts < this.MAX_RECONNECT) {
        await this._attemptReconnect();
      } else {
        this.emit(RoomEvent.DISCONNECTED, { code: -1, reason: 'max_reconnect_exceeded' });
      }
    }
  }

  sendBankerBet(amount: number): void { this._room?.send('banker_bet', { amount }); }
  sendPlayerCall(): void { this._room?.send('player_call'); }
  sendPlayerFold(): void { this._room?.send('player_fold'); }
  sendPlayerBet(amount: number): void { this._room?.send('player_bet', { amount }); }
  sendChat(message: string): void { this._room?.send('chat', { message }); }
  sendStartGame(): void { this._room?.send('start_game'); }

  async leave(): Promise<void> {
    await this._room?.leave();
    this._room = null;
  }
}
