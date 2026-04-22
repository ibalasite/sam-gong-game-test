/**
 * i18nManager — 國際化管理器
 * 依 PDD §8 i18n 規格，所有顯示字串從 locale JSON 取得。
 * 零硬編碼字串原則：Client bundle 不包含任何語言字串常數。
 */

type LocaleData = Record<string, any>;

export class i18nManager {
  private static _instance: i18nManager;
  private _locale = 'zh-TW';
  private _data: LocaleData = {};

  static get instance(): i18nManager {
    if (!i18nManager._instance) i18nManager._instance = new i18nManager();
    return i18nManager._instance;
  }

  async load(locale: string): Promise<void> {
    this._locale = locale;
    const { resources } = require('cc');
    return new Promise((resolve, reject) => {
      resources.load(`locale/${locale}`, (err: Error | null, asset: any) => {
        if (err) { reject(err); return; }
        this._data = asset?.json ?? {};
        resolve();
      });
    });
  }

  t(key: string, params?: Record<string, string | number>): string {
    const parts = key.split('.');
    let val: any = this._data;
    for (const part of parts) {
      if (typeof val !== 'object' || val === null) return key;
      val = val[part];
    }
    if (typeof val !== 'string') return key;
    if (params) {
      return val.replace(/\{\{(\w+)\}\}/g, (_: string, k: string) => String(params[k] ?? k));
    }
    return val;
  }

  get currentLocale(): string { return this._locale; }
}

export const t = (key: string, params?: Record<string, string | number>): string =>
  i18nManager.instance.t(key, params);
