describe('Tax Calculator Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/#/tax-calculator');
  });

  it('should load main page', () => {
    cy.visit('http://localhost:3000/#/');
    cy.get('h1').should('contain', 'Test User');
  });

  it('should load tax calculator page', () => {
    cy.get('p').should('contain', 'Your income before taxes');
  });

  it('should give an error if input empty', () => {
    cy.get('[data-testid="btn-tax-calc-test"]').click();
    cy.get('p').should('contain', 'Please choose an option');
  });

  it('should fill out the form with no deductions and calculate taxes', () => {
    cy.get('[data-testid="test-income"]').should('exist').click();

    cy.get('input[data-testid="input-number-test"]').click().type('10000');
    cy.get('[data-testid="dropdown-type-test"]').click();
    cy.get('[data-testid="dropdown-type-test-0"]').click();
    cy.get('[data-testid="dropdown-tax-test"]').click();
    cy.get('[data-testid="dropdown-tax-test-0"]').click();

    cy.get('[data-testid="btn-add-test"]').should('exist').click();

    cy.wait(1000);

    cy.get('[data-testid="test-taxes"]').should('exist').click();

    cy.get('[data-testid="total-tax-test"]').should('contain', '10,000 $');
    cy.get('[data-testid="state-tax-test"]').should('contain', '0%');
    cy.get('[data-testid="federal-tax-test"]').should('contain', '0%');

    cy.get('[data-testid="dropdown-status-test"]').click();
    cy.get('[data-testid="dropdown-status-test-1"]').click();

    cy.get('[data-testid="radio-no-test"]').click();

    cy.get('[data-testid="btn-tax-calc-test"]').should('exist').click();

    cy.get('[data-testid="state-tax-test"]').should('contain', '5%');
    cy.get('[data-testid="federal-tax-test"]').should('contain', '12%');
    cy.get('[data-testid="total-pay-test"]').should('contain', '2,076 $');

    cy.wait(1000);

    cy.get('[data-testid="test-income"]').should('exist').click();
    cy.get('[data-testid="delete-all-income-btn-test"]').should('exist');
    cy.get('[data-testid="delete-all-income-btn-test"]').click();

    cy.wait(1000);

    cy.get('[data-testid="income-list-item-test-0"]').should('not.exist');
  });

  it('should fill out the form with deductions and calculate taxes', () => {
    cy.get('[data-testid="test-income"]').should('exist').click();

    cy.get('input[data-testid="input-number-test"]').click().type('10000');
    cy.get('[data-testid="dropdown-type-test"]').click();
    cy.get('[data-testid="dropdown-type-test-0"]').click();
    cy.get('[data-testid="dropdown-tax-test"]').click();
    cy.get('[data-testid="dropdown-tax-test-0"]').click();

    cy.get('[data-testid="btn-add-test"]').should('exist').click();

    cy.wait(1000);

    cy.get('[data-testid="test-taxes"]').should('exist').click();

    cy.get('[data-testid="total-tax-test"]').should('contain', '10,000 $');
    cy.get('[data-testid="state-tax-test"]').should('contain', '0%');
    cy.get('[data-testid="federal-tax-test"]').should('contain', '0%');

    cy.get('[data-testid="dropdown-status-test"]').click();
    cy.get('[data-testid="dropdown-status-test-1"]').click();

    cy.get('[data-testid="radio-yes-test"]').click();

    cy.get('[data-testid="btn-tax-calc-test"]').should('exist').click();

    cy.get('[data-testid="state-tax-test"]').should('contain', '0%');
    cy.get('[data-testid="federal-tax-test"]').should('contain', '0%');
    cy.get('[data-testid="total-pay-test"]').should('contain', '765 $');

    cy.wait(1000);

    cy.get('[data-testid="test-income"]').should('exist').click();
    cy.get('[data-testid="delete-all-income-btn-test"]').should('exist');
    cy.get('[data-testid="delete-all-income-btn-test"]').click();

    cy.wait(1000);

    cy.get('[data-testid="income-list-item-test-0"]').should('not.exist');
  });
});
