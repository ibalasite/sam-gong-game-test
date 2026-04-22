/**
 * AudioManager — 音效管理器（Singleton）
 * 依 PDD §6.8 音效規格管理所有 SFX / BGM。
 */
import { ccclass, property } from 'cc';
import { Component, AudioSource, Node } from 'cc';

export enum SFX {
  CARD_DEAL     = 'sfx_card_deal',
  CARD_FLIP     = 'sfx_card_flip',
  COIN_DROP     = 'sfx_coin_drop',
  COIN_FLY      = 'sfx_coin_fly',
  WIN           = 'sfx_win',
  LOSE          = 'sfx_lose',
  SAM_GONG      = 'sfx_sam_gong_fanfare',
  FOLD          = 'sfx_fold',
  BET_CONFIRM   = 'sfx_bet_confirm',
  BUTTON_CLICK  = 'sfx_button_click',
  ANTI_ADDIC    = 'sfx_anti_addiction_alert',
  CROWN         = 'sfx_crown_appear',
}

export enum BGM {
  LOBBY       = 'bgm_lobby',
  GAME_TABLE  = 'bgm_game_table',
  TUTORIAL    = 'bgm_tutorial',
}

@ccclass('AudioManager')
export class AudioManager extends Component {
  private static _instance: AudioManager;
  static get instance(): AudioManager { return AudioManager._instance; }

  @property(AudioSource) private _bgmSource!: AudioSource;
  @property(AudioSource) private _sfxSource!: AudioSource;

  private _sfxEnabled = true;
  private _bgmEnabled = true;
  private _sfxVolume = 1.0;
  private _bgmVolume = 0.6;
  private _clips: Map<string, any> = new Map();

  onLoad(): void {
    if (AudioManager._instance && AudioManager._instance !== this) { this.node.destroy(); return; }
    AudioManager._instance = this;
    this._loadSettings();
  }

  private _loadSettings(): void {
    const { sys } = require('cc');
    this._sfxEnabled = sys.localStorage.getItem('sfx_enabled') !== 'false';
    this._bgmEnabled = sys.localStorage.getItem('bgm_enabled') !== 'false';
    this._sfxVolume  = parseFloat(sys.localStorage.getItem('sfx_volume') || '1.0');
    this._bgmVolume  = parseFloat(sys.localStorage.getItem('bgm_volume') || '0.6');
  }

  playSFX(sfx: SFX): void {
    if (!this._sfxEnabled) return;
    const clip = this._clips.get(sfx);
    if (clip && this._sfxSource) {
      this._sfxSource.clip = clip;
      this._sfxSource.volume = this._sfxVolume;
      this._sfxSource.play();
    }
  }

  playBGM(bgm: BGM): void {
    if (!this._bgmEnabled) return;
    const clip = this._clips.get(bgm);
    if (clip && this._bgmSource) {
      this._bgmSource.clip = clip;
      this._bgmSource.volume = this._bgmVolume;
      this._bgmSource.loop = true;
      this._bgmSource.play();
    }
  }

  stopBGM(): void { this._bgmSource?.stop(); }
  stopSFX(): void { this._sfxSource?.stop(); }

  setSFXEnabled(enabled: boolean): void {
    this._sfxEnabled = enabled;
    require('cc').sys.localStorage.setItem('sfx_enabled', String(enabled));
  }
  setBGMEnabled(enabled: boolean): void {
    this._bgmEnabled = enabled;
    if (!enabled) this.stopBGM();
    require('cc').sys.localStorage.setItem('bgm_enabled', String(enabled));
  }
  setSFXVolume(vol: number): void { this._sfxVolume = Math.max(0, Math.min(1, vol)); }
  setBGMVolume(vol: number): void { this._bgmVolume = Math.max(0, Math.min(1, vol)); if (this._bgmSource) this._bgmSource.volume = this._bgmVolume; }

  registerClip(key: string, clip: any): void { this._clips.set(key, clip); }
}
