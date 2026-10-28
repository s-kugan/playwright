import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// Practice-site account.
const USER = { email: 'skugan@mailinator.com', password: 'Abcd@1234' };

// The booking flow before the refund check is slow, so give each test more than the default 30s.
test.setTimeout(60_000);

async function loginAndGoToBooking(page: Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('you@email.com').fill(USER.email);
  await page.getByLabel('Password').fill(USER.password);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

// Books the first event with the given number of tickets and opens its booking detail page.
async function bookFirstEventAndOpenDetails(page: Page, tickets: number) {
  await page.goto(`${BASE_URL}/events`);
  const firstCard = page.getByTestId('event-card').first();
  await expect(firstCard).toBeVisible();
  await firstCard.getByTestId('book-now-btn').click();

  // Quantity defaults to 1, so only the extra clicks are needed.
  for (let i = 1; i < tickets; i++) {
    await page.locator('button:has-text("+")').click();
  }
  await expect(page.locator('#ticket-count')).toHaveText(String(tickets));

  await page.getByLabel('Full Name').fill('Test User');
  await page.locator('#customer-email').fill(USER.email);
  await page.getByPlaceholder('+91 98765 43210').fill('+91 98765 43210');
  await page.locator('.confirm-booking-btn').click();

  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);
  await page.getByRole('link', { name: 'View Details' }).first().click();
  await expect(page.getByText('Booking Information')).toBeVisible();
}

async function validateBookingRef(page: Page) {
  // The detail page has no .booking-ref class; the ref (e.g. D-UMW0F5) is shown in the header and breadcrumb.
  const bookingRef = (await page.getByText(/^[A-Z]-[A-Z0-9]{6}$/).first().innerText()).trim();
  const eventTitle = (await page.locator('h1').first().innerText()).trim();
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));
}

async function checkRefundEligibility(page: Page) {
  await page.getByRole('button', { name: /eligibility for refund/i }).click();
  await expect(page.locator('#refund-spinner')).toBeVisible();
  await expect(page.locator('#refund-spinner')).toBeHidden({ timeout: 6000 });
}

test('@Assign7 single ticket booking is eligible for refund', async ({ page }) => {
  await loginAndGoToBooking(page);
  await bookFirstEventAndOpenDetails(page, 1);
  await validateBookingRef(page);
  await checkRefundEligibility(page);

  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Eligible for refund');
  await expect(result).toContainText('Single-ticket bookings qualify for a full refund');
});

test('@Assign7 group ticket booking is NOT eligible for refund', async ({ page }) => {
  await loginAndGoToBooking(page);
  await bookFirstEventAndOpenDetails(page, 3);
  await validateBookingRef(page);
  await checkRefundEligibility(page);

  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Not eligible for refund');
  await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
});

/*
Assignment instructions

What you are testing: Two separate tests — one booking with 1 ticket should show "Eligible for refund",
a booking with 3 tickets should show "Not eligible for refund".
Both tests verify the spinner appears and disappears before showing the result.
Write both tests in one file.

Setup
- BASE_URL = https://eventhub.rahulshettyacademy.com
- Credentials: Use your own credentials
- Write a reusable loginAndGoToBooking(page) helper that logs in and confirms the Browse Events → link
  is visible

Test 1 — Single ticket booking is eligible for refund

Step 1 — Login
- Call your login helper

Step 2 — Book first event with 1 ticket (default)
- Navigate to /events
- Click Book Now on the very first event card (locate data-testid="event-card" → first →
  data-testid="book-now-btn")
- Fill Full Name, Email (your email), Phone
- Click confirm button (.confirm-booking-btn)

Step 3 — Navigate to booking detail
- Click View My Bookings link
- Assert URL is /bookings
- Click the first View Details link
- Assert: text Booking Information is visible on the page

Step 4 — Validate booking ref
- Read booking ref from page
- Read event title from h1
- Assert validation: "first character of booking ref equals first character of event title"

Step 5 — Check refund eligibility
- Click the Check Refund Eligibility button
- Assert: spinner element (#refund-spinner) is immediately visible
- Assert: spinner is no longer visible within 6 seconds

Step 6 — Validate result
- Locate result element by id #refund-result
- Assert it is visible
- Assert it contains text Eligible for refund
- Assert it contains text Single-ticket bookings qualify for a full refund

---

Test 2 — Group ticket booking is NOT eligible for refund

Steps 1–2 — Same as Test 1, except after navigating to the event detail page, click the + button twice
to increase quantity to 3 before filling the form
- Locate the increment button with button:has-text("+") and click it twice

Steps 3–5 — Identical to Test 1

Step 6 — Validate result (different assertions)
- Assert result contains Not eligible for refund
- Assert result contains Group bookings (3 tickets) are non-refundable

Questions for this assignment
Complete Playwright code for given assignment instructions
*/
