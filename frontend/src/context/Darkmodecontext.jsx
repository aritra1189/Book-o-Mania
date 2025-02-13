import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // ✅ Get initial mode from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // ✅ Apply dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark"); // ✅ Apply class to <html>
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode); // ✅ Store preference
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom Hook
export const useDarkMode = () => useContext(DarkModeContext);


