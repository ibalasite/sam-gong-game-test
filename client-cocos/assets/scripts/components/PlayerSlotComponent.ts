/**
 * PlayerSlotComponent — CMP-003 玩家座位元件
 * 依 PDD CMP-003：頭像、暱稱、籌碼、押注、牌型標籤、皇冠。
 * 顯示資料均來自 Server RoomState — 零本地計算。
 */
import { ccclass, property } from 'cc';
import { Component, Label, Sprite, Node } from 'cc';
import { PlayerState } from '../network/ColyseusRoomClient';
import { t } from '../managers/i18nManager';

@ccclass('PlayerSlotComponent')
export class PlayerSlotComponent extends Component {
  @property(Label)  private lblNickname!: Label;
  @property(Label)  private lblChips!: Label;
  @property(Label)  private lblCurrentBet!: Label;
  @property(Label)  private lblHandType!: Label;    // 牌型標籤（三公 / 一公 等）
  @property(Node)   private crownNode!: Node;       // 莊家皇冠 SCR-007 CMP-006
  @property(Node)   private disconnectIcon!: Node;
  @property(Node)   private foldMask!: Node;
  @property(Node)   private avatarNode!: Node;
  @property(Label)  private lblEvalScore!: Label;   // 開牌大分數（PDD §6.4）

  private _seatIndex = -1;

  get seatIndex(): number { return this._seatIndex; }

  updateFromState(p: PlayerState, isBanker: boolean): void {
    this._seatIndex = p.seat_index;
    this.lblNickname.string = p.nickname;
    this.lblChips.string = t('game.chips', { amount: p.chip_balance.toLocaleString() });
    this.lblCurrentBet.string = p.current_bet > 0 ? t('game.bet', { amount: p.current_bet.toLocaleString() }) : '';
    this.crownNode.active = isBanker;
    this.disconnectIcon.active = !p.is_connected;
    this.foldMask.active = p.has_acted && p.current_bet === 0 && !p.is_banker;
    this.node.active = true;
  }

  /** 顯示開牌後牌型（大字閃亮，PDD §6.4）— 資料來自 Server showdown_reveal */
  showHandType(handType: string, isLatest: boolean): void {
    this.lblHandType.string = t(`game.handType.${handType}`);
    this.lblHandType.node.active = true;
    // Active state = big glowing (CSS class equivalent: animation in Cocos via Animation component)
    const anim = this.lblHandType.node.getComponent(require('cc').Animation);
    if (anim) anim.play(isLatest ? 'eval_active' : 'eval_done');
  }

  clearHandType(): void {
    this.lblHandType.node.active = false;
  }

  showEmpty(): void {
    this.node.active = false;
  }
}
