/**
 * UIManager — 畫面/疊加層切換管理器（Singleton）
 * 依 PDD §10.1 場景結構管理所有 Screens 和 Overlays。
 */
import { ccclass } from 'cc';
import { Component, Node, director } from 'cc';

export type ScreenName =
  | 'SplashScreen' | 'AgeGateScreen' | 'CookieBannerScreen'
  | 'LobbyScreen' | 'RoomTierScreen' | 'MatchmakingScreen'
  | 'GameTableScreen' | 'TutorialScreen' | 'LeaderboardScreen'
  | 'ProfileScreen' | 'DailyTaskScreen' | 'SettingsScreen'
  | 'ChipStoreScreen';

export type OverlayName = 'SettlementOverlay' | 'ChatPanel' | 'AntiAddictionOverlay';

@ccclass('UIManager')
export class UIManager extends Component {
  private static _instance: UIManager;
  static get instance(): UIManager { return UIManager._instance; }

  @(require('cc').property(Node)) private screensRoot!: Node;
  @(require('cc').property(Node)) private overlaysRoot!: Node;

  private _currentScreen: ScreenName | null = null;
  private _activeOverlays: Set<OverlayName> = new Set();
  private _history: ScreenName[] = [];

  onLoad(): void {
    if (UIManager._instance && UIManager._instance !== this) { this.node.destroy(); return; }
    UIManager._instance = this;
  }

  get currentScreen(): ScreenName | null { return this._currentScreen; }

  navigateTo(screen: ScreenName, pushHistory = true): void {
    if (this._currentScreen) {
      this._setScreenActive(this._currentScreen, false);
      if (pushHistory) this._history.push(this._currentScreen);
    }
    this._setScreenActive(screen, true);
    this._currentScreen = screen;
  }

  back(): void {
    const prev = this._history.pop();
    if (prev) this.navigateTo(prev, false);
  }

  showOverlay(overlay: OverlayName): void {
    this._setOverlayActive(overlay, true);
    this._activeOverlays.add(overlay);
  }

  hideOverlay(overlay: OverlayName): void {
    this._setOverlayActive(overlay, false);
    this._activeOverlays.delete(overlay);
  }

  isOverlayActive(overlay: OverlayName): boolean { return this._activeOverlays.has(overlay); }

  private _setScreenActive(screen: ScreenName, active: boolean): void {
    const node = this.screensRoot?.children.find(c => c.name === screen);
    if (node) node.active = active;
  }

  private _setOverlayActive(overlay: OverlayName, active: boolean): void {
    const node = this.overlaysRoot?.children.find(c => c.name === overlay);
    if (node) node.active = active;
  }
}
