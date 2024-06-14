import React, { useEffect, useState } from "react";
import styles from "./BudgetPlanner.module.css";
import BudgetForm from "../BudgetForm/BudgetForm";
import BudgetList from "../BudgetList/BudgetList";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase";
import { formatDate } from "../../../utils/dateFormat";
import { updateBudgetAction } from "../../../store/actions/budgetActions";

const BudgetPlanner = ({ fetchData }) => {
  const date = new Date();
  const newDate = date.setMonth(date.getMonth() - 1);
  const [dates, setDates] = useState({
    from: new Date(newDate),
    to: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [budgetToUpdate, setBudgetToUpdate] = useState(null); // New state for budget to update
  const dispatch = useDispatch();
  const currentUser = useAuth();

  const handleUpdateBudget = (budget) => {
    setBudgetToUpdate(budget);
  };

  useEffect(() => {
    if (currentUser?.currentUser) {
      const fetchData = async () => {
        setLoading(true);
        const userId = currentUser.currentUser.uid;
        const userDocRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc?.data();
        setLoading(false);

        const sortedBudgets = Array.isArray(userData?.budgets)
          ? userData.budgets.sort((a, b) => new Date(b.date) - new Date(a.date))
          : [];

        const filteredBudgets = sortedBudgets.filter(
          (item) =>
            formatDate(dates.from) <= item.date &&
            item.date <= formatDate(dates.to)
        );

        dispatch(updateBudgetAction(filteredBudgets));
      };

      fetchData();
    }
  }, [currentUser, dispatch, dates]);

  return (
    <div className={styles.main}>
      <BudgetForm
        budgetToUpdate={budgetToUpdate}
        setBudgetToUpdate={setBudgetToUpdate}
      />
      <BudgetList
        setDates={setDates}
        loading={loading}
        onUpdateBudget={handleUpdateBudget}
        setBudgetToUpdate={setBudgetToUpdate}
      />
    </div>
  );
};

export default BudgetPlanner;
