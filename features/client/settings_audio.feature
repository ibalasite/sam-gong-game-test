# features/client/settings_audio.feature
# PDD SCR-015 設定畫面 + §6.8 音效規格 BDD Scenarios

Feature: 設定與音效控制 (SCR-015)
  身為玩家
  我想控制音效和背景音樂
  以便根據偏好調整遊戲體驗

  Scenario: 關閉音效
    Given 音效（SFX）預設為開啟
    When 在設定畫面切換「音效」為關閉
    Then 後續操作不播放任何 SFX
    And 設定儲存至本機 localStorage

  Scenario: 關閉背景音樂
    Given 背景音樂（BGM）預設為開啟
    When 在設定畫面切換「背景音樂」為關閉
    Then BGM 立即停止播放
    And 設定儲存至本機

  Scenario: 調整音量後立即生效
    When 在設定畫面拉動「BGM 音量」滑桿至 50%
    Then BGM AudioSource volume 設定為 0.5

  Scenario: 重啟後恢復音效設定
    Given 玩家已關閉音效並離開 App
    When 重新啟動 App
    Then 音效設定從 localStorage 恢復為關閉狀態
