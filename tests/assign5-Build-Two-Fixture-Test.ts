/*
Title: Build a Two-Fixture Test — Login Fixture + Event Creation Fixture

Using EventHub, build a test suite where the test body itself is only two lines — all the heavy
lifting (login, event creation) happens inside custom fixtures.

Given:
  Login page: https://eventhub.rahulshettyacademy.com/login
  Events API: https://api.eventhub.rahulshettyacademy.com/api/docs/#/Events/post_events

Task 1 — authenticatedPage fixture
  Build a fixture that logs into EventHub through the UI (fill email/password, click login) and
  yields a page object that's already past the login screen. Any test that asks for this fixture
  should be able to go straight to /events without writing a single login step itself.

Task 2 — createEvent fixture
  Build a fixture that calls the POST /events API directly (no UI) to create a new event before
  the test runs, and yields the API response (containing the new event's name/ID) to the test.

Task 3 — The test
  Write a test that:
    - Uses authenticatedPage to land on the events page (already logged in)
    - Uses createEvent to know what event was just created
    - Asserts that event's name is visible on the page

  The test body should contain no login code and no API call — just a navigation line and an
  assertion line, reading off what the two fixtures already set up.
*/

import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

// Dummy account created only for this practice site.
const USER = { email: 'sivaqa.yahoo.user@example.com', password: 'Test@1234' };

type CreatedEvent = { id: number; title: string };

type Fixtures = {
  authenticatedPage: Page;
  createEvent: CreatedEvent;
};

const test = base.extend<Fixtures>({
  // Task 1 - logs in through the UI and hands over a page that is already past the login screen.
  authenticatedPage: async ({ page }, use) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('you@email.com').fill(USER.email);
    await page.getByPlaceholder('••••••').fill(USER.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).not.toHaveURL(/\/login/);
    await use(page);
  },

  // Task 2 - creates an event through the API (no UI) and hands over the response data.
  createEvent: async ({ request }, use) => {
    const loginRes = await request.post(`${API_URL}/auth/login`, { data: USER });
    expect(loginRes.ok()).toBeTruthy();
    const { token } = await loginRes.json();

    const eventRes = await request.post(`${API_URL}/events`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: `Fixture Event ${Date.now()}`,
        description: 'Event created by the createEvent fixture.',
        category: 'Conference',
        venue: 'Test Venue',
        city: 'Toronto',
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        price: 100,
        totalSeats: 50,
      },
    });
    expect(eventRes.ok()).toBeTruthy();
    const { data } = await eventRes.json();

    await use(data);
  },
});

// Task 3 - the test body is only a navigation line and an assertion line.
test('newly created event is visible on the events page', async ({ authenticatedPage, createEvent }) => {
  await authenticatedPage.goto(`${BASE_URL}/events`);
  await expect(authenticatedPage.getByText(createEvent.title)).toBeVisible();
});
