Feature: Card Animations
  As a player
  I want smooth card animations
  So that the game feels polished and responsive

  Scenario: Dealing animation plays when cards are distributed
    Given the game transitions to dealing phase
    Then dealing animation plays (cards fly from center to each player)
    And animation completes within 1.5 seconds

  Scenario: Flip animation plays on card reveal
    Given the reveal phase begins
    When a card transitions from revealed=false to revealed=true
    Then a flip animation plays (rotateY 0→90→0)
    And the card face is shown after the flip

  Scenario: Win highlight animation plays for winner
    Given settlement results are received
    And I won this round
    Then a gold glow effect appears on my player slot
    And the effect is visible for at least 1 second

  Scenario: Chip counter animates on settlement
    Given my chips change from 1000 to 1050
    Then the chip counter animates smoothly from 1000 to 1050
    And the animation takes approximately 1 second
