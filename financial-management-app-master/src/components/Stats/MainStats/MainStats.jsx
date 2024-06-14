import React, { useEffect, useState } from "react";
import styles from "./MainStats.module.css";
import { useDispatch, useSelector } from "react-redux";
import { firestore } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import {
  updateCardAction,
  updateCashAction,
  updateIncomeAction,
  updateSavingsAction,
} from "../../../store/actions/incomeActions";
import { doc, getDoc } from "firebase/firestore";
import { formatNumber } from "../../../utils/formatNumber";
import { setTotalTaxLiabilityAction } from "../../../store/actions/taxActions";
import MoneyStats from "../MoneyStats/MoneyStats";
import ExpenseStats from "../ExpenseStats/ExpenseStats";
import { Link } from "react-router-dom";
import { updateExpenseAction } from "../../../store/actions/expenseActions";

const MainStats = () => {
  const [loading, setLoading] = useState(false);
  const totalTax = useSelector((state) => state.taxes.totalTaxLiability);
  const { totalIncome, totalCard, totalCash, totalSavings } = useSelector(
    (state) => state.incomes
  );
  const expenseWarnings = useSelector(
    (state) => state.expenseWarnings.warnings
  ); // Get warnings from Redux store

  const dispatch = useDispatch();

  const currentUser = useAuth();

  useEffect(() => {
    if (currentUser?.currentUser) {
      const fetchData = async () => {
        setLoading(true);
        const userId = currentUser.currentUser.uid;
        const userDocRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        setLoading(false);
        dispatch(updateIncomeAction(userData?.incomes || []));

        dispatch(setTotalTaxLiabilityAction(userData?.totalTax || 0));
        dispatch(updateExpenseAction(userData?.expenses || []));

        dispatch(updateCashAction(userData?.money.totalCash));
        dispatch(updateCardAction(userData?.money.totalCard));
        dispatch(updateSavingsAction(userData?.money.totalSavings));
      };

      fetchData();
    }
  }, [currentUser, dispatch, totalCard, totalCash, totalSavings]);

  return (
    <section className={styles.section}>
      <div className={styles.money}>
        <h2 className={styles.title}>Tổng hợp số dư</h2>
        <MoneyStats />
      </div>
      <div className={styles.expense}>
        <ExpenseStats />
      </div>
      <div className={styles.notify}>
        Cảnh báo chi tiêu:
        {expenseWarnings.length > 0 && (
          <ul>
            {expenseWarnings.map((warning, index) => (
              <li key={index} className={styles.warning}>
                {warning}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default MainStats;
