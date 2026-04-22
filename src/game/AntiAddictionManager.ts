/**
 * AntiAddictionManager — 防沉迷計時器（Server-side）
 *
 * 規格來源：EDD §3.6 AntiAddictionManager, REQ-015
 *
 * 核心規格：
 * - 成人：連續遊玩 2h（7200s）提醒，需主動確認後重置計時器
 * - 未成年：每日遊玩 2h（7200s）硬停（UTC+8 00:00 重置）
 * - Timer Persistence：每局 settled 後 Write-Through 至 PostgreSQL
 * - Redis 為 write-through cache（key: aa:session:{player_id}）
 * - Redis 重啟後從 PostgreSQL 回填，避免 Sentinel 切換時遺失計時資料
 *
 * 防沉迷 WS 訊息：
 * - adult 2h 提醒：{ type: 'anti_addiction_warning', type: 'adult', session_minutes: number }
 * - underage 硬停：{ type: 'anti_addiction_signal', type: 'underage', daily_minutes_remaining: 0, midnight_timestamp: number }
 * - WS Close Code 4003：未成年每日遊戲時間上限（從房間踢出）
 */

/** 防沉迷狀態 */
export interface AntiAddictionStatus {
  /** 玩家 ID */
  player_id: string;
  /** 是否需要彈出提醒（成人 2h 到達） */
  should_warn: boolean;
  /** 是否強制下線（未成年 2h 硬停） */
  should_logout: boolean;
  /** 今日累計遊玩秒數（未成年用） */
  daily_play_seconds: number;
  /** 連續遊玩秒數（成人用） */
  session_play_seconds: number;
}

/** 玩家計時資料 */
interface PlayerTimer {
  player_id: string;
  /** 計時開始時間（Unix ms） */
  session_start_ms: number;
  /** 今日累計秒數（UTC+8 00:00 重置） */
  daily_play_seconds: number;
  /** 連續遊玩秒數（離線 > 30min 重置） */
  session_play_seconds: number;
  /** 成人提醒是否已觸發（等待確認） */
  adult_warned: boolean;
}

/** 成人連續遊玩警告閾值（2h = 7200s） */
const ADULT_WARN_THRESHOLD_SECONDS = 7200;

/** 未成年每日遊玩上限（2h = 7200s） */
const UNDERAGE_DAILY_LIMIT_SECONDS = 7200;

/**
 * AntiAddictionManager — 管理防沉迷計時器
 *
 * Server-Authoritative 設計：
 * - 不信任 Client 傳入的計時資料
 * - 計時以 Server 時間為準
 * - 透過 WebSocket 私人訊息通知 Client
 *
 * TODO（v1.0 实作）：
 * - 整合 Redis write-through cache（key: aa:session:{player_id}）
 * - 整合 PostgreSQL（users.daily_play_seconds, users.session_play_seconds）
 * - 與 Colyseus Room 生命週期整合（onJoin / onLeave / settled）
 */
export class AntiAddictionManager {
  /** 玩家計時器 Map（in-memory，開發階段） */
  private timers: Map<string, PlayerTimer> = new Map();

  /**
   * 追蹤成人玩家連續遊玩時間
   * - 2h 後呼叫端應推送 anti_addiction_warning 訊息
   * - 玩家確認後呼叫 onAdultWarningConfirmed() 重置計時器
   *
   * @param playerId 玩家 ID
   * @returns AntiAddictionStatus
   */
  async trackAdultSession(playerId: string): Promise<AntiAddictionStatus> {
    let timer = this.timers.get(playerId);

    if (!timer) {
      timer = {
        player_id: playerId,
        session_start_ms: Date.now(),
        daily_play_seconds: 0,
        session_play_seconds: 0,
        adult_warned: false,
      };
      this.timers.set(playerId, timer);
    }

    const nowMs = Date.now();
    const elapsedSeconds = Math.floor((nowMs - timer.session_start_ms) / 1000);
    timer.session_play_seconds = elapsedSeconds;

    const shouldWarn = elapsedSeconds >= ADULT_WARN_THRESHOLD_SECONDS && !timer.adult_warned;

    if (shouldWarn) {
      timer.adult_warned = true;
    }

    return {
      player_id: playerId,
      should_warn: shouldWarn,
      should_logout: false,
      daily_play_seconds: timer.daily_play_seconds,
      session_play_seconds: timer.session_play_seconds,
    };
  }

  /**
   * 成人防沉迷警告確認（玩家主動確認後重置計時器）
   * - 重置 session_start_ms 至當前時間
   * - 清除 adult_warned 旗標
   *
   * @param playerId 玩家 ID
   */
  onAdultWarningConfirmed(playerId: string): void {
    const timer = this.timers.get(playerId);
    if (!timer) return;

    // 重置連續遊玩計時器
    timer.session_start_ms = Date.now();
    timer.session_play_seconds = 0;
    timer.adult_warned = false;

    console.log(`[AntiAddiction] Adult warning confirmed and timer reset for player ${playerId}`);
  }

