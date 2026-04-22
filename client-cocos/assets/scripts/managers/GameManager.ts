/**
 * GameManager — 全域遊戲狀態管理器（Singleton）
 * 持有 RoomState 快照，驅動所有 UI 元件更新。
 * 不包含任何遊戲邏輯計算。
 */
import { ccclass, property } from 'cc';
import { Component, EventTarget } from 'cc';
import { ColyseusRoomClient, RoomEvent, RoomState, PlayerState, SettlementEntry } from '../network/ColyseusRoomClient';

export const GameEvent = {
  STATE_UPDATED:      'game:state_updated',
  PHASE_CHANGED:      'game:phase_changed',
  MY_TURN:            'game:my_turn',
  SHOWDOWN:           'game:showdown',
  SETTLEMENT:         'game:settlement',
  RECONNECTING:       'game:reconnecting',
  DISCONNECTED:       'game:disconnected',
} as const;

export interface LocalPlayerInfo {
  playerId: string;
  nickname: string;
  seatIndex: number;
  token: string;
}

@ccclass('GameManager')
export class GameManager extends Component {
  private static _instance: GameManager;

  static get instance(): GameManager { return GameManager._instance; }

  // Current room state snapshot — read-only for UI components
  private _state: RoomState | null = null;
  private _prevPhase = '';
  private _localPlayer: LocalPlayerInfo | null = null;
  readonly events = new EventTarget();

  onLoad(): void {
    if (GameManager._instance && GameManager._instance !== this) {
      this.node.destroy();
      return;
    }
    GameManager._instance = this;
    this._bindNetworkEvents();
  }

  onDestroy(): void {
    if (GameManager._instance === this) {
      (GameManager as any)._instance = null;
    }
  }

  get state(): RoomState | null { return this._state; }
  get localPlayer(): LocalPlayerInfo | null { return this._localPlayer; }

  get myPlayerState(): PlayerState | null {
    if (!this._state || !this._localPlayer) return null;
    return this._state.players.find(p => p.player_id === this._localPlayer!.playerId) ?? null;
  }

  get isMyTurn(): boolean {
    const me = this.myPlayerState;
    if (!me || !this._state) return false;
    return this._state.current_turn_seat === me.seat_index;
  }

  setLocalPlayer(info: LocalPlayerInfo): void { this._localPlayer = info; }

  private _bindNetworkEvents(): void {
    const net = ColyseusRoomClient.instance;
    net.on(RoomEvent.STATE_CHANGED, this._onStateChanged, this);
    net.on(RoomEvent.SHOWDOWN_REVEAL, this._onShowdown, this);
    net.on(RoomEvent.SETTLEMENT, this._onSettlement, this);
    net.on(RoomEvent.RECONNECTING, () => this.events.emit(GameEvent.RECONNECTING), this);
    net.on(RoomEvent.DISCONNECTED, (d: any) => this.events.emit(GameEvent.DISCONNECTED, d), this);
  }

  private _onStateChanged(state: RoomState): void {
    this._state = state;
    this.events.emit(GameEvent.STATE_UPDATED, state);

    if (state.phase !== this._prevPhase) {
      this.events.emit(GameEvent.PHASE_CHANGED, { phase: state.phase, prev: this._prevPhase });
      this._prevPhase = state.phase;
    }
    if (this.isMyTurn) {
      this.events.emit(GameEvent.MY_TURN, this.myPlayerState);
    }
  }

  private _onShowdown(data: any): void { this.events.emit(GameEvent.SHOWDOWN, data); }
  private _onSettlement(data: SettlementEntry[]): void { this.events.emit(GameEvent.SETTLEMENT, data); }

  // Actions — delegate to network layer
  bankerBet(amount: number): void { ColyseusRoomClient.instance.sendBankerBet(amount); }
  call(): void { ColyseusRoomClient.instance.sendPlayerCall(); }
  fold(): void { ColyseusRoomClient.instance.sendPlayerFold(); }
  bet(amount: number): void { ColyseusRoomClient.instance.sendPlayerBet(amount); }
  chat(message: string): void { ColyseusRoomClient.instance.sendChat(message); }
  startGame(): void { ColyseusRoomClient.instance.sendStartGame(); }
}
