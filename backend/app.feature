Feature: Coffee API
  As a coffee shop application
  I want to provide reliable API endpoints
  So that customers can view ingredients and place orders

  Background:
    Given the Coffee API is running and accessible

  @ingredients
  Scenario: Successfully fetch ingredients
    When I send a GET request to "/ingredients"
    Then the response status should be 200
    And the response should be a JSON array
    And the array should contain at least 1 ingredient
    And each ingredient should have the following properties:
      | property   | type    |
      | id         | number  |
      | ingredient | string  |
      | additional | boolean |

  @ingredients @headers
  Scenario: Ingredients endpoint returns proper headers
    When I send a GET request to "/ingredients"
    Then the response status should be 200
    And the response should have "content-type" header
    And the "content-type" header should include "application/json"

  @ingredients @categorization
  Scenario: Ingredients are properly categorized
    When I send a GET request to "/ingredients"
    Then the response status should be 200
    And the response should contain base ingredients
    And the response should contain additional ingredients

  @ingredients @error-handling
  Scenario: Handle invalid ingredients endpoint gracefully
    When I send a GET request to "/invalid-ingredients"
    Then the response status should be 404 or 500

  @ingredients @performance
  Scenario: Ingredients endpoint responds quickly
    When I send a GET request to "/ingredients"
    Then the response status should be 200
    And the response time should be less than 1000 milliseconds

  @order @success
  Scenario: Successfully submit a valid order
    Given I have a valid order payload:
      """
      [
        {
          "id": 1,
          "ingredient": "Expresso",
          "additional": false,
          "price": 5
        },
        {
          "id": 3,
          "ingredient": "Chocolate",
          "additional": false,
          "price": 4
        }
      ]
      """
    When I send a POST request to "/order" with the payload
    Then the response status should be 200
    And the response should have a "message" property
    And the message should be a non-empty string

  @order @validation
  Scenario: Reject order with missing required fields
    Given I have an order payload with missing fields:
      """
      [
        {
          "ingredient": "Expresso"
        }
      ]
      """
    When I send a POST request to "/order" with the payload
    Then the response status should be 400

  @order @validation
  Scenario: Reject empty order
    Given I have an empty order payload: "[]"
    When I send a POST request to "/order" with the payload
    Then the response status should be 400 or 422
    And the response should have an "error" property

  @order @validation
  Scenario: Handle malformed JSON in order request
    Given I have malformed JSON: '{"invalid": json}'
    When I send a POST request to "/order" with the malformed JSON
    Then the response status should be 400 or 422

  @order @validation
  Scenario: Handle large invalid order payloads
    Given I have a large order payload with 100 invalid items
    When I send a POST request to "/order" with the large payload
    Then the response status should be 400, 413, or 422

  @order @concurrency
  Scenario: Handle concurrent order submissions
    Given I have 5 valid order payloads
    When I send 5 simultaneous POST requests to "/order"
    Then all responses should have status 200
    And all responses should have a "message" property

  @order @performance
  Scenario: Order submission responds quickly
    Given I have a valid order payload
    When I send a POST request to "/order" with the payload
    Then the response status should be 200
    And the response time should be less than 2000 milliseconds

  @security @sql-injection
  Scenario: Prevent SQL injection attacks
    Given I have a malicious SQL injection payload:
      """
      [
        {
          "id": "1'; DROP TABLE ingredients; --",
          "ingredient": "Expresso",
          "additional": false
        }
      ]
      """
    When I send a POST request to "/order" with the malicious payload
    Then the response status should be 400 or 422

  @security @xss
  Scenario: Prevent XSS attacks in ingredient names
    Given I have an XSS attack payload:
      """
      [
        {
          "id": 1,
          "ingredient": "<script>alert('xss')</script>",
          "additional": false
        }
      ]
      """
    When I send a POST request to "/order" with the XSS payload
    Then the response status should be 400 or 422

  @security @validation
  Scenario: Validate data types in order payload
    Given I have an order payload with invalid data types:
      """
      [
        {
          "id": "not-a-number",
          "ingredient": 123,
          "additional": "not-a-boolean"
        }
      ]
      """
    When I send a POST request to "/order" with the invalid payload
    Then the response status should be 400 or 422

  @security @payload-size
  Scenario: Handle oversized payloads
    Given I have an oversized payload with 10000 items
    When I send a POST request to "/order" with the oversized payload
    Then the response status should be 400, 413, 422, or 500

  @error-handling
  Scenario: Return proper error format
    When I send a POST request to "/order" with null payload
    Then if the response status is 400 or higher
    And the response should have an "error" property
    And the error should be a string

  @error-handling
  Scenario Outline: Handle invalid HTTP methods
    When I send a <method> request to "<endpoint>"
    Then the response status should be 404 or 405

    Examples:
      | method | endpoint     |
      | DELETE | /order       |
      | PUT    | /ingredients |

  @error-handling
  Scenario: Handle missing endpoints
    When I send a GET request to "/nonexistent"
    Then the response status should be 404

  @performance @load-testing
  Scenario: Handle multiple simultaneous requests
    When I send 10 simultaneous GET requests to "/ingredients"
    Then all responses should have status 200

  @performance @load-testing
  Scenario: Maintain performance under load
    Given I have a valid order payload
    When I send 20 simultaneous POST requests to "/order"
    Then the average response time should be less than 1000 milliseconds

  @data-integrity
  Scenario: Maintain consistent ingredient data across requests
    When I send a GET request to "/ingredients"
    And I store the response data
    And I send another GET request to "/ingredients"
    Then the second response should be identical to the first response

  @cors @headers
  Scenario: Include proper CORS headers
    When I send an OPTIONS request to "/ingredients"
    Then if CORS is implemented
    And the response should have "access-control-allow-origin" header
    And the response should have "access-control-allow-methods" header