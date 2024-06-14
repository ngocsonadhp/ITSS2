import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../../utils/dateFormat";
import {
  addIncomeAction,
  updateCardAction,
  updateCashAction,
} from "../../../store/actions/incomeActions";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore"; // added setDoc for creating new documents
import { firestore } from "../../../firebase";
import styles from "./IncomeForm.module.css";
import CustomInput from "../../form/Input/CustomInput";
import Dropdown from "../../form/Dropdown/Dropdown";
import CustomButton from "../../form/Button/CustomButton";
import { useAuth } from "../../../contexts/AuthContext";
import DateChange from "../../form/DateChange/DateChange";

function IncomeForm() {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { totalAmount, incomes } = useSelector((state) => state.incomes);
  const dispatch = useDispatch();
  const [incomeItem, setIncomeItem] = useState({
    amount: "",
    type: "",
    description: "",
    date: new Date(),
  });
  const [dropdownDescriptionError, setDropdownDescriptionError] =
    useState(false);

  const [dropdownError, setDropdownError] = useState(false);
  const [dropdownPlaceholder, setDropdownPlaceholder] =
    useState("Loại tiền thu nhập");
  const [inputError, setInputError] = useState("");

  const optionsPay = [
    { value: "Tiền mặt", label: "Tiền mặt" },
    { value: "Thẻ", label: "Thẻ" },
  ];

  const handleAddIncome = useCallback(
    async (e) => {
      e.preventDefault();

      if (!incomeItem.amount) {
        setInputError("Nhập vào số tiền");
        return;
      }

      if (incomeItem.amount.length > 11) {
        setInputError("Nhập số tiền nhỏ hơn");
        return;
      }

      if (incomeItem.amount < 0) {
        setInputError("Enter a positive value");
        return;
      }

      if (!incomeItem.type) {
        setDropdownError(true);
        return;
      }

      if (!incomeItem.description) {
        setDropdownDescriptionError(true);
        return;
      }

      setLoading(true);

      const income = {
        amount: incomeItem.amount,
        type: incomeItem.type,
        description: incomeItem.description,
        date: formatDate(incomeItem.date),
        id: Date.now(),
      };

      try {
        dispatch(addIncomeAction(income));

        const totalCash = incomes
          .filter((item) => item.type === "Tiền mặt")
          .reduce((total, item) => total + parseFloat(item.amount), 0);

        const totalCard = incomes
          .filter((item) => item.type === "Thẻ")
          .reduce((total, item) => total + parseFloat(item.amount), 0);

        const userDocRef = doc(firestore, "users", currentUser?.uid);

        // Kiểm tra xem tài liệu người dùng đã tồn tại chưa
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Nếu không tồn tại, tạo mới tài liệu
          await setDoc(userDocRef, {
            incomes: [income],
            money: {
              totalCash:
                incomeItem.type === "Tiền mặt"
                  ? parseFloat(incomeItem.amount)
                  : 0,
              totalCard:
                incomeItem.type === "Thẻ" ? parseFloat(incomeItem.amount) : 0,
              totalMoney: parseFloat(incomeItem.amount),
            },
          });
        } else {
          // Nếu tồn tại, cập nhật tài liệu
          const money = userDoc.data().money;

          await updateDoc(userDocRef, {
            incomes: arrayUnion(income),
            money: {
              ...money,
              totalCash:
                totalCash +
                (incomeItem.type === "Tiền mặt"
                  ? parseFloat(incomeItem.amount)
                  : 0),
              totalCard:
                totalCard +
                (incomeItem.type === "Thẻ" ? parseFloat(incomeItem.amount) : 0),
              totalMoney: totalAmount + parseFloat(incomeItem.amount),
            },
          });
        }

        dispatch(updateCashAction(totalCash));
        dispatch(updateCardAction(totalCard));

        setIncomeItem({
          amount: "",
          description: "",
          type: "",
          date: new Date(),
        });
        setInputError("");
        setDropdownPlaceholder("Loại tiền thu nhập");
      } catch (error) {
        console.error("Error updating document: ", error);
        setInputError("Failed to add income. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [
      currentUser?.uid,
      incomeItem.amount,
      incomeItem.type,
      incomeItem.description,
      incomeItem.date,
      incomes,
      dispatch,
      totalAmount,
    ]
  );

  const handleDropdownChange = (option) => {
    setIncomeItem({ ...incomeItem, type: option.value });
    setDropdownError(false);
  };

  const handleDescriptionDropdownChange = (option) => {
    setIncomeItem({ ...incomeItem, description: option.value });
    setDropdownDescriptionError(false);
  };

  const handleInputAmountChange = (value) => {
    setIncomeItem({ ...incomeItem, amount: value });
    setInputError("");
  };

  const handleInputDescriptionChange = (value) => {
    setIncomeItem({ ...incomeItem, description: value });
    setInputError("");
  };

  const handleDateChange = (value) => {
    setIncomeItem({ ...incomeItem, date: value });
    setInputError("");
  };

  const buttonTitle = loading ? "Loading..." : "Add income";

  return (
    <form onSubmit={handleAddIncome} className={styles.form}>
      <h2 className={styles.title}>Nhập vào thu nhập của bạn</h2>
      <div className={styles.inputs}>
        <CustomInput
          label="Số tiền"
          type="number"
          id="income"
          step="0.01"
          value={incomeItem.amount}
          error={inputError}
          required
          onChange={handleInputAmountChange}
          maxLength={8}
          test="input-number-test"
        />
        <CustomInput
          label="Chi tiết nguồn thu"
          type="text"
          id="income"
          step="0.01"
          value={incomeItem.description}
          error={inputError}
          required
          onChange={handleInputDescriptionChange}
          test="input-text-test"
        />
        <Dropdown
          placeHolder={dropdownPlaceholder}
          setPlaceHolder={setDropdownPlaceholder}
          options={optionsPay}
          onChange={handleDropdownChange}
          error={dropdownError}
          test="dropdown-type-test"
        />
        <DateChange onChange={handleDateChange} value={incomeItem.date} />
        <CustomButton
          test="btn-add-test"
          type="submit"
          title={buttonTitle}
          disabled={loading}
        />
      </div>
    </form>
  );
}

export default IncomeForm;
