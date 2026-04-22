import { AudioManager, SFX, BGM } from '../../assets/scripts/managers/AudioManager';

// cc is already mapped to __mocks__/cc.ts via jest.config.js moduleNameMapper

describe('AudioManager', () => {
  let am: AudioManager;
  let mockBgmSource: any;
  let mockSfxSource: any;

  beforeEach(() => {
    (AudioManager as any)._instance = null;
    am = new AudioManager();
    am.node = { active: true, name: 'AudioManager', destroy: jest.fn(), on: jest.fn(), off: jest.fn(), emit: jest.fn(), getComponent: jest.fn(), children: [], addChild: jest.fn(), removeAllChildren: jest.fn() } as any;
    mockBgmSource = { clip: null, volume: 0, loop: false, play: jest.fn(), stop: jest.fn(), pause: jest.fn() };
    mockSfxSource = { clip: null, volume: 0, loop: false, play: jest.fn(), stop: jest.fn(), pause: jest.fn() };
    (am as any)._bgmSource = mockBgmSource;
    (am as any)._sfxSource = mockSfxSource;
    (am as any)._sfxEnabled = true;
    (am as any)._bgmEnabled = true;
    (am as any)._sfxVolume = 1.0;
    (am as any)._bgmVolume = 0.6;
  });

  describe('playSFX()', () => {
    it('does not play when SFX disabled', () => {
      (am as any)._sfxEnabled = false;
      am.registerClip(SFX.COIN_DROP, {});
      am.playSFX(SFX.COIN_DROP);
      expect(mockSfxSource.play).not.toHaveBeenCalled();
    });

    it('plays when SFX enabled and clip registered', () => {
      const fakeClip = {};
      am.registerClip(SFX.COIN_DROP, fakeClip);
      am.playSFX(SFX.COIN_DROP);
      expect(mockSfxSource.play).toHaveBeenCalled();
    });
  });

  describe('setBGMEnabled()', () => {
    it('stops BGM when disabled', () => {
      am.setBGMEnabled(false);
      expect(mockBgmSource.stop).toHaveBeenCalled();
    });
  });

  describe('setBGMVolume()', () => {
    it('clamps volume between 0 and 1', () => {
      am.setBGMVolume(1.5);
      expect((am as any)._bgmVolume).toBe(1);
      am.setBGMVolume(-0.5);
      expect((am as any)._bgmVolume).toBe(0);
    });
  });
});
