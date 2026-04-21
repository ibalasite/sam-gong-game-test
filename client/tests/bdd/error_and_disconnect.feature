Feature: Error Handling and Disconnection UI
  As a player
  I want clear feedback when things go wrong
  So that I know what happened and what to do

  Scenario: Room full error shows toast
    Given I try to join a room that is full
    When server returns error 4002
    Then toast message "房間已滿（最多6人）" is displayed
    And I remain on the main menu

  Scenario: Disconnect overlay appears immediately on network loss
    Given I am in a game
    When I lose network connection
    Then a full-screen overlay appears with "重新連線中..."
    And a 60-second countdown is visible

  Scenario: Reconnect success hides overlay
    Given the disconnect overlay is shown
    When connection is restored within 60 seconds
    Then the overlay disappears
    And the game state is updated to current state

  Scenario: 60s timeout redirects to main menu
    Given the disconnect overlay has been shown for 60 seconds
    And reconnection failed
    Then toast "已離開房間" is displayed
    And I am redirected to the main menu

  Scenario: Insufficient chips button feedback
    Given the bet amount is 100
    And I have only 50 chips
    Then the "跟注" button is disabled
    And a "籌碼不足" label is visible below the button
