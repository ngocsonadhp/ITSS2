export const ADD_NEEDS = "ADD_NEEDS";
export const ADD_WANTS = "ADD_WANTS";
export const ADD_SAVINGS = "ADD_SAVINGS";

export const ADD_BUDGET = "ADD_BUDGET";
export const REMOVE_BUDGET = "REMOVE_BUDGET";
export const UPDATE_BUDGET = "UPDATE_BUDGET";
export const UPDATE_CATEGORY_BUDGET = "UPDATE_CATEGORY_BUDGET";

export const addWantsAction = (payload) => ({
  type: ADD_WANTS,
  payload,
});

export const addNeedsAction = (payload) => ({
  type: ADD_NEEDS,
  payload,
});

export const addSavingsAction = (payload) => ({
  type: ADD_SAVINGS,
  payload,
});

export const addBudgetAction = (payload) => ({
  type: ADD_BUDGET,
  payload,
});

export const updateBudgetAction = (payload) => ({
  type: UPDATE_BUDGET,
  payload,
});

export const removeBudgetAction = (payload) => ({
  type: REMOVE_BUDGET,
  payload,
});

export const updateCategoryBudgetAction = (category, amount) => ({
  type: UPDATE_CATEGORY_BUDGET,
  payload: { category, amount },
});
