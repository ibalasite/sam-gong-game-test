/**
 * LobbyScreen — SCR-004 主大廳畫面控制器
 * 依 PDD SCR-004 線框圖實作。
 */
import { ccclass, property } from 'cc';
import { Component, Label, Button, Node } from 'cc';
import { UIManager } from '../managers/UIManager';
import { GameManager } from '../managers/GameManager';
import { AudioManager, BGM, SFX } from '../managers/AudioManager';
import { t } from '../managers/i18nManager';
import { ColyseusRoomClient } from '../network/ColyseusRoomClient';

@ccclass('LobbyScreen')
export class LobbyScreen extends Component {
  @property(Label)  private lblNickname!: Label;
  @property(Label)  private lblChips!: Label;
  @property(Button) private btnQuickMatch!: Button;
  @property(Button) private btnTutorial!: Button;
  @property(Button) private btnLeaderboard!: Button;
  @property(Button) private btnDailyTasks!: Button;
  @property(Button) private btnSettings!: Button;
  @property(Button) private btnProfile!: Button;
  @property(Button) private btnChipStore!: Button;
  @property(Node)   private onlineCountNode!: Node;
  @property(Label)  private lblOnlineCount!: Label;

  onLoad(): void {
    this.btnQuickMatch.node.on('click', this._onQuickMatch, this);
    this.btnTutorial.node.on('click', this._onTutorial, this);
    this.btnLeaderboard.node.on('click', () => UIManager.instance.navigateTo('LeaderboardScreen'), this);
    this.btnDailyTasks.node.on('click', () => UIManager.instance.navigateTo('DailyTaskScreen'), this);
    this.btnSettings.node.on('click', () => UIManager.instance.navigateTo('SettingsScreen'), this);
    this.btnProfile.node.on('click', () => UIManager.instance.navigateTo('ProfileScreen'), this);
    this.btnChipStore.node.on('click', () => UIManager.instance.navigateTo('ChipStoreScreen'), this);
  }

  onEnable(): void {
    AudioManager.instance.playBGM(BGM.LOBBY);
    this._refreshPlayerInfo();
  }

  private _refreshPlayerInfo(): void {
    const me = GameManager.instance?.localPlayer;
    if (!me) return;
    this.lblNickname.string = me.nickname;
    // Chip balance displayed from server state — not calculated locally
    const state = GameManager.instance?.myPlayerState;
    if (state) {
      this.lblChips.string = t('lobby.chips', { amount: state.chip_balance.toLocaleString() });
    }
    // Disable quick match if already in a room (single room constraint, PDD §2.1)
    const inRoom = ColyseusRoomClient.instance.isConnected;
    this.btnQuickMatch.interactable = !inRoom;
  }

  private _onQuickMatch(): void {
    AudioManager.instance.playSFX(SFX.BUTTON_CLICK);
    UIManager.instance.navigateTo('RoomTierScreen');
  }

  private _onTutorial(): void {
    AudioManager.instance.playSFX(SFX.BUTTON_CLICK);
    UIManager.instance.navigateTo('TutorialScreen');
  }
}
