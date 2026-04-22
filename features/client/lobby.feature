# features/client/lobby.feature
# PDD SCR-004 主大廳 BDD Scenarios

Feature: 主大廳 (SCR-004)
  身為已登入玩家
  我想在主大廳看到我的籌碼餘額並選擇遊戲模式
  以便開始遊戲或查看排行榜

  Background:
    Given 玩家已成功登入
    And 玩家當前不在任何遊戲房間中

  Scenario: 顯示玩家籌碼餘額
    When 進入主大廳畫面
    Then 應顯示玩家暱稱
    And 應顯示來自伺服器的籌碼餘額
    And 籌碼餘額格式為 "🪙 {數字}" 千分位格式

  Scenario: 快速配對按鈕可用
    Given 玩家籌碼餘額 >= 最低廳別入場費
    When 進入主大廳畫面
    Then 快速配對按鈕應為可點擊狀態

  Scenario: 已在房間中時禁止二次配對（Single Room Constraint）
    Given 玩家已在遊戲房間中（room_active=true）
    When 進入主大廳畫面
    Then 快速配對按鈕應為 disabled 狀態

  Scenario: 進入新手教學
    When 點擊「新手教學」按鈕
    Then 應導覽至教學畫面（SCR-008）

  Scenario: 進入排行榜
    When 點擊「排行榜」圖示
    Then 應導覽至排行榜畫面（SCR-010）

  Scenario: 進入個人帳號頁
    When 點擊「帳號」圖示
    Then 應導覽至個人資料畫面（SCR-013）
