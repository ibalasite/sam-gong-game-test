Feature: Main Menu
  As a player
  I want to create or join a game from the main menu
  So that I can start playing Sam Gong

  Scenario: Create Room button navigates to lobby
    Given I am on the main menu
    When I click "創建房間"
    Then GameManager.createRoom() is called
    And I see a 6-character room code displayed
    And I am taken to the game lobby scene

  Scenario: Join Room with valid code
    Given I am on the main menu
    And I enter "ABC123" in the room code input
    When I click "加入房間"
    Then GameManager.joinRoom("ABC123") is called
    And I am taken to the game lobby scene

  Scenario: Join Room with invalid code shows error
    Given I am on the main menu
    And I enter "XXXXXX" in the room code input
    When I click "加入房間"
    And the server returns error 4001
    Then a toast message "找不到房間，請確認房間碼" is displayed
    And I remain on the main menu

  Scenario: Join button disabled when input is empty
    Given I am on the main menu
    And the room code input is empty
    Then the "加入房間" button is disabled
