import { BettingPanelComponent } from '../../assets/scripts/components/BettingPanelComponent';

// cc is already mapped to __mocks__/cc.ts via jest.config.js moduleNameMapper
jest.mock('../../assets/scripts/managers/GameManager', () => ({
  GameManager: { instance: { bankerBet: jest.fn(), call: jest.fn(), fold: jest.fn() } },
}));
jest.mock('../../assets/scripts/managers/AudioManager', () => ({
  AudioManager: { instance: { playSFX: jest.fn() } },
  SFX: { BET_CONFIRM: 'sfx_bet_confirm', FOLD: 'sfx_fold', COIN_DROP: 'sfx_coin_drop' },
}));
jest.mock('../../assets/scripts/managers/i18nManager', () => ({
  t: (key: string, params?: any) => key + (params ? JSON.stringify(params) : ''),
}));

describe('BettingPanelComponent', () => {
  let panel: BettingPanelComponent;

  beforeEach(() => {
    jest.useFakeTimers();
    panel = new BettingPanelComponent();
    const makeMockNode = () => ({ active: true, name: '', on: jest.fn(), emit: jest.fn(), destroy: jest.fn(), children: [], removeAllChildren: jest.fn(), addChild: jest.fn() });
    (panel as any)._selectedAmount = 0;
    (panel as any)._lastBetAmount = 0;
    (panel as any)._isBankerMode = false;
    (panel as any).btnConfirm = { node: makeMockNode(), interactable: true };
    (panel as any).btnFold = { node: makeMockNode(), interactable: true };
    (panel as any).toggleAutoBet = { isChecked: false, node: makeMockNode() };
    (panel as any).autoProgress = { node: makeMockNode(), progress: 1 };
    (panel as any).lblAutoCountdown = { string: '' };
    (panel as any).lblMinBet = { string: '' };
    (panel as any).quickBetsRoot = { ...makeMockNode(), children: [] };
  });

  afterEach(() => {
    jest.useRealTimers();
    (panel as any)._cancelAutoAct();
  });

  describe('_selectAmount()', () => {
    it('stores selected amount', () => {
      (panel as any)._selectAmount(500);
      expect((panel as any)._selectedAmount).toBe(500);
    });
  });

  describe('auto-act countdown', () => {
    it('triggers action after 3 seconds', () => {
      const action = jest.fn();
      (panel as any)._startAutoAct(action);
      jest.advanceTimersByTime(3100);
      expect(action).toHaveBeenCalled();
    });

    it('does not trigger if cancelled before timeout', () => {
      const action = jest.fn();
      (panel as any)._startAutoAct(action);
      jest.advanceTimersByTime(1000);
      (panel as any)._cancelAutoAct();
      jest.advanceTimersByTime(2500);
      expect(action).not.toHaveBeenCalled();
    });
  });

  describe('_onFold()', () => {
    it('calls GameManager.fold()', () => {
      const { GameManager } = require('../../assets/scripts/managers/GameManager');
      (panel as any)._onFold();
      expect(GameManager.instance.fold).toHaveBeenCalled();
    });
  });
});
