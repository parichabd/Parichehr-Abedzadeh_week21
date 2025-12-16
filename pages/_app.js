import { UserProvider } from "@/Context/UserProvider";
import "@/styles/globals.css";

// pages/_app.js

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
