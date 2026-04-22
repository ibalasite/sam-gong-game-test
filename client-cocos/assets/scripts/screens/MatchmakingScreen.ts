/**
 * MatchmakingScreen — SCR-006 配對等待畫面
 * 依 PDD SCR-006：90s 超時後自動返回大廳。
 */
import { ccclass, property } from 'cc';
import { Component, Label, Button } from 'cc';
import { ColyseusRoomClient, RoomEvent } from '../network/ColyseusRoomClient';
import { GameManager } from '../managers/GameManager';
import { UIManager } from '../managers/UIManager';
import { AudioManager, SFX } from '../managers/AudioManager';
import { t } from '../managers/i18nManager';

const MATCHMAKING_TIMEOUT_MS = 90_000;

@ccclass('MatchmakingScreen')
export class MatchmakingScreen extends Component {
  @property(Label)  private lblStatus!: Label;
  @property(Label)  private lblElapsed!: Label;
  @property(Button) private btnCancel!: Button;

  private _startTime = 0;
  private _ticker: any = null;
  private _timeoutHandle: any = null;

  onEnable(): void {
    this._startTime = Date.now();
    this.lblStatus.string = t('matchmaking.searching');
    this._ticker = setInterval(() => this._tick(), 1000);
    this._timeoutHandle = setTimeout(() => this._onTimeout(), MATCHMAKING_TIMEOUT_MS);

    const net = ColyseusRoomClient.instance;
    net.on(RoomEvent.CONNECTED, this._onMatched, this);

    this.btnCancel.node.on('click', this._onCancel, this);
  }

  onDisable(): void {
    clearInterval(this._ticker);
    clearTimeout(this._timeoutHandle);
    ColyseusRoomClient.instance.off(RoomEvent.CONNECTED, this._onMatched, this);
  }

  private _tick(): void {
    const elapsed = Math.floor((Date.now() - this._startTime) / 1000);
    this.lblElapsed.string = t('matchmaking.elapsed', { seconds: elapsed });
  }

  private _onMatched(): void {
    clearInterval(this._ticker);
    clearTimeout(this._timeoutHandle);
    UIManager.instance.navigateTo('GameTableScreen');
  }

  private _onTimeout(): void {
    clearInterval(this._ticker);
    this.lblStatus.string = t('matchmaking.timeout');
    AudioManager.instance.playSFX(SFX.BUTTON_CLICK);
    this.scheduleOnce(() => UIManager.instance.navigateTo('LobbyScreen'), 2);
  }

  private _onCancel(): void {
    AudioManager.instance.playSFX(SFX.BUTTON_CLICK);
    ColyseusRoomClient.instance.leave();
    UIManager.instance.navigateTo('LobbyScreen');
  }
}
