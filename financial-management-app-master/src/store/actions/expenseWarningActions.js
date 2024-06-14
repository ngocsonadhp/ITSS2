// src/store/actions/expenseWarningActions.js
export const SET_EXPENSE_WARNING = "SET_EXPENSE_WARNING";

export const setExpenseWarningAction = (warnings) => ({
  type: SET_EXPENSE_WARNING,
  payload: warnings,
});
