import React, { useEffect } from "react";
import styles from "./ExpenseList.module.css";
import MoonLoader from "react-spinners/MoonLoader";
import {
  removeExpenseAction,
  updateCategoryExpenseAction,
} from "../../../store/actions/expenseActions";
import { firestore } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import CustomButton from "../../form/Button/CustomButton";
import { formatNumber } from "../../../utils/formatNumber";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { setExpenseWarningAction } from "../../../store/actions/expenseWarningActions"; // Import the new action

const ExpenseList = ({ loading, onUpdateExpense }) => {
  const expensesSelector = (state) => state.expenses;
  const { expenses } = useSelector(expensesSelector);
  const budgets = useSelector((state) => state.budgets.budgets); // Get budgets from Redux store
  const dispatch = useDispatch();
  const currentUser = useAuth();

  useEffect(() => {
    const categoryExpenses = expenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + parseFloat(expense.amount);
      return acc;
    }, {});

    const warnings = budgets
      .map((budget) => {
        const totalExpenseForCategory = categoryExpenses[budget.type] || 0;
        const budgetAmount = parseFloat(budget.amount);
        if (totalExpenseForCategory > budgetAmount * 0.7) {
          if (totalExpenseForCategory > budgetAmount) {
            return `Số tiền dành cho mục ${budget.type} vượt quá số tiền dự tính`;
          } else {
            return `Số tiền dành cho mục ${budget.type} vượt quá 70% số tiền dự tính`;
          }
        }
        return null;
      })
      .filter(Boolean);

    dispatch(setExpenseWarningAction(warnings));
  }, [expenses, budgets, dispatch]);

  const deletePoint = async (expense) => {
    try {
      const userId = currentUser.currentUser.uid;
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const expenses = userData.expenses || [];

      const updatedExpenses = expenses.filter((item) => item.id !== expense.id);

      const newTotalExpense =
        userData.totalExpense - parseFloat(expense.amount);

      const moneyUpdate = { ...userData.money };

      if (expense.pay === "Thẻ ngân hàng") {
        moneyUpdate.totalCard += parseFloat(expense.amount);
      } else if (expense.pay === "Tiền mặt") {
        moneyUpdate.totalCash += parseFloat(expense.amount);
      }

      const updateData = {
        expenses: updatedExpenses,
        totalExpense: newTotalExpense,
        money: moneyUpdate,
      };

      await updateDoc(userDocRef, updateData);

      dispatch(
        updateCategoryExpenseAction(expense.type, -parseFloat(expense.amount))
      );
      dispatch(removeExpenseAction(expense.id));
    } catch (error) {
      console.error("Error deleting expense item:", error);
    }
  };

  useEffect(() => {
    expenses.forEach((expense) => {
      dispatch(
        updateCategoryExpenseAction(expense.type, parseFloat(expense.amount))
      );
    });
  }, [expenses, dispatch]);

  return (
    <ul className={styles.list}>
      {loading ? (
        <div className={styles.loading} data-testid="loading-spinner">
          <MoonLoader color="#2e8b43" />
        </div>
      ) : (
        <>
          {expenses?.length > 0 ? (
            <div className={styles.listWrapper}>
              {expenses.map((expense, index) => (
                <div
                  data-testid={`expense-list-item-test-${index}`}
                  key={expense.id}
                  className={styles.item}
                >
                  <span className={styles.expense}>
                    -{formatNumber(expense.amount)} Đồng
                  </span>
                  <span className={styles.description}>
                    {expense.description}
                  </span>
                  <span>{expense.type}</span>
                  <span>{expense.pay}</span>
                  <span>{expense.date}</span>
                  <CustomButton
                    type="button"
                    title="Cập nhật"
                    onClick={() => onUpdateExpense(expense)}
                    disabled={loading}
                    test={`update-btn-expense-item-test-${index}`}
                  />
                  <CustomButton
                    type="submit"
                    title="Xóa"
                    onClick={() => deletePoint(expense)}
                    disabled={loading}
                    test={`delete-btn-expense-item-test-${index}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>Chưa có khoản chi...</div>
          )}
        </>
      )}
    </ul>
  );
};

export default ExpenseList;
