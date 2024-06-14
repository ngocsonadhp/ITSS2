import React, { useEffect, useState } from "react";
import styles from "./BudgetTotal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import { firestore } from "../../../firebase";
import { updateIncomeAction } from "../../../store/actions/incomeActions";
import { setTotalTaxLiabilityAction } from "../../../store/actions/taxActions";
import { formatNumber } from "../../../utils/formatNumber";
import { doc, getDoc } from "firebase/firestore";

const BudgetTotal = () => {
  const [loading, setLoading] = useState(true);
  const { totalWants, totalSavings, totalNeeds } = useSelector(
    (state) => state.budget
  );
  const totalIncome = useSelector((state) => state.incomes.totalIncome);
  const { expense, categoryExpenses } = useSelector((state) => state.expenses);
  const needs = useSelector((state) => state.budget.needs);
  const currentUser = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser?.currentUser) {
      const fetchData = async () => {
        const userId = currentUser.currentUser.uid;
        const userDocRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        setLoading(false);
        dispatch(updateIncomeAction(userData?.incomes || []));
      };

      fetchData();
    }
  }, [currentUser, dispatch]);

  const getNeedValueByCategory = (category) => {
    const need = needs.find((need) => need.category === category);
    return need ? need.value : 0;
  };

  const checkOverBudget = (category) => {
    const budget = getNeedValueByCategory(category);
    const expense = categoryExpenses[category] || 0;
    return expense > budget;
  };

  return (
    <div className={styles.main}>
      <div>
        <h2 className={styles.title}>Your totals:</h2>
        <ul className={styles.list}>
          <li className={styles.point}>
            Needs:{" "}
            <span className={styles.number} data-testid="total-needs">
              {formatNumber(totalNeeds)} $
            </span>
          </li>
          <li className={styles.point}>
            Wants:{" "}
            <span className={styles.number} data-testid="total-wants">
              {formatNumber(totalWants)} $
            </span>
          </li>
          <li className={styles.point}>
            Savings and debt repayment:{" "}
            <span className={styles.number} data-testid="total-savings">
              {formatNumber(totalSavings)} $
            </span>
          </li>
        </ul>
      </div>
      <div>
        <h2 className={styles.title}>Thông báo </h2>
        <ul className={styles.list}>
          {checkOverBudget("Entertainment") && (
            <li className={styles.warning}>
              Chi tiêu cho giải trí vượt quá dự tính!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BudgetTotal;
