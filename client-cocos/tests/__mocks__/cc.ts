// Jest mock for Cocos Creator 'cc' module

class MockComponent {
  node: any = {
    active: true,
    name: '',
    children: [],
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    getComponent: jest.fn(),
    destroy: jest.fn(),
    addChild: jest.fn(),
    removeAllChildren: jest.fn(),
  };
  getComponent = jest.fn();
  scheduleOnce = jest.fn((cb: () => void, delay?: number) => { if (delay === 0) cb(); });
  unscheduleAllCallbacks = jest.fn();
}

class MockLabel { string = ''; }
class MockSprite {}
class MockButton { interactable = true; }
class MockProgressBar { progress = 0; }
class MockAudioSource {
  clip: any = null;
  volume = 1;
  loop = false;
  play = jest.fn();
  stop = jest.fn();
  pause = jest.fn();
}

class MockEventTarget {
  private _listeners: Record<string, Function[]> = {};
  on(type: string, cb: Function) { (this._listeners[type] = this._listeners[type] || []).push(cb); }
  off(type: string, cb?: Function) {
    if (cb) this._listeners[type] = (this._listeners[type] || []).filter(f => f !== cb);
    else delete this._listeners[type];
  }
  emit(type: string, ...args: any[]) { (this._listeners[type] || []).forEach(f => f(...args)); }
}

const ccMock = {
  Component: MockComponent,
  Label: MockLabel,
  Sprite: MockSprite,
  Button: MockButton,
  ProgressBar: MockProgressBar,
  AudioSource: MockAudioSource,
  director: { loadScene: jest.fn(), getScene: jest.fn() },
  sys: { localStorage: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() }, platform: 'UNKNOWN' },
  game: { on: jest.fn() },
  ccclass: () => (target: any) => target,
  property: () => () => {},
  instantiate: jest.fn((_prefab: any) => ({ active: true, name: '', destroy: jest.fn() })),
  EventTarget: MockEventTarget,
};

module.exports = ccMock;
export default ccMock;
