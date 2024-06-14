import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";
import { Routes, Route, HashRouter } from "react-router-dom";
import MainPage from "./pages/MainPage";
import "./index.css";
import IncomeCounter from "./components/Income/IncomeCounter/IncomeCounter";
import BudgetPlanner from "./components/Budget/BudgetPlanner/BudgetPlanner";
import ExpenseTracker from "./components/Expense/ExpenseTracker/ExpenseTracker";
import MainStats from "./components/Stats/MainStats/MainStats";

function App() {
  const [users, setUsers] = useState([]);

  const usersCollectionRef = collection(firestore, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route
          index
          path="/"
          element={
            <MainPage>
              <MainStats />
            </MainPage>
          }
        />
        <Route
          index
          path="/income-tracker"
          element={
            <MainPage>
              <IncomeCounter />
            </MainPage>
          }
        />
        <Route
          path="/expense-tracker"
          element={
            <MainPage>
              <ExpenseTracker />
            </MainPage>
          }
        />
        <Route
          path="/budget-planner"
          element={
            <MainPage>
              <BudgetPlanner />
            </MainPage>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
