/**
 * GameTableScreen — SCR-007 遊戲桌面主控制器
 * 依 PDD SCR-007 + §6 動畫規格實作。
 * Server-Authoritative: 所有資料來自 RoomState，不計算任何遊戲邏輯。
 */
import { ccclass, property } from 'cc';
import { Component, Label, Button, Node, ProgressBar } from 'cc';
import { GameManager, GameEvent } from '../managers/GameManager';
import { AudioManager, SFX, BGM } from '../managers/AudioManager';
import { UIManager } from '../managers/UIManager';
import { t } from '../managers/i18nManager';
import { RoomState, PlayerState, SettlementEntry } from '../network/ColyseusRoomClient';

@ccclass('GameTableScreen')
export class GameTableScreen extends Component {
  @property(Label)       private lblPhase!: Label;
  @property(Label)       private lblPot!: Label;
  @property(Node)        private playerSlotsRoot!: Node;
  @property(Node)        private bettingPanel!: Node;
  @property(ProgressBar) private countdownBar!: ProgressBar;
  @property(Button)      private btnCall!: Button;
  @property(Button)      private btnFold!: Button;
  @property(Button)      private btnBet!: Button;
  @property(Label)       private lblMinBet!: Label;
  @property(Node)        private quickBetsRoot!: Node;
  @property(Button)      private btnSettings!: Button;
  @property(Button)      private btnChat!: Button;
  @property(Button)      private btnLeaderboard!: Button;

  private _countdownInterval: any = null;

  onLoad(): void {
    GameManager.instance.events.on(GameEvent.STATE_UPDATED, this._onStateUpdated, this);
    GameManager.instance.events.on(GameEvent.PHASE_CHANGED, this._onPhaseChanged, this);
    GameManager.instance.events.on(GameEvent.MY_TURN, this._onMyTurn, this);
    GameManager.instance.events.on(GameEvent.SHOWDOWN, this._onShowdown, this);
    GameManager.instance.events.on(GameEvent.SETTLEMENT, this._onSettlement, this);
    GameManager.instance.events.on(GameEvent.RECONNECTING, this._onReconnecting, this);

    this.btnCall.node.on('click', () => GameManager.instance.call(), this);
    this.btnFold.node.on('click', () => GameManager.instance.fold(), this);
    this.btnSettings.node.on('click', () => UIManager.instance.navigateTo('SettingsScreen'), this);
    this.btnChat.node.on('click', () => UIManager.instance.showOverlay('ChatPanel'), this);
    this.btnLeaderboard.node.on('click', () => UIManager.instance.navigateTo('LeaderboardScreen'), this);
  }

  onEnable(): void {
    AudioManager.instance.playBGM(BGM.GAME_TABLE);
    this._hideBettingPanel();
  }

  onDestroy(): void {
    GameManager.instance?.events.off(GameEvent.STATE_UPDATED, this._onStateUpdated, this);
    GameManager.instance?.events.off(GameEvent.PHASE_CHANGED, this._onPhaseChanged, this);
    GameManager.instance?.events.off(GameEvent.MY_TURN, this._onMyTurn, this);
    GameManager.instance?.events.off(GameEvent.SHOWDOWN, this._onShowdown, this);
    GameManager.instance?.events.off(GameEvent.SETTLEMENT, this._onSettlement, this);
    this._clearCountdown();
  }

  private _onStateUpdated(state: RoomState): void {
    // Display pot — value comes from server, no local calculation
    this.lblPot.string = t('game.pot', { amount: state.pot.toLocaleString() });
    this._refreshPlayerSlots(state.players);
  }

  private _onPhaseChanged(evt: { phase: string; prev: string }): void {
    this.lblPhase.string = t(`game.phase.${evt.phase}`);
    switch (evt.phase) {
      case 'waiting':      this._hideBettingPanel(); break;
      case 'banker-bet':   this._showBankerBetPanel(); break;
      case 'player-bet':   this._showPlayerBetPanel(); break;
      case 'showdown':     this._hideBettingPanel(); break;
      case 'settled':      /* settlement overlay handled via GameEvent.SETTLEMENT */ break;
    }
  }

  private _onMyTurn(_player: PlayerState): void {
    AudioManager.instance.playSFX(SFX.BUTTON_CLICK);
    this._showBettingPanel();
  }

  private _onShowdown(data: { hands: Record<string, string[]>; hand_types: Record<string, string> }): void {
    // Trigger card-reveal sequence — display only, no logic
    AudioManager.instance.playSFX(SFX.CARD_FLIP);
    this._runRevealSequence(data);
  }

  private _onSettlement(entries: SettlementEntry[]): void {
    // Display net_chips from server — no calculation
    UIManager.instance.showOverlay('SettlementOverlay');
    AudioManager.instance.playSFX(SFX.WIN); // will be replaced per-entry in overlay
  }

  private _onReconnecting(): void {
    this.lblPhase.string = t('game.reconnecting');
  }

  private _refreshPlayerSlots(players: PlayerState[]): void {
    // Update each player slot node based on seat_index
    players.forEach(p => {
      const slotNode = this.playerSlotsRoot.children.find(n => n.name === `Slot_${p.seat_index}`);
      if (!slotNode) return;
      const nickLabel = slotNode.getComponent(Label);
      if (nickLabel) nickLabel.string = p.nickname;
    });
  }

  private _showBettingPanel(): void { this.bettingPanel.active = true; }
  private _hideBettingPanel(): void { this.bettingPanel.active = false; }
  private _showBankerBetPanel(): void { this.bettingPanel.active = true; this.btnFold.node.active = false; this.btnCall.node.active = false; this.btnBet.node.active = true; }
  private _showPlayerBetPanel(): void { this.bettingPanel.active = true; this.btnFold.node.active = true; this.btnCall.node.active = true; this.btnBet.node.active = false; }

  private _runRevealSequence(_data: any): void { /* Animate card flips sequentially — display only */ }
  private _clearCountdown(): void { if (this._countdownInterval) { clearInterval(this._countdownInterval); this._countdownInterval = null; } }
}
