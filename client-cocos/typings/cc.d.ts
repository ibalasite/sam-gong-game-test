// Minimal Cocos Creator 3.8.x type stubs for IDE / CI typecheck
declare module 'cc' {
  export class Component {
    node: Node;
    onLoad?(): void;
    start?(): void;
    update?(dt: number): void;
    onDestroy?(): void;
    getComponent<T>(type: new (...args: any[]) => T): T | null;
    scheduleOnce(callback: () => void, delay?: number): void;
    unscheduleAllCallbacks(): void;
  }
  export class Node {
    name: string;
    active: boolean;
    position: Vec3;
    getComponent<T>(type: new (...args: any[]) => T): T | null;
    setPosition(x: number, y: number, z?: number): void;
    on(type: string, callback: (...args: any[]) => void, target?: any): void;
    off(type: string, callback?: (...args: any[]) => void, target?: any): void;
    emit(type: string, ...args: any[]): void;
    addChild(child: Node): void;
    removeAllChildren(): void;
    destroy(): void;
    children: Node[];
  }
  export class Vec3 { x: number; y: number; z: number; constructor(x?: number, y?: number, z?: number); }
  export class Vec2 { x: number; y: number; constructor(x?: number, y?: number); }
  export class Color { r: number; g: number; b: number; a: number; constructor(r?: number, g?: number, b?: number, a?: number); }
  export class Label extends Component { string: string; }
  export class Sprite extends Component { }
  export class Button extends Component { interactable: boolean; }
  export class ProgressBar extends Component { progress: number; }
  export class EditBox extends Component { string: string; }
  export class Toggle extends Component { isChecked: boolean; }
  export class Animation extends Component { play(name?: string): void; stop(): void; }
  export class AudioSource extends Component { clip: any; volume: number; loop: boolean; play(): void; stop(): void; pause(): void; }
  export class Prefab { }
  export class SpriteFrame { }
  export class SpriteAtlas { getSpriteFrame(name: string): SpriteFrame | null; }
  export class instantiate { }
  export const director: { loadScene(name: string, cb?: () => void): void; getScene(): any; };
  export function instantiate(original: Prefab): Node;
  export const resources: { load(path: string, type: any, cb: (err: Error | null, asset: any) => void): void; };
  export const sys: { localStorage: Storage; platform: string; };
  export const game: { on(event: string, cb: () => void): void; };
  export const input: { on(type: string, cb: (...args: any[]) => void): void; };
  export const EventType: { TOUCH_START: string; TOUCH_END: string; TOUCH_CANCEL: string; };
  export function ccclass(name?: string): ClassDecorator;
  export function property(options?: any): PropertyDecorator;
  export function executeInEditMode(): ClassDecorator;
  export function requireComponent(type: any): ClassDecorator;
  export function disallowMultiple(): ClassDecorator;
  export class EventTarget {
    on(type: string, callback: (...args: any[]) => void, target?: any): void;
    off(type: string, callback?: (...args: any[]) => void, target?: any): void;
    emit(type: string, ...args: any[]): void;
  }
  export const Enum: (obj: object) => any;
}
