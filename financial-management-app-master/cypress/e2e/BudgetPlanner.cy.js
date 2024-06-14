describe("Budget Planner Component", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/#/");

    cy.get('[data-testid="test-planner"]').should("exist").click();
  });

  it("should load main page", () => {
    cy.visit("http://localhost:3000/#/");
    cy.get("h1").should("contain", "Test User");

    cy.get('[data-testid="logout-btn"]').should("not.exist");
  });

  it("should load income tracker page", () => {
    cy.visit("http://localhost:3000/#/income-tracker");
    cy.get("div").should("contain", "Save Needs");

    cy.get('[data-testid="logout-btn"]').should("not.exist");
  });

  it("should validate total calculation in budget form", () => {
    cy.visit("http://localhost:3000/#/income-tracker");
    cy.get('[data-testid="test-income"]').should("exist").click();

    cy.get('input[data-testid="input-number-test"]').click().type("10000");
    cy.get('[data-testid="dropdown-type-test"]').click();
    cy.get('[data-testid="dropdown-type-test-0"]').click();
    cy.get('[data-testid="dropdown-tax-test"]').click();
    cy.get('[data-testid="dropdown-tax-test-0"]').click();

    cy.get('[data-testid="btn-add-test"]').should("exist").click();

    cy.wait(1000);

    cy.visit("http://localhost:3000/#/budget-planner");
    cy.get('[data-testid="test-planner"]').should("exist").click();

    cy.get('[data-testid="budget-needs-input-Rent/Mortgage"]')
      .click()
      .type("2000");
    cy.get('[data-testid="budget-needs-input-Car Payment"]')
      .click()
      .type("2000");
    cy.get('[data-testid="budget-needs-input-Ăn uống"]').click().type("600");

    cy.get('[data-testid="total-amount-needs"]').should("contain", "4,600 $");

    cy.get('[data-testid="btn-needs"]').should("exist").click();

    cy.get('[data-testid="btn-wants"]').should("exist");

    cy.get('[data-testid="budget-wants-input-Travel"]').click().type("1000");
    cy.get('[data-testid="budget-wants-input-Shopping"]').click().type("1000");
    cy.get('[data-testid="budget-wants-input-Entertainment"]')
      .click()
      .type("760");

    cy.get('[data-testid="total-amount-wants"]').should("contain", "2,760 $");

    cy.get('[data-testid="btn-wants"]').should("exist").click();

    cy.get('[data-testid="btn-savings"]').should("exist");

    cy.get('[data-testid="budget-savings-input-Emergency Savings"]')
      .click()
      .type("1000");
    cy.get('[data-testid="budget-savings-input-Vacation Savings"]')
      .click()
      .type("440");
    cy.get('[data-testid="budget-savings-input-House Savings"]')
      .click()
      .type("400");

    cy.get('[data-testid="total-amount-savings"]').should("contain", "1,840 $");

    cy.get('[data-testid="btn-savings"]').should("exist").click();

    cy.get('[data-testid="total-needs"]').should("contain", "4,600 $");
    cy.get('[data-testid="total-wants"]').should("contain", "2,760 $");
    cy.get('[data-testid="total-savings"]').should("contain", "1,840 $");

    cy.get('[data-testid="logout-btn"]').should("not.exist");
  });

  it("should correctly split a total income after tax", () => {
    cy.visit("http://localhost:3000/#/taxes");
    cy.get('[data-testid="test-taxes"]').should("exist").click();

    cy.get('[data-testid="dropdown-status-test"]').click();
    cy.get('[data-testid="dropdown-status-test-1"]').click();

    cy.get('[data-testid="radio-yes-test"]').click();

    cy.get('[data-testid="btn-tax-calc-test"]').should("exist").click();

    cy.wait(1000);

    cy.visit("http://localhost:3000/#/budget-planner");
    cy.get('[data-testid="test-planner"]').should("exist").click();

    cy.get('[data-testid="total-tab-test"]').should("exist").click();

    cy.get('[data-testid="total-after-tax"]').should("contain", "9,235 $");

    cy.get('[data-testid="total-needs-after-tax"]').should("contain", "4,600$");
    cy.get('[data-testid="total-wants-after-tax"]').should("contain", "2,760$");
    cy.get('[data-testid="total-savings-after-tax"]').should(
      "contain",
      "1,840$"
    );

    cy.visit("http://localhost:3000/#/income-tracker");
    cy.get('[data-testid="test-income"]').should("exist").click();

    cy.get('[data-testid="delete-all-income-btn-test"]').should("exist");

    cy.get('[data-testid="delete-all-income-btn-test"]').click();

    cy.wait(1000);

    cy.get('[data-testid="income-list-item-test-0"]').should("not.exist");

    cy.get('[data-testid="logout-btn"]').should("not.exist");
  });
});
