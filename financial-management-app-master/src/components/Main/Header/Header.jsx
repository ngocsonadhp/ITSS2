import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { useAuth } from "../../../contexts/AuthContext";

const Header = ({ setSideMenu, sideMenu }) => {
  const { currentUser } = useAuth();
  const [greetings, setGreetings] = useState("Hello");

  const today = new Date();
  const currentTime = today.getHours();

  const handleClick = () => {
    setSideMenu(!sideMenu);
  };

  useEffect(() => {
    setGreetings("Have a nice day");
  }, [currentTime]);
  

  return (
    <header className={styles.header}>
      <button
        className={`${styles.menuToggle} ${sideMenu ? styles.isActive : null}`}
        onClick={handleClick}
      >
        Menu
      </button>
      <h1>
        {" "}
        {`${greetings}${
          currentUser.displayName !== null
            ? `, ${currentUser.displayName}`
            : ", welcome to this app"
        }!`}
      </h1>
    </header>
  );
};

export default Header;
