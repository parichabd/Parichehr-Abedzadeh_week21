import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import { useTitle } from "../Hooks/useTitle";
import { UserContext } from "../../Context/UserProvider";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles/CompleteProfile.module.css";

function CompleteProfile() {
  useTitle("Products : User info");
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    avatarFile: null,
    avatarDataUrl: user.avatar || null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      const file = files?.[0];
      if (file) {
        setForm((prev) => ({ ...prev, avatarFile: file }));
        const reader = new FileReader();
        reader.onload = () => {
          setForm((prev) => ({ ...prev, avatarDataUrl: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("لطفاً نام را وارد کنید.");
      return;
    }

    const updatedUser = {
      ...user,
      name: form.name,
      phone: form.phone,
      avatar: form.avatarDataUrl,
    };

    setUser(updatedUser);

    toast.success("پروفایل با موفقیت ذخیره شد!");
    setTimeout(() => router.push("/products"), 900); // تغییر navigate به router.push
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.avatarPreviewBox}>
          {form.avatarDataUrl ? (
            <img
              src={form.avatarDataUrl}
              alt="preview"
              className={styles.avatarPreview}
            />
          ) : (
            <div className={styles.noAvatar}>انتخاب عکس</div>
          )}
        </div>

        <input
          type="text"
          name="name"
          placeholder="نام و نام خانوادگی"
          value={form.name}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          type="tel"
          name="phone"
          placeholder="شماره تلفن"
          value={form.phone}
          onChange={handleChange}
          className={styles.input}
          dir="rtl"
        />

        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
          className={styles.inputFile}
        />

        <button type="submit" className={styles.button}>
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
}

export default CompleteProfile;
