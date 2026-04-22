# features/client/game_table.feature
# PDD SCR-007 遊戲桌面 BDD Scenarios

Feature: 遊戲桌面 (SCR-007)
  身為遊戲中的玩家
  我想即時看到桌面狀態並進行押注操作
  以便完成每一局遊戲

  Background:
    Given 玩家已加入遊戲房間
    And 伺服器廣播 RoomState 至 Client

  Scenario: 顯示獎池金額（來自 Server）
    When 伺服器廣播 pot=5000
    Then 桌面獎池顯示 "獎池：🪙 5,000"
    And Client 不自行計算任何籌碼值

  Scenario: 莊家押注階段顯示押注面板
    When 伺服器廣播 phase="banker-bet"
    And 輪到我（莊家）
    Then 應顯示快速押注按鈕組
    And 自動押注 checkbox 預設為勾選
    And 進度條開始 3 秒倒數

  Scenario: 自動押注倒數後執行上一把金額
    Given 莊家上一把押注金額為 1000
    And 自動押注已開啟
    When 3 秒倒數結束
    Then 自動發送 banker_bet 1000 至伺服器
    And 選中按鈕顏色應為主色（金色）

  Scenario: 閒家跟注階段
    When 伺服器廣播 phase="player-bet"
    And 輪到我（閒家）
    Then 應顯示「跟注」和「棄牌」按鈕
    And 自動跟注倒數 3 秒後自動執行

  Scenario: 開牌動畫（顯示 Server 廣播的牌型）
    When 伺服器廣播 showdown_reveal 含各玩家手牌
    Then 依座位順序逐一翻牌（動畫 250ms 間隔）
    And 牌型標籤顯示在頭像上方（大字閃亮）
    And Client 不計算牌型，直接顯示 Server hand_type

  Scenario: 三公手牌特殊效果
    When 伺服器廣播某玩家 hand_type="sam_gong"
    Then 顯示 "🎴 三公" 閃亮標籤
    And 播放三公慶祝音效
    And 顯示三公光暈特效

  Scenario: 開牌後結算（顯示 Server net_chips）
    When 伺服器廣播 settlement 資料（含 net_chips）
    Then 顯示結算疊加層（SCR-009）
    And 顯示我的盈虧（來自 net_chips，Client 不計算）
    And 5 秒後自動關閉結算疊加層

  Scenario: 斷線重連
    When 網路中斷
    Then 顯示「重新連線中...」提示
    And 自動嘗試最多 5 次重連（間隔遞增）
    And 重連成功後恢復桌面狀態

  Scenario: Client 禁止包含遊戲邏輯計算
    Then Client TypeScript 不應包含 "compareCards" 關鍵字
    And Client TypeScript 不應包含 "calculatePoints" 關鍵字
    And Client TypeScript 不應包含 "Math.random" 關鍵字
