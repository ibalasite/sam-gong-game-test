import { i18nManager, t } from '../../assets/scripts/managers/i18nManager';

// Mock cc.resources.load
const mockResources = {
  load: jest.fn((_path: string, cb: Function) => {
    cb(null, { json: { lobby: { chips: '🪙 {{amount}}' }, game: { pot: '獎池：🪙 {{amount}}' } } });
  }),
};
jest.mock('cc', () => ({ resources: mockResources }), { virtual: true });

describe('i18nManager', () => {
  beforeEach(() => {
    (i18nManager as any)._instance = null;
  });

  it('singleton returns same instance', () => {
    expect(i18nManager.instance).toBe(i18nManager.instance);
  });

  it('loads locale data', async () => {
    await i18nManager.instance.load('zh-TW');
    expect(i18nManager.instance.currentLocale).toBe('zh-TW');
  });

  it('translates simple key', async () => {
    await i18nManager.instance.load('zh-TW');
    const result = i18nManager.instance.t('lobby.chips', { amount: '10,000' });
    expect(result).toBe('🪙 10,000');
  });

  it('returns key for missing translation', async () => {
    await i18nManager.instance.load('zh-TW');
    expect(i18nManager.instance.t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('t() helper delegates to instance', async () => {
    await i18nManager.instance.load('zh-TW');
    expect(t('game.pot', { amount: '5,000' })).toBe('獎池：🪙 5,000');
  });
});
