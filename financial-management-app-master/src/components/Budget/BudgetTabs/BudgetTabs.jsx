import React from "react";
import styles from "./BudgetTabs.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setTabAction } from "../../../store/actions/tabsActions";

const BudgetTabs = () => {
  const tab = useSelector((state) => state.tabs.currentTab);
  const dispatch = useDispatch();

  const handleClick = (type) => {
    dispatch(setTabAction(type));
  };

  return (
    <div className={styles.form}>
      <div
        data-testid=""
        onClick={() => handleClick("needs")}
        className={`${styles.button} ${tab === "needs" ? styles.active : ""}`}
      >
        Mục chi tiêu cần thiết
      </div>
    </div>
  );
};

export default BudgetTabs;
