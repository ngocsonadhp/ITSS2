import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { incomeReducer } from "./reducers/IncomeReducer";
import { taxReducer } from "./reducers/taxReducer";
import { expenseReducer } from "./reducers/expenseReducer";
import { tabsReducer } from "./reducers/tabsReducer";
import { budgetReducer } from "./reducers/budgetReducer";
import { expenseWarningReducer } from "./reducers/expenseWarningReducer";

const rootReducer = combineReducers({
  incomes: incomeReducer,
  taxes: taxReducer,
  expenses: expenseReducer,
  tabs: tabsReducer,
  budgets: budgetReducer,
  expenseWarnings: expenseWarningReducer, // Add the new reducer
});

export default configureStore({
  reducer: rootReducer,
  devTools: true,
});
