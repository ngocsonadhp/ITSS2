import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SideBar.module.css";
import { ReactComponent as MenuIcon } from "../../../assets/menu-icon.svg";
import { ReactComponent as MenuIcon1 } from "../../../assets/menu-icon1.svg";
import { ReactComponent as MenuIcon2 } from "../../../assets/menu-icon2.svg";
import { ReactComponent as MenuIcon3 } from "../../../assets/menu-icon3.svg";
import { ReactComponent as MenuIcon4 } from "../../../assets/menu-icon4.svg";
import SideItem from "./SideItem";
import { useAuth } from "../../../contexts/AuthContext";

const SideBar = ({ setSideMenu, sideMenu }) => {
  const { logout } = useAuth();
  const [error, setError] = useState("");
  const history = useNavigate();


  const onClick = () => {
    if (sideMenu === true) {
      setSideMenu(false);
    } else return;
  };

  return (
    <div className={styles.side}>
      <div className={styles.menu}>
        <h3 className={styles.title}>Main menu</h3>
        <div className={styles.container}>
          {" "}
          <ul className={styles.list}>
            <SideItem
              to="/"
              icon={MenuIcon4}
              label="Trang chính"
              onClick={onClick}
              test="test-main"
            />
            <SideItem
              to="/income-tracker"
              icon={MenuIcon3}
              label="Theo dõi thu nhập"
              onClick={onClick}
              test="test-income"
            />
            <SideItem
              to="/expense-tracker"
              icon={MenuIcon1}
              label="Theo dõi khoản chi"
              onClick={onClick}
              test="test-expense"
            />

            <SideItem
              to="/budget-planner"
              icon={MenuIcon}
              label="Kế hoạch chi tiêu"
              onClick={onClick}
              test="test-planner"
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
