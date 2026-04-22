# features/client/matchmaking.feature
# PDD SCR-005, SCR-006 配對流程 BDD Scenarios

Feature: 配對流程 (SCR-005, SCR-006)
  身為想開始遊戲的玩家
  我想選擇廳別並進入配對
  以便找到對手開始遊戲

  Scenario: 選擇廳別後進入配對等待
    Given 玩家在廳別選擇畫面（SCR-005）
    When 選擇「初級廳」並確認
    Then 進入配對等待畫面（SCR-006）
    And 顯示已等待秒數

  Scenario: 90 秒配對超時返回大廳
    Given 玩家在配對等待畫面
    When 等待超過 90 秒未配對成功
    Then 顯示「配對超時」提示
    And 2 秒後自動返回主大廳（SCR-004）

  Scenario: 玩家主動取消配對
    Given 玩家在配對等待畫面
    When 點擊「取消配對」
    Then 發送 leave 指令至 Colyseus
    And 返回主大廳（SCR-004）

  Scenario: 配對成功進入遊戲桌
    Given 玩家在配對等待畫面
    When Colyseus 回傳 CONNECTED 事件
    Then 自動導覽至遊戲桌面（SCR-007）
