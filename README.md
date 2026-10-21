# Playwright Test Automation

End-to-end UI and API test automation built with **Playwright** and **TypeScript**, using the Page Object Model. The project also includes a **Cucumber (BDD)** suite and can run on **Azure Playwright Workspaces** (cloud browsers).

The sample application under test is the Rahul Shetty Academy e-commerce client app (login, add to cart, checkout, orders).

## Tech stack

- [Playwright Test](https://playwright.dev/) `^1.63` with TypeScript
- [Cucumber.js](https://github.com/cucumber/cucumber-js) for BDD scenarios (`features/`)
- Azure Playwright Workspaces (`@azure/playwright`, `@azure/identity`)
- Allure reporter (`allure-playwright`)
- `dotenv` for configuration, `tsx` to run TypeScript in Cucumber, `cross-env` for cross-platform env vars

## Project structure

```text
.
├── tests/                      Playwright specs (UI, API, network mocking, visual snapshots)
├── pageobjects/                Page Object Model (Login, Dashboard, Checkout, Orders, POManager)
├── utils/                      API helpers, custom fixtures, extended test base
├── features/                   Cucumber feature files, step definitions, hooks, world
├── testdata.json               Data-driven inputs (product names)
├── playwright.config.ts        Default config (7 projects, HTML reporter)
├── playwright.configone.ts     Headless config: Edge / Firefox / mobile WebKit, 1 retry, 3 workers
├── playwright.service.config.ts  Azure Playwright Workspaces config (cloud run + report upload)
├── cucumber.js                 Cucumber configuration
└── .github/workflows/          GitHub Actions workflow
```

### Spec files

| File | What it covers |
|---|---|
| `order.spec.ts` | Data-driven end-to-end order placement, fixture-based order, and an intentional failing demo test (`@Order`) |
| `placeorder.spec.ts` | Client app login (`@Order`) |
| `WebAPIPart1.spec.ts`, `WebAPIPart2.spec.ts` | API login/order combined with UI (`@WebAPI`, `@Webst`) |
| `NetworkMockRequest.spec.ts`, `NetworkMockResponse.spec.ts` | Request interception and response mocking (`@API`) |
| `MoreValidations.spec.ts` | Extra validations and visual snapshot comparisons |
| `fixturesDemo.spec.ts`, `speciallocators.spec.ts`, `example.spec.ts` | Fixtures and locator practice |

## Prerequisites

- Node.js (LTS) and npm
- Microsoft Edge and/or Google Chrome installed (some projects use `channel: 'msedge'` / `'chrome'`)
- Azure CLI (`az login`) only if you run on Azure Playwright Workspaces

## Setup

```bash
git clone https://github.com/s-kugan/playwright.git
cd playwright
npm ci
npx playwright install
```

### Environment variables

Create a `.env` file in the project root. It is git-ignored and must never be committed.

```ini
BASE_URL=<application login page URL>
USER_EMAIL=<test user email>
USER_PASSWORD=<test user password>
```

| Variable | Used by |
|---|---|
| `BASE_URL` | Page objects and specs (`order.spec.ts`, Cucumber steps, mock tests) |
| `USER_EMAIL`, `USER_PASSWORD` | Login in specs, fixtures and Cucumber steps |
| `HEADLESS` | Cucumber browser mode (`false` shows the browser) |
| `PLAYWRIGHT_SERVICE_URL` | Azure Playwright Workspaces runs (set by the service setup) |

## Running tests

### npm scripts

| Command | Description |
|---|---|
| `npm run ordertest` | `@Order` tests on Edge, headed (`playwright.configone.ts`) |
| `npm run APITest` | `@API` tests on Edge, headed (`playwright.configone.ts`) |
| `npm run WebAPI` | `@WebAPI` tests on Chromium, headed |
| `npm run mobiletest` | `@Order` tests on the Galaxy S24 mobile project |
| `npm run cucumber` | All Cucumber scenarios |
| `npm run cucumberEcommerce` | Ecommerce feature, 2 parallel workers, 2 retries, HTML report |

### Common Playwright commands

```bash
# Everything, default config
npx playwright test

# One project
npx playwright test --project=chromium

# By tag, headed, with a given number of workers
npx playwright test --grep "@Order" --project=Edge --headed --workers=2

# Single file
npx playwright test tests/order.spec.ts

# Open the HTML report
npx playwright show-report
```

Note: `tests/order.spec.ts` runs in serial mode because all tests share one account and its server-side cart. The "Copy prompt demo" test in that file fails on purpose and is also matched by `@Order`.

### Run on Azure Playwright Workspaces

```bash
az login
npx playwright test --grep "@Order" --config playwright.service.config.ts --project=Edge --headed --workers=2
```

- Do not pass `--reporter` on the command line. It overrides the reporter list in the config and the `@azure/playwright/reporter` upload will not run (the portal then shows an HTTP 404 for the report).
- The identity you sign in with needs the **Storage Blob Data Contributor** role on the workspace's linked storage account.
- The workspace must have a storage account linked under Reporting.

## Reports

| Report | Location | How to open |
|---|---|---|
| Playwright HTML | `playwright-report/` | `npx playwright show-report` |
| Cucumber HTML | `cucumber-report.html` | Open in a browser |
| Allure | `allure-results/` | `npx allure generate allure-results -o allure-report --clean` and `npx allure open allure-report` (requires the Allure CLI) |
| Azure Playwright Workspaces | Azure portal | Published URL printed at the end of the run |

Traces and screenshots are captured on every test run (see `use` in the configs). View a trace with `npx playwright show-trace <path-to-trace.zip>`.

## Continuous integration

`.github/workflows/playwright.yml` runs on every push and pull request to `main` or `master`. It installs dependencies and browsers, runs `npx playwright test` and uploads `playwright-report/` as an artifact.

Add `BASE_URL`, `USER_EMAIL` and `USER_PASSWORD` as repository secrets (Settings > Secrets and variables > Actions) and expose them to the test step, for example:

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    BASE_URL: ${{ secrets.BASE_URL }}
    USER_EMAIL: ${{ secrets.USER_EMAIL }}
    USER_PASSWORD: ${{ secrets.USER_PASSWORD }}
```

## What is not committed

`.env`, `state.json` (saved login state), `node_modules/`, generated reports and result folders, and local notes files are listed in `.gitignore`.

## License

See [LICENSE](LICENSE).
