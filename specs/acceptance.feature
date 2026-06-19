Feature: Last Impossible Round-Island Train

  Scenario: Start a new bilingual journey
    Given no valid save exists
    When the player starts a Traditional Chinese game
    Then time is 15
    And fare is 1500
    And memory fragments are 0
    And ticket stamps are 0
    And the first destination is Jiufen and the Pingxi Line

  Scenario: Switch language without losing progress
    Given the player has completed one region
    When the player switches from Traditional Chinese to English
    Then the current region is unchanged
    And all resources are unchanged
    And visible interface text is English

  Scenario: Incorrect answers remain recoverable
    Given the player is solving a landmark puzzle
    When the player chooses an incorrect answer
    Then a gentle hint is shown
    And time is reduced by the configured amount
    And the player can continue

  Scenario: Resources never produce a hard game over
    Given the player's fare reaches zero
    When the next travel decision begins
    Then the conductor offers a basic route
    And the journey remains playable

  Scenario: Determine a normal ending
    Given the player has six ticket stamps
    And the player does not qualify for Penghu
    When the final choice is resolved
    Then exactly one normal ending is selected

  Scenario: Unlock the Penghu seventh station
    Given the player has six memory fragments
    And the player has the secret ticket
    And the player has six ticket stamps
    When the East region is repaired
    Then the Penghu seventh station becomes available

  Scenario: Save and resume locally
    Given the player has completed two regions
    When the browser is closed and reopened
    Then the journey can resume from the saved region
    And all resources and clues are restored

  Scenario: Respect reduced motion
    Given the operating system requests reduced motion
    When the game loads
    Then decorative train and watercolor animations are disabled or reduced

  Scenario: Play on a mobile viewport
    Given a 390 by 844 viewport
    When a challenge opens
    Then no primary control is clipped
    And the status resources remain readable
    And choices can be operated by touch
