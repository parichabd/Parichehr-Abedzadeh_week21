// context/UserProvider.js
import { createContext, useReducer, useEffect } from "react";

export const UserContext = createContext();

const initialState = {
  user: {
    name: "",
    username: "",
    phone: "",
    avatar: null,
    role: "مدیر",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: { ...state.user, ...action.payload } };
    case "CLEAR_USER":
      return { ...state, user: initialState.user };
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          dispatch({ type: "SET_USER", payload: parsed });
        } catch (err) {
          console.error("خطا در خواندن کاربر از localStorage");
        }
      }
    }
  }, []);

  const setUser = (userData) => {
    const updated = { ...state.user, ...userData };
    localStorage.setItem("user", JSON.stringify(updated));
    dispatch({ type: "SET_USER", payload: updated });
  };

  const clearUser = () => {
    localStorage.removeItem("user");
    dispatch({ type: "CLEAR_USER" });
  };

  return (
    <UserContext.Provider value={{ user: state.user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}
