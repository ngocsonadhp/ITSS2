import {
  ADD_BUDGET,
  REMOVE_BUDGET,
  UPDATE_BUDGET,
  UPDATE_CATEGORY_BUDGET,
} from "../actions/budgetActions";

const initialState = {
  budgets: [],
  totalBudget: 0,
  categoryBudgets: {},
};

export const budgetReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BUDGET:
      return {
        ...state,
        budgets: [action.payload, ...state.budgets],
        totalBudget: state.totalBudget + parseFloat(action.payload.amount),
      };
    case REMOVE_BUDGET:
      const updatedBudgets = state.budgets.filter(
        (budget) => budget.id !== action.payload
      );
      const updatedTotalExpense = updatedBudgets.reduce(
        (total, budget) => total + parseFloat(budget.amount),
        0
      );
      return {
        ...state,
        budgets: updatedBudgets,
        totalBudget: updatedTotalExpense,
      };
    case UPDATE_BUDGET:
      if (!Array.isArray(action.payload)) {
        return state;
      }

      return {
        ...state,
        budgets: action.payload,
        totalBudget: action.payload.reduce(
          (total, budget) => total + parseFloat(budget.amount),
          0
        ),
      };
    case UPDATE_CATEGORY_BUDGET:
      const { category, amount } = action.payload;
      const updatedCategoryBudgets = {
        ...state.categoryBudgets,
        [category]: (state.categoryBudgets[category] || 0) + amount,
      };
      return {
        ...state,
        categoryBudgets: updatedCategoryBudgets,
      };
    default:
      return state;
  }
};
