# Playwright Automation Framework

This repository contains an end-to-end test automation framework built using **Playwright** with **TypeScript**. The framework utilizes the **Page Object Model (POM)** design pattern to ensure code reusability and maintainability, driven by external data and locators.

## 🚀 Key Features

* **Page Object Model (POM):** Separates UI interaction logic from test logic.
* **Externalized Locators:** Selectors are stored in easily manageable `.properties` files (`locators/`).
* **Data-Driven Testing:** Test data is structured and stored in JSON files (`test-data/`).
* **Utility Helpers:** Custom logic to read and parse external configuration and data files.
* **Parallel Execution:** Configured for maximum efficiency via concurrent test runs.
* **Resiliency:** Automatic retries are set up for increased test stability.
* **Cross-Browser:** Supports Chromium, Firefox, and WebKit (configured in `playwright.config.ts`).

---

## 📂 Project Structure

The project follows a modular structure for maintainability:

```text
├── locators/            # Stores all UI element selectors in .properties files
├── pages/               # Page Object Model classes
│   ├── BasePage.ts      # Contains common browser interaction methods
│   └── [PageName].ts    # Specific page objects for application views
├── test-data/           # JSON files containing test input data (e.g., login credentials, user details)
├── tests/               # Test specification files (*.spec.ts)
├── utility/             # Helper functions to read properties files and test data
├── playwright.config.ts # Playwright configuration (Projects, Retries, Parallelism, Base URL)
├── package.json         # Project dependencies and executable scripts
└── README.md            # Project documentation


🛠️ Prerequisites
Ensure you have the following installed to run the tests:

-  Node.js (v14 or higher)

- npm (Node Package Manager)

📦 Installation and Setup
1. Clone the repository:
- git clone https://github.com/erif95/multibank-playwright-web-automation.git
- cd your-repo-name
2. install dependencies
- npm install
3. Install Playwright browsers 
- npx playwright install
🏃 Running Tests
4. Default Run (Headless)
- Runs all tests using the default configuration (usually Chromium, headless)
- npx playwright test
5. Runs all tests with the browser window visible
- npx playwright test --headed --project=chromium
- npx playwright test --headed --project=firefox
- npx playwright test --headed --project=webkit
6. Run specified test and specified browsers with tag non headless
- npx playwright test -g "TD03" --project=chromium --headed (eg. trade tag TD01,TD02,TD03,TD04)
- npx playwright test -g "TC01" --project=firefox --headed (eg. homepage tag TC01,TC02,TC03,TC04,TC05,TC06,TC07,TC08)
7. change retry mechanism and paralel execution in playwright.config.ts 
- current retries = 3, please change into your needed
- run paralel 
  fullyParallel: true, set workers in every browser 
