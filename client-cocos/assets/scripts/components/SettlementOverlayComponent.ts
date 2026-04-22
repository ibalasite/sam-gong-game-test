/**
 * SettlementOverlayComponent — SCR-009 結算疊加層
 * 依 PDD SCR-009：顯示 net_chips（來自 Server），不計算。
 * 5s 後自動關閉或點擊「下一局」。
 */
import { ccclass, property } from 'cc';
import { Component, Label, Button, Node } from 'cc';
import { SettlementEntry } from '../network/ColyseusRoomClient';
import { UIManager } from '../managers/UIManager';
import { AudioManager, SFX } from '../managers/AudioManager';
import { t } from '../managers/i18nManager';
import { GameManager, GameEvent } from '../managers/GameManager';

const AUTO_CLOSE_MS = 5000;

@ccclass('SettlementOverlayComponent')
export class SettlementOverlayComponent extends Component {
  @property(Node)   private entriesRoot!: Node;
  @property(Label)  private lblMyResult!: Label;
  @property(Button) private btnNextRound!: Button;
  @property(Button) private btnLeave!: Button;
  @property(Label)  private lblCountdown!: Label;

  private _autoCloseTimer: any = null;

  onLoad(): void {
    GameManager.instance.events.on(GameEvent.SETTLEMENT, this._onSettlement, this);
    this.btnNextRound.node.on('click', this._onNextRound, this);
    this.btnLeave.node.on('click', this._onLeave, this);
  }

  onDestroy(): void {
    GameManager.instance?.events.off(GameEvent.SETTLEMENT, this._onSettlement, this);
    this._clearAutoClose();
  }

  private _onSettlement(entries: SettlementEntry[]): void {
    this._renderEntries(entries);
    this._startAutoClose();
    UIManager.instance.showOverlay('SettlementOverlay');
  }

  private _renderEntries(entries: SettlementEntry[]): void {
    this.entriesRoot.removeAllChildren();
    const me = GameManager.instance.localPlayer;
    entries.forEach(entry => {
      // net_chips comes from server — display only
      const win = entry.net_chips >= 0;
      if (me && entry.player_id === me.playerId) {
        this.lblMyResult.string = win
          ? t('settlement.win', { amount: entry.net_chips.toLocaleString() })
          : t('settlement.lose', { amount: Math.abs(entry.net_chips).toLocaleString() });
        AudioManager.instance.playSFX(win ? SFX.WIN : SFX.LOSE);
      }
    });
  }

  private _startAutoClose(): void {
    let remaining = AUTO_CLOSE_MS;
    this._autoCloseTimer = setInterval(() => {
      remaining -= 500;
      this.lblCountdown.string = t('settlement.countdown', { secs: Math.ceil(remaining / 1000) });
      if (remaining <= 0) { this._clearAutoClose(); this._onNextRound(); }
    }, 500);
  }

  private _clearAutoClose(): void {
    if (this._autoCloseTimer) { clearInterval(this._autoCloseTimer); this._autoCloseTimer = null; }
  }

  private _onNextRound(): void {
    this._clearAutoClose();
    UIManager.instance.hideOverlay('SettlementOverlay');
  }

  private _onLeave(): void {
    this._clearAutoClose();
    UIManager.instance.hideOverlay('SettlementOverlay');
    UIManager.instance.navigateTo('LobbyScreen');
  }
}
