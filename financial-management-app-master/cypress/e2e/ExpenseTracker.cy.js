describe("Expense Tracker Component", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/#/expense-tracker");
  });

  it("should load main page", () => {
    cy.visit("http://localhost:3000/#/");
    cy.get("h1").should("contain", "Test User");

    cy.get('[data-testid="logout-btn"]').should("not.exist");
  });

  it("should load income tracker page", () => {
    cy.visit("http://localhost:3000/#/income-tracker");
    cy.get("h2").should("contain", "Write down your expense");

    cy.get('[data-testid="logout-btn"]').should("not.exist");
  });

  it("should give an error if input empty", () => {
    cy.get('[data-testid="btn-add-test"]').click();

    cy.get("p").should("contain", "Enter the value");

    cy.get('[data-testid="logout-btn"]').should("not.exist");
  });

  it("should fill out the income form and add income item", () => {
    cy.get('input[data-testid="input-number-test"]').click().type("10000");
    cy.get('input[data-testid="input-desc-test"]').click().type("Rent");
    cy.get('[data-testid="dropdown-category-test"]').click();
    cy.get('[data-testid="dropdown-category-test-1"]').click();
    cy.get('[data-testid="dropdown-type-test"]').click();
    cy.get('[data-testid="dropdown-type-test-1"]').click();

    cy.get('[data-testid="btn-add-test"]').should("exist").click();

    cy.wait(1000);

    cy.get('input[data-testid="input-number-test"]').click().type("5000");
    cy.get('input[data-testid="input-desc-test"]').click().type("Lease");
    cy.get('[data-testid="dropdown-category-test"]').click();
    cy.get('[data-testid="dropdown-category-test-2"]').click();
    cy.get('[data-testid="dropdown-type-test"]').click();
    cy.get('[data-testid="dropdown-type-test-0"]').click();

    cy.get('[data-testid="btn-add-test"]').should("exist").click();

    cy.wait(1000);

    cy.get('[data-testid="expense-list-item-test-0"]').should("exist");
    cy.get('[data-testid="expense-list-item-test-1"]').should("exist");

    cy.get('[data-testid="total-expense-test"]').should("contain", "15,000");
    cy.get('[data-testid="total-expense-test-Tiền trọ"]').should(
      "contain",
      "10,000"
    );
    cy.get('[data-testid="total-expense-test-Transport"]').should(
      "contain",
      "5,000"
    );

    cy.get('[data-testid="logout-btn"]').should("not.exist");
  });

  it("should delete an expenses items", () => {
    cy.get('[data-testid="expense-list-item-test-1"]').should("exist");

    cy.get('[data-testid="expense-list-item-test-0"]').should("exist");

    cy.get('[data-testid="delete-btn-expense-item-test-0"]').click();

    cy.wait(1000);

    cy.get('[data-testid="delete-btn-expense-item-test-0"]').click();

    cy.wait(1000);

    cy.get('[data-testid="expense-list-item-test-1"]').should("not.exist");

    cy.get('[data-testid="expense-list-item-test-0"]').should("not.exist");

    cy.get('[data-testid="total-expense-test"]').should("contain", "0");

    cy.get('[data-testid="logout-btn"]').should("not.exist");
  });
});
