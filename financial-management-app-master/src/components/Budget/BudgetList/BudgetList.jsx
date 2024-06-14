import React, { useEffect, useState } from "react";
import styles from "./BudgetList.module.css";
import MoonLoader from "react-spinners/MoonLoader";
import {
  removeBudgetAction,
  updateCategoryBudgetAction,
} from "../../../store/actions/budgetActions";
import { firestore } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import CustomButton from "../../form/Button/CustomButton";
import { formatNumber } from "../../../utils/formatNumber";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const BudgetList = ({ loading, onUpdateBudget }) => {
  const budgetsSelector = (state) => state.budgets;
  const { budgets } = useSelector(budgetsSelector);
  const dispatch = useDispatch();

  const currentUser = useAuth();

  const deletePoint = async (budget) => {
    try {
      const userId = currentUser.currentUser.uid;
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const budgets = userData.budgets || [];

      const updatedBudgets = budgets.filter((item) => item.id !== budget.id);

      const newTotalBudget = parseFloat(budget.amount);

      const moneyUpdate = { ...userData.money };

      if (budget.pay === "Thẻ ngân hàng") {
        moneyUpdate.totalCard += parseFloat(budget.amount);
      } else if (budget.pay === "Tiền mặt") {
        moneyUpdate.totalCash += parseFloat(budget.amount);
      }

      const updateData = {
        budgets: updatedBudgets,
        totalBudget: newTotalBudget,
        money: moneyUpdate,
      };

      await updateDoc(userDocRef, updateData);

      dispatch(
        updateCategoryBudgetAction(budget.type, -parseFloat(budget.amount))
      );
      dispatch(removeBudgetAction(budget.id));
    } catch (error) {
      console.error("Error deleting budget item:", error);
    }
  };

  useEffect(() => {
    budgets.forEach((budget) => {
      dispatch(
        updateCategoryBudgetAction(budget.type, parseFloat(budget.amount))
      );
    });
  }, [budgets, dispatch]);

  return (
    <ul className={styles.list}>
      {loading ? (
        <div className={styles.loading} data-testid="loading-spinner">
          <MoonLoader color="#2e8b43" />
        </div>
      ) : (
        <>
          {budgets?.length > 0 ? (
            <div className={styles.listWrapper}>
              {budgets.map((budget, index) => (
                <div
                  data-testid={`budget-list-item-test-${index}`}
                  key={budget.id}
                  className={styles.item}
                >
                  <span className={styles.budget}>
                    {formatNumber(budget.amount)} Đồng
                  </span>
                  <span className={styles.description}>
                    {budget.description}
                  </span>
                  <span>{budget.type}</span>
                  <span>{budget.date}</span>
                  <CustomButton
                    type="button"
                    title="Cập nhật"
                    onClick={() => onUpdateBudget(budget)}
                    disabled={loading}
                    test={`update-btn-budget-item-test-${index}`}
                  />
                  <CustomButton
                    type="submit"
                    title="Xóa"
                    onClick={() => deletePoint(budget)}
                    disabled={loading}
                    test={`delete-btn-budget-item-test-${index}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>Chưa có khoản chi dự tính...</div>
          )}
        </>
      )}
    </ul>
  );
};

export default BudgetList;
