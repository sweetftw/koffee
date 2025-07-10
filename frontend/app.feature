Feature: Coffee App 
  As a coffee enthusiast
  I want to create custom coffee recipes by selecting ingredients
  So that I can order personalized coffee drinks

  Background:
    Given the Api is available
    And the following ingredients are available:
      | Ingredient         | Type       |
      | Expresso          | Base       |
      | Leite             | Base       |
      | Chocolate         | Base       |
      | Sorvete           | Base       |
      | Espuma            | Base       |
      | Caramelo          | Additional |
      | Calda de Chocolate| Additional |
      | Chantily          | Additional |
      | Canela            | Additional |
    When I visit the Coffee App

  Scenario: Application loads with ingredients
    Then I should see more than 0 base ingredients
    And I should see more than 0 additional ingredients
    And I should see all base ingredients displayed:
      | Expresso  |
      | Leite     |
      | Chocolate |
      | Sorvete   |
      | Espuma    |
    And I should see all additional ingredients displayed:
      | Caramelo           |
      | Calda de Chocolate |
      | Chantily           |
      | Canela             |

  Scenario: Select single base ingredient
    When I select "Expresso" ingredient
    Then "Expresso" should be marked as selected
    And I should see "Expresso" in the recipe list
    And the coffee name should display "Expresso"

  Scenario: Select multiple base ingredients
    When I select "Expresso" ingredient
    And I select "Chocolate" ingredient
    And I select "Espuma" ingredient
    Then "Expresso" should be marked as selected
    And "Chocolate" should be marked as selected
    And "Espuma" should be marked as selected
    And the coffee name should display "Expresso com Chocolate, Espuma"

  Scenario: Deselect ingredients
    Given I have selected "Expresso" ingredient
    When I click "Expresso" ingredient again
    Then "Expresso" should not be marked as selected
    And "Expresso" should not appear in the recipe list
    And the coffee name should be empty

  Scenario: Prevent selecting more than 3 base ingredients
    Given I have selected 3 base ingredients:
      | Expresso |
      | Leite    |
      | Espuma   |
    When I try to select "Chocolate" ingredient
    Then "Chocolate" should not be marked as selected
    And I should see exactly 3 selected base ingredients
    And I should see the error message "Maximo de ingredientes base atingido!"

  Scenario: Select additional ingredients
    Given I have selected "Expresso" ingredient
    When I select "Canela" additional ingredient
    And I select "Chantily" additional ingredient
    Then "Canela" should be marked as selected
    And "Chantily" should be marked as selected
    And I should see "Canela" in the recipe list
    And I should see "Chantily" in the recipe list

  Scenario: Prevent selecting more than 2 additional ingredients
    Given I have selected "Expresso" ingredient
    And I have selected 2 additional ingredients:
      | Canela   |
      | Chantily |
    When I try to select "Caramelo" additional ingredient
    Then "Caramelo" should not be marked as selected
    And I should see exactly 2 selected additional ingredients
    And I should see the error message "Maximo de ingredientes adicionais atingido!"

  Scenario: Recognize Affogato special coffee
    When I select "Sorvete" ingredient
    And I select "Expresso" ingredient
    Then the special coffee name should display "Affogato Especial:"
    And I should see the success message "Cafe especial criado: Affogato"

  Scenario: Show custom coffee for non-special recipes
    When I select "Expresso" ingredient
    And I select "Chocolate" ingredient
    Then the special coffee name should display "Cafe Personalizado:"

  Scenario: Clear all selections
    Given I have selected the following ingredients:
      | Expresso |
      | Leite    |
      | Canela   |
    When I click the clear button
    Then no ingredients should be selected
    And the recipe list should be empty
    And the coffee name should be empty
    And the special coffee name should be empty

  Scenario: Submit valid order successfully
    Given I have selected "Expresso" ingredient
    And I have selected "Leite" ingredient
    When I submit the order
    Then the order should be sent with the correct ingredients:
      | Expresso |
      | Leite    |
    And all selections should be cleared
    And the coffee name should be empty

  Scenario: Prevent submitting order without base ingredients
    Given I have not selected any base ingredients
    When I try to submit the order
    Then I should see the error message "Minimo 1 ingrediente base deve ser selecionado"
    And the order should not be submitted

  Scenario: Handle API error during order submission
    Given I have selected "Expresso" ingredient
    And the order API will return an error
    When I submit the order
    Then "Expresso" should remain selected
    And the coffee name should still display "Expresso"

  Scenario: Handle ingredients API failure
    Given the ingredients API is unavailable
    When I visit the Coffee App
    Then I should see 0 base ingredients
    And I should see 0 additional ingredients

  Scenario: Application loads within performance threshold
    When I visit the Coffee App
    Then the ingredients should load in 3 seconds or less

  Scenario Outline: Create different special coffee combinations
    When I select "<ingredient1>" ingredient
    And I select "<ingredient2>" ingredient
    Then the special coffee name should display "<expected_name>"

    Examples:
      | ingredient1 | ingredient2 | expected_name    |
      | Sorvete     | Expresso    | Affogato Especial: |
      | Expresso    | Leite       | Latte Especial:    |

  Scenario: Maximum ingredient selection validation
    Given I want to test ingredient limits
    When I select 3 base ingredients
    And I select 2 additional ingredients
    Then I should have 5 total ingredients selected
    And I should not be able to select more base ingredients
    And I should not be able to select more additional ingredients

  Scenario: Recipe persistence during interaction
    Given I have created a custom coffee recipe
    When I interact with other UI elements
    Then my recipe selections should remain unchanged
    Until I explicitly clear or submit the order