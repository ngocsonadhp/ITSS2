import React, { useCallback, useEffect, useState } from "react";
import styles from "./BudgetForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import { firestore } from "../../../firebase";
import { arrayUnion, doc, getDoc, updateDoc, setDoc } from "firebase/firestore"; // added setDoc for creating new documents
import {
  addBudgetAction,
  updateBudgetAction,
} from "../../../store/actions/budgetActions"; // Add updateExpenseAction
import CustomInput from "../../form/Input/CustomInput";
import Dropdown from "../../form/Dropdown/Dropdown";
import CustomButton from "../../form/Button/CustomButton";
import { formatDate } from "../../../utils/dateFormat";
import DateChange from "../../form/DateChange/DateChange";

const BudgetForm = ({ budgetToUpdate, setBudgetToUpdate }) => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const totalBudget = useSelector((state) => state.budgets.totalBudget);
  const [budgetItem, setBudgetItem] = useState({
    type: "",
    amount: "",
    description: "",
    date: new Date(),
  });
  const [dropdownError, setDropdownError] = useState(false);
  const [dropdownPlaceholder, setDropdownPlaceholder] = useState("Loại");
  const [inputError, setInputError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  const options = [
    { value: "Ăn uống", label: "Ăn uống" },
    { value: "Tiền trọ", label: "Tiền trọ" },
    { value: "Xăng xe", label: "Xăng xe" },
    { value: "Chăm sóc sức khỏe", label: "Chăm sóc sức khỏe" },
    { value: "Giáo dục", label: "Giáo dục" },
    { value: "Giải trí", label: "Giải trí" },
    { value: "Khác", label: "Khác" },
  ];

  const handleAddBudget = useCallback(
    async (e) => {
      e.preventDefault();

      if (!budgetItem.amount) {
        setInputError("Nhập vào số tiền");
        return;
      }

      if (budgetItem.amount.length > 9) {
        setInputError("Nhập số tiền nhỏ hơn");
        return;
      }

      if (budgetItem.amount < 0) {
        setInputError("Enter a positive value");
        return;
      }

      if (!budgetItem.type) {
        setDropdownError(true);
        return;
      }

      setLoading(true);

      const newBudget = {
        amount: budgetItem.amount,
        type: budgetItem.type,
        description: budgetItem.description,
        date: formatDate(budgetItem.date),
        id: budgetToUpdate ? budgetToUpdate.id : Date.now(),
      };

      try {
        const userDocRef = doc(firestore, "users", currentUser?.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        const money = userData.money;

        if (budgetToUpdate) {
          // Update existing expense
          const updatedBudgets = userData.budgets.map((exp) =>
            exp.id === budgetToUpdate.id ? newBudget : exp
          );

          await updateDoc(userDocRef, {
            budgets: updatedBudgets,
            totalBudget:
              totalBudget -
              parseFloat(budgetToUpdate.amount) +
              parseFloat(newBudget.amount),
            money: {
              ...money,
              totalCash:
                money.totalCash -
                (budgetToUpdate.pay === "Tiền mặt"
                  ? parseFloat(budgetToUpdate.amount)
                  : 0) +
                (newBudget.pay === "Tiền mặt"
                  ? parseFloat(newBudget.amount)
                  : 0),
              totalCard:
                money.totalCard -
                (budgetToUpdate.pay === "Thẻ ngân hàng"
                  ? parseFloat(budgetToUpdate.amount)
                  : 0) +
                (newBudget.pay === "Thẻ ngân hàng"
                  ? parseFloat(newBudget.amount)
                  : 0),
            },
          });

          dispatch(updateBudgetAction(updatedBudgets));
        } else {
          // Add new expense
          const updatedBudgets = arrayUnion(newBudget);

          await updateDoc(userDocRef, {
            budgets: updatedBudgets,
            totalBudget: totalBudget + parseFloat(newBudget.amount),
            money: {
              ...money,
              totalCash:
                money.totalCash -
                (newBudget.pay === "Tiền mặt"
                  ? parseFloat(newBudget.amount)
                  : 0),
              totalCard:
                money.totalCard -
                (newBudget.pay === "Thẻ ngân hàng"
                  ? parseFloat(newBudget.amount)
                  : 0),
            },
          });

          dispatch(addBudgetAction(newBudget));
        }

        setBudgetItem({
          amount: "",
          type: "",
          description: "",
          pay: "",
          date: new Date(),
        });
        setBudgetToUpdate(null);
        setLoading(false);
        setInputError("");
        setDropdownPlaceholder("Loại");
        setIsOtherCategory(false);
      } catch (error) {
        console.error("Lỗi cập nhật doc ", error);
        setInputError("Không thể thêm khoản chi. Vui lòng thử lại");
      } finally {
        setLoading(false);
      }
    },
    [
      currentUser?.uid,
      budgetItem.amount,
      budgetItem.type,
      budgetItem.description,
      budgetItem.date,
      dispatch,
      totalBudget,
      budgetToUpdate,
    ]
  );

  useEffect(() => {
    if (budgetToUpdate) {
      setBudgetItem({
        amount: budgetToUpdate.amount,
        type: budgetToUpdate.type,
        description: budgetToUpdate.description,
        date: new Date(budgetToUpdate.date),
      });
    }
  }, [budgetToUpdate]);

  const handleDropdownChange = (option) => {
    if (option.value === "Khác") {
      setIsOtherCategory(true);
      setBudgetItem({ ...budgetItem, type: "" });
    } else {
      setIsOtherCategory(false);
      setBudgetItem({ ...budgetItem, type: option.value });
    }
    setDropdownError(false);
  };

  const handleAmountChange = (value) => {
    setBudgetItem({ ...budgetItem, amount: value });
    setInputError("");
  };

  const handleDescChange = (value) => {
    setBudgetItem({ ...budgetItem, description: value });
  };

  const handleTypeChange = (value) => {
    setBudgetItem({ ...budgetItem, type: value });
  };

  const handleDateChange = (value) => {
    setBudgetItem({ ...budgetItem, date: value });
    setInputError("");
  };

  const buttonTitle = loading
    ? "Loading..."
    : budgetToUpdate
    ? "Cập nhật dự toán"
    : "Thêm khoản dự toán";

  return (
    <form onSubmit={handleAddBudget} className={styles.form}>
      <h2 className={styles.title}>Nhập vào kế hoạch chi tiêu của bạn:</h2>
      <div className={styles.inputs}>
        <CustomInput
          label="Số tiền"
          type="number"
          id="budget"
          step="0.01"
          value={budgetItem.amount}
          error={inputError}
          required
          onChange={handleAmountChange}
          test="input-number-test"
        />
        <CustomInput
          label="Chi tiết"
          type="text"
          id="budget-desc"
          value={budgetItem.description}
          required
          onChange={handleDescChange}
          test="input-desc-test"
        />{" "}
        <Dropdown
          placeHolder={dropdownPlaceholder}
          setPlaceHolder={setDropdownPlaceholder}
          options={options}
          onChange={handleDropdownChange}
          error={dropdownError}
          test="dropdown-category-test"
          defaultValue={
            budgetToUpdate
              ? {
                  value: budgetToUpdate.type,
                  label: budgetToUpdate.type,
                }
              : null
          }
        />
        {isOtherCategory && (
          <CustomInput
            label="Loại chi phí khác"
            type="text"
            id="other-category"
            value={budgetItem.type}
            onChange={(e) => setBudgetItem({ ...budgetItem, type: e })}
            required
          />
        )}
        <DateChange value={budgetItem.date} onChange={handleDateChange} />
        <CustomButton
          test="submit-button-test"
          type="submit"
          title={buttonTitle}
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default BudgetForm;
