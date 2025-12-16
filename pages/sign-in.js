import { useReducer, useContext } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import { useTitle } from "./Hooks/useTitle";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toPersian } from "./Hooks/authMessages";
import { UserContext } from "../Context/UserProvider";
import Link from "next/link";

import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/SignIn.module.css";

const initialState = {
  username: "",
  password: "",
  showPassword: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_SHOW_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function SignInPage() {
  useTitle("Sign In");
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { username, password } = state;

    if (!username || !password) {
      toast.error("لطفاً همه فیلدها را پر کنید.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(toPersian(data.message));
        return;
      }

      localStorage.setItem("token", data.token);

      setUser({
        name: username,
        username,
        phone: "",
        avatar: null,
        role: "مدیر",
      });

      toast.success("خوش آمدی " + username + "!");
      dispatch({ type: "RESET" });

      setTimeout(() => router.push("/products"), 1500);
    } catch (error) {
      toast.error("خطایی رخ داد");
      console.error(error);
    }
  };

  return (
    <div className={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.header}>
        <h1>بوت‌کمپ بوتواستارت</h1>
      </div>

      <div className={styles.card}>
        <img className={styles.logo} src="/logo.png" alt="لوگو" />
        <h2 className={styles.title}>فرم ورود</h2>

        <div className={styles.inputs}>
          <input
            name="username"
            type="text"
            placeholder="نام کاربری"
            value={state.username}
            onChange={handleChange}
          />

          <div className={styles.passwordWrapper}>
            <input
              name="password"
              type={state.showPassword ? "text" : "password"}
              placeholder="رمز عبور"
              value={state.password}
              onChange={handleChange}
            />

            <span
              className={styles.eyeBtn}
              onClick={() => dispatch({ type: "TOGGLE_SHOW_PASSWORD" })}
            >
              {state.showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button className={styles.button} onClick={handleSubmit}>
          ورود
        </button>

        <p className={styles.linkWrapper}>
          <Link href="/register" className={styles.link}>
            ایجاد حساب کاربری!
          </Link>
        </p>
      </div>
    </div>
  );
}
