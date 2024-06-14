import React, { useCallback, useEffect, useState } from "react";
import styles from "./ExpenseForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import { firestore } from "../../../firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  addExpenseAction,
  updateExpenseAction,
} from "../../../store/actions/expenseActions";
import CustomInput from "../../form/Input/CustomInput";
import Dropdown from "../../form/Dropdown/Dropdown";
import CustomButton from "../../form/Button/CustomButton";
import { formatDate } from "../../../utils/dateFormat";
import DateChange from "../../form/DateChange/DateChange";

const ExpenseForm = ({ expenseToUpdate, setExpenseToUpdate }) => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const totalExpense = useSelector((state) => state.expenses.totalExpense);
  const [expenseItem, setExpenseItem] = useState({
    type: "",
    amount: "",
    description: "",
    pay: "",
    date: new Date(),
  });
  const [dropdownError, setDropdownError] = useState(false);
  const [dropdownPlaceholder, setDropdownPlaceholder] = useState("Loại");
  const [dropdownPayError, setDropdownPayError] = useState(false);
  const [dropdownPayPlaceholder, setDropdownPayPlaceholder] =
    useState("Thanh toán bằng");
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

  const optionsPay = [
    { value: "Tiền mặt", label: "Tiền mặt" },
    { value: "Thẻ ngân hàng", label: "Thẻ ngân hàng" },
  ];

  const handleAddExpense = useCallback(
    async (e) => {
      e.preventDefault();

      if (!expenseItem.amount) {
        setInputError("Nhập vào số tiền");
        return;
      }

      if (expenseItem.amount.length > 9) {
        setInputError("Nhập số tiền nhỏ hơn");
        return;
      }

      if (expenseItem.amount < 0) {
        setInputError("Enter a positive value");
        return;
      }

      if (!expenseItem.type) {
        setDropdownError(true);
        return;
      }

      if (!expenseItem.pay) {
        setDropdownPayError(true);
        return;
      }

      setLoading(true);

      const newExpense = {
        amount: expenseItem.amount,
        type: expenseItem.type,
        pay: expenseItem.pay,
        description: expenseItem.description,
        date: formatDate(expenseItem.date),
        id: expenseToUpdate ? expenseToUpdate.id : Date.now(),
      };

      try {
        const userDocRef = doc(firestore, "users", currentUser?.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        const money = userData.money;

        if (expenseToUpdate) {
          // Update existing expense
          const updatedExpenses = userData.expenses.map((exp) =>
            exp.id === expenseToUpdate.id ? newExpense : exp
          );

          await updateDoc(userDocRef, {
            expenses: updatedExpenses,
            totalExpense:
              totalExpense -
              parseFloat(expenseToUpdate.amount) +
              parseFloat(newExpense.amount),
            money: {
              ...money,
              totalCash:
                money.totalCash -
                (expenseToUpdate.pay === "Tiền mặt"
                  ? parseFloat(expenseToUpdate.amount)
                  : 0),
              totalCard:
                money.totalCard -
                (expenseToUpdate.pay === "Thẻ ngân hàng"
                  ? parseFloat(expenseToUpdate.amount)
                  : 0),
            },
          });

          dispatch(updateExpenseAction(updatedExpenses));
        } else {
          // Add new expense
          const updatedExpenses = arrayUnion(newExpense);

          await updateDoc(userDocRef, {
            expenses: updatedExpenses,
            totalExpense: totalExpense + parseFloat(newExpense.amount),
            money: {
              ...money,
              totalCash:
                money.totalCash -
                (newExpense.pay === "Tiền mặt"
                  ? parseFloat(newExpense.amount)
                  : 0),
              totalCard:
                money.totalCard -
                (newExpense.pay === "Thẻ ngân hàng"
                  ? parseFloat(newExpense.amount)
                  : 0),
            },
          });

          dispatch(addExpenseAction(newExpense));
        }

        setExpenseItem({
          amount: "",
          type: "",
          description: "",
          pay: "",
          date: new Date(),
        });
        setExpenseToUpdate(null);
        setLoading(false);
        setInputError("");
        setDropdownPlaceholder("Loại");
        setDropdownPayPlaceholder("Thanh toán bằng");
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
      expenseItem.amount,
      expenseItem.type,
      expenseItem.description,
      expenseItem.pay,
      expenseItem.date,
      dispatch,
      totalExpense,
      expenseToUpdate,
    ]
  );

  useEffect(() => {
    if (expenseToUpdate) {
      setExpenseItem({
        amount: expenseToUpdate.amount,
        type: expenseToUpdate.type,
        description: expenseToUpdate.description,
        pay: expenseToUpdate.pay,
        date: new Date(expenseToUpdate.date),
      });
    }
  }, [expenseToUpdate]);

  const handleDropdownChange = (option) => {
    if (option.value === "Khác") {
      setIsOtherCategory(true);
      setExpenseItem({ ...expenseItem, type: "" });
    } else {
      setIsOtherCategory(false);
      setExpenseItem({ ...expenseItem, type: option.value });
    }
    setDropdownError(false);
  };

  const handleDropdownPayChange = (option) => {
    setExpenseItem({ ...expenseItem, pay: option.value });
    setDropdownPayError(false);
  };

  const handleAmountChange = (value) => {
    setExpenseItem({ ...expenseItem, amount: value });
    setInputError("");
  };

  const handleDescChange = (value) => {
    setExpenseItem({ ...expenseItem, description: value });
  };

  const handleDateChange = (value) => {
    setExpenseItem({ ...expenseItem, date: value });
    setInputError("");
  };

  const buttonTitle = loading
    ? "Loading..."
    : expenseToUpdate
    ? "Cập nhật khoản chi"
    : "Thêm khoản chi";

  return (
    <form onSubmit={handleAddExpense} className={styles.form}>
      <h2 className={styles.title}>Nhập vào chi phí của bạn:</h2>
      <div className={styles.inputs}>
        <CustomInput
          label="Số tiền"
          type="number"
          id="expense"
          step="0.01"
          value={expenseItem.amount}
          error={inputError}
          required
          onChange={handleAmountChange}
          test="input-number-test"
        />
        <CustomInput
          label="Chi tiết"
          type="text"
          id="expense-desc"
          value={expenseItem.description}
          required
          onChange={handleDescChange}
          test="input-desc-test"
        />
        <Dropdown
          placeHolder={dropdownPlaceholder}
          setPlaceHolder={setDropdownPlaceholder}
          options={options}
          onChange={handleDropdownChange}
          error={dropdownError}
          test="dropdown-category-test"
          defaultValue={
            expenseToUpdate
              ? {
                  value: expenseToUpdate.type,
                  label: expenseToUpdate.type,
                }
              : null
          }
        />
        {isOtherCategory && (
          <CustomInput
            label="Loại chi phí khác"
            type="text"
            id="other-category"
            value={expenseItem.type}
            onChange={(e) => setExpenseItem({ ...expenseItem, type: e })}
            required
          />
        )}
        <Dropdown
          placeHolder={dropdownPayPlaceholder}
          setPlaceHolder={setDropdownPayPlaceholder}
          options={optionsPay}
          onChange={handleDropdownPayChange}
          error={dropdownPayError}
          test="dropdown-pay-test"
          defaultValue={
            expenseToUpdate
              ? {
                  value: expenseToUpdate.pay,
                  label: expenseToUpdate.pay,
                }
              : null
          }
        />
        <DateChange value={expenseItem.date} onChange={handleDateChange} />
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

export default ExpenseForm;
