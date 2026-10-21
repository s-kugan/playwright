@errors
Feature: Error Validations

  Scenario Outline: Login with invalid credentials
    Given a user opens the e-commerce website
    When the user submits login with "<username>" and "<password>"
    Then the login error "<errorMessage>" is displayed

    Examples:
      | username          | password      | errorMessage                |
      | wrong@example.com | WrongPass@123 | Incorrect email or password |
      | ${USER_EMAIL}     | WrongPass@123 | Incorrect email or password |


