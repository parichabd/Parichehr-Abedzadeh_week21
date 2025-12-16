import { useTitle } from "./Hooks/useTitle";
import { useRouter } from "next/router";
import styles from "../styles/PageNotFound.module.css";

export default function PageNotFound() {
  useTitle("Page Not Found!");
  const router = useRouter();

  const pageHandler = () => {
    router.push("/");
  };

  return (
    <div className={styles.PageNotfound}>
      <div className={styles.page404}>
        <h1>!</h1>
        <p>ما همه جارو جستو جو کردیم ولی صفحه ی مورد نظر یافت نشد!</p>
        <p>آیا از صحت لینکی که وارد کرده اید مطمئن هستید!</p>
        <button onClick={pageHandler}>بازگشت</button>
      </div>
    </div>
  );
}
