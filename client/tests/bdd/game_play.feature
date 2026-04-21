Feature: Game Play Scene
  As a player
  I want to see the game board and interact with game phases
  So that I can play Sam Gong smoothly

  Scenario: Banker is visually identified
    Given the game is in betting phase
    And P1 is the banker
    Then P1's player slot shows a crown icon (莊家標識)
    And P1's slot border is gold colored

  Scenario: Betting panel shown to non-banker players
    Given the game is in betting phase
    And I am not the banker
    Then the betting panel is visible with "跟注" and "棄牌" buttons
    And a 30-second countdown timer is visible

  Scenario: Betting panel hidden from banker during betting
    Given the game is in betting phase
    And I am the banker
    Then the betting panel is not visible to me
    And I see "等待閒家押注" status

  Scenario: My cards are visible to me
    Given the game is in dealing phase
    And my cards are [♠A, ♥7, ♣3]
    Then my card components show the face of each card
    And my point total "點數: 1" is displayed

  Scenario: Other players' cards are shown face-down before reveal
    Given the game is in dealing phase
    And P2 has been dealt cards
    When I look at P2's card area
    Then P2's cards are displayed as card backs (not face)
    And I cannot see P2's card values

  Scenario: Countdown shows urgent state at 5 seconds
    Given the betting countdown is at 5 seconds
    Then the countdown timer turns red
    And the timer pulses/blinks

  Scenario: Game result shows win/lose status
    Given reveal phase is complete
    And I won this round
    Then my player slot shows "WIN" with gold highlight
    And my chips increase animation plays

  Scenario: Phase-appropriate UI is shown
    Given the game transitions to "settling" phase
    Then the betting panel is hidden
    And settlement results overlay appears
