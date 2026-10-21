Feature: Ecommerce order

  # ${NAME} values are read from the matching environment variable (.env)
  @orders
  Scenario Outline: Placing the Order
    Given a user is login to e-commerce website with "<username>" and "<password>"
    When Add "<productName>" to Cart
    Then Verify "<productName>" is displayed in the Cart
    When Enter valid details and Place the Order
    Then Verify order is present in the OrderHistory

    Examples:
      | username      | password         | productName |
      | ${USER_EMAIL} | ${USER_PASSWORD} | ${PRODUCT_NAME} |

  @errors
  Scenario Outline: Login with invalid credentials
    Given a user opens the e-commerce website
    When the user submits login with "<username>" and "<password>"
    Then the login error "<errorMessage>" is displayed

    Examples:
      | username          | password      | errorMessage                |
      | wrong@example.com | WrongPass@123 | Incorrect email or passwordeeeeee |
      | ${USER_EMAIL}     | WrongPass@123 | Incorrect email or password |





