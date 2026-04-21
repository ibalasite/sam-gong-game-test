Feature: Game Lobby
  As a player
  I want to see the lobby with all players
  So that I know who is in the room before the game starts

  Scenario: Lobby displays room code
    Given I am in the game lobby
    Then the room code is displayed prominently
    And a copy button is available

  Scenario: Lobby shows all connected players
    Given I am in the lobby with 3 players
    Then I see 3 player slots filled
    And 3 empty slots shown

  Scenario: Start button only visible to host
    Given I am the room host
    Then the "開始遊戲" button is visible
    When I am not the host
    Then the "開始遊戲" button is hidden

  Scenario: Start button disabled with only 1 player
    Given I am the host
    And only 1 player is in the room
    Then the "開始遊戲" button is disabled

  Scenario: Start button enabled with 2+ players
    Given I am the host
    And 2 players are in the room
    Then the "開始遊戲" button is enabled

  Scenario: Room code copy button
    Given I am in the lobby
    When I click the copy button next to the room code
    Then the room code is copied to clipboard
    And a brief "已複製" confirmation appears
