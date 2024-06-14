export const ADD_EXPENSE = "ADD_EXPENSE";
export const REMOVE_EXPENSE = "REMOVE_EXPENSE";
export const UPDATE_EXPENSE = "UPDATE_EXPENSE";
export const UPDATE_CATEGORY_EXPENSE = "UPDATE_CATEGORY_EXPENSE";

export const addExpenseAction = (payload) => ({
  type: ADD_EXPENSE,
  payload,
});

export const updateExpenseAction = (payload) => ({
  type: UPDATE_EXPENSE,
  payload,
});

export const removeExpenseAction = (payload) => ({
  type: REMOVE_EXPENSE,
  payload,
});

export const updateCategoryExpenseAction = (category, amount) => ({
  type: UPDATE_CATEGORY_EXPENSE,
  payload: { category, amount },
});