  /**
   * 追蹤未成年玩家每日遊玩時間
   * - 達 2h 後呼叫端應推送 anti_addiction_signal 訊息並強制登出
   * - UTC+8 00:00 每日重置
   *
   * @param playerId 玩家 ID
   * @returns AntiAddictionStatus
   */
  async trackUnderageDaily(playerId: string): Promise<AntiAddictionStatus> {
    let timer = this.timers.get(playerId);

    if (!timer) {
      timer = {
        player_id: playerId,
        session_start_ms: Date.now(),
        daily_play_seconds: 0,  // TODO: 從 PostgreSQL/Redis 載入今日累計
        session_play_seconds: 0,
        adult_warned: false,
      };
      this.timers.set(playerId, timer);
    }

    const nowMs = Date.now();
    const sessionElapsed = Math.floor((nowMs - timer.session_start_ms) / 1000);
    const totalDaily = timer.daily_play_seconds + sessionElapsed;

    const shouldLogout = totalDaily >= UNDERAGE_DAILY_LIMIT_SECONDS;

    return {
      player_id: playerId,
      should_warn: false,
      should_logout: shouldLogout,
      daily_play_seconds: totalDaily,
      session_play_seconds: sessionElapsed,
    };
  }

  /**
   * 安排未成年玩家強制登出
   * - 牌局中觸發：等待本局結算後強制登出（REQ-015 AC-3 F20）
   * - 傳送 WS Close Code 4003
   *
   * @param playerId 玩家 ID
   * @param afterSettlement 是否等待結算後登出
   */
  scheduleUnderageLogout(playerId: string, afterSettlement: boolean): void {
    // TODO: 整合 SamGongRoom 生命週期
    // afterSettlement=true：等待 settled phase 後呼叫 client.leave(4003)
    // afterSettlement=false：立即呼叫 client.leave(4003)
    console.log(
      `[AntiAddiction] Underage logout scheduled for player ${playerId}, afterSettlement=${afterSettlement}`,
    );
  }

  /**
   * 計算台灣午夜 Unix ms（UTC+8 次日 00:00）
   * 用於告知 Client 何時可重新遊玩
   *
   * @returns Unix ms
   */
  getTaiwanMidnightTimestamp(): number {
    const now = new Date();
    // 取得 UTC+8 當日午夜（明日 00:00）
    const utc8Offset = 8 * 60 * 60 * 1000; // 8h in ms
    const nowUtc8 = new Date(now.getTime() + utc8Offset);

    // 設定為明日 00:00:00 UTC+8
    const tomorrowUtc8 = new Date(
      Date.UTC(
        nowUtc8.getUTCFullYear(),
        nowUtc8.getUTCMonth(),
        nowUtc8.getUTCDate() + 1,
        0,
        0,
        0,
        0,
      ),
    );

    return tomorrowUtc8.getTime() - utc8Offset;
  }

  /**
   * 持久化計時資料至 PostgreSQL（Write-Through）
   * - 每局 settled 後呼叫
   * - Redis 同步更新 aa:session:{player_id}
   *
   * @param playerId 玩家 ID
   */
  async persistTimers(playerId: string): Promise<void> {
    const timer = this.timers.get(playerId);
    if (!timer) return;

    // TODO: 整合 PostgreSQL
    // UPDATE users SET daily_play_seconds = $1, session_play_seconds = $2 WHERE id = $3
    // SETEX aa:session:{playerId} {TTL} {timer_data_json}
    console.log(
      `[AntiAddiction] persistTimers for player ${playerId}: daily=${timer.daily_play_seconds}s, session=${timer.session_play_seconds}s`,
    );
  }

  /**
   * 玩家離線時累積計時資料
   * 若離線 > 30min，下次登入時重置 session_play_seconds
   *
   * @param playerId 玩家 ID
   */
  onPlayerOffline(playerId: string): void {
    const timer = this.timers.get(playerId);
    if (!timer) return;

    const nowMs = Date.now();
    const sessionElapsed = Math.floor((nowMs - timer.session_start_ms) / 1000);
    timer.daily_play_seconds += sessionElapsed;
    timer.session_play_seconds = 0;

    // TODO: 立即持久化至 PostgreSQL/Redis
    this.persistTimers(playerId);
  }

  /**
   * 移除玩家計時資料（Room onDispose 時呼叫）
   *
   * @param playerId 玩家 ID
   */
  removePlayer(playerId: string): void {
    this.timers.delete(playerId);
  }
}
