import { useRouter } from "next/router";
import styles from "../styles/Welcome.module.css"; // مسیر به styles را نسبت به محل فایل اصلاح کن
import { useTitle } from "./Hooks/useTitle";

export default function Home() {
  useTitle("Welcome Page");
  const router = useRouter();

  const LoginHandler = () => {
    router.push("/log-in");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Manage your products with confidence</p>
        <button className={styles.button} onClick={LoginHandler}>
          Let's Go
        </button>
      </div>
    </div>
  );
}
