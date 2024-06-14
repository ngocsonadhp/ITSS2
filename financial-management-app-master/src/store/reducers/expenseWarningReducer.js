// src/store/reducers/expenseWarningReducer.js
import { SET_EXPENSE_WARNING } from "../actions/expenseWarningActions";

const initialState = {
  warnings: [],
};

export const expenseWarningReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EXPENSE_WARNING:
      return {
        ...state,
        warnings: action.payload,
      };
    default:
      return state;
  }
};
