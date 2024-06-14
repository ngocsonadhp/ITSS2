import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../firebase";
import { setDoc, doc } from "firebase/firestore"; // Import doc from Firestore
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const defaultUser = { uid: "defaultUserId", displayName: "ITSS2" };
    setCurrentUser(defaultUser);
    setLoading(false);
  }, []);

  function signup(name, email, password) {
    console.log("Signup function called with:", name, email, password);
    // Giả lập tạo tài khoản và thiết lập người dùng mới
    const defaultUser = { uid: "defaultUserId", displayName: name };
    setCurrentUser(defaultUser);
    const userDocRef = doc(firestore, "users", defaultUser.uid);
    return setDoc(userDocRef, {
      incomes: {},
      expenses: {},
      money: {
        totalCard: 1000,
        totalCash: 0,
        totalSavings: 0,
        totalMoney: 0,
      },
      totalTax: 0,
      totalExpense: 0,
    });
  }

  function login(email, password) {
    console.log("Login function called with:", email, password);
    // Giả lập đăng nhập
    const defaultUser = { uid: "defaultUserId", displayName: "Default User" };
    setCurrentUser(defaultUser);
  }

  function logout() {
    console.log("Logout function called");
    // Giả lập đăng xuất
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
