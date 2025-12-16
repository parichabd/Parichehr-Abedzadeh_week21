import { useState } from "react";
import { useTitle } from "../Hooks/useTitle";
import styles from "../../styles/MangementProducts.module.css";

const manageAvatar = "/setting-3.svg";

function AddProductModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  const [errors, setErrors] = useState({});
  const [visibleErrorField, setVisibleErrorField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "نام کالا الزامی است.";
    if (!formData.price) newErrors.price = "قیمت الزامی است.";
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0)
      newErrors.price = "قیمت باید عددی مثبت باشد.";
    if (!formData.quantity) newErrors.quantity = "موجودی الزامی است.";
    else if (
      !Number.isInteger(Number(formData.quantity)) ||
      parseInt(formData.quantity) < 0
    )
      newErrors.quantity = "موجودی باید عدد صحیح مثبت باشد.";

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      setVisibleErrorField(errorKeys[0]);
      setTimeout(() => setVisibleErrorField(null), 2000);
      return;
    }

    onAdd({
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
    });
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>ایجاد محصول جدید</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>نام کالا</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="نام کالا"
            />
            {visibleErrorField === "name" && errors.name && (
              <p className={styles.errorText}>{errors.name}</p>
            )}
          </div>

          <div>
            <label>تعداد موجودی</label>
            <input
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              type="number"
              placeholder="تعداد"
              step="1"
            />
            {visibleErrorField === "quantity" && errors.quantity && (
              <p className={styles.errorText}>{errors.quantity}</p>
            )}
          </div>

          <div>
            <label>قیمت</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              placeholder="قیمت"
              step="0.01"
            />
            {visibleErrorField === "price" && errors.price && (
              <p className={styles.errorText}>{errors.price}</p>
            )}
          </div>

          <div className={styles.modalButtons}>
            <button className={styles.submit} type="submit">
              ایجاد
            </button>
            <button className={styles.cancle} type="button" onClick={onClose}>
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ManagmentProducts({ onAdd }) {
  const [showModal, setShowModal] = useState(false);

  useTitle(showModal ? "Products : Add Products" : "Products");

  return (
    <div className={styles.ManagmentProducts}>
      <div className={styles.Managment}>
        <img src={manageAvatar} alt="لوگو" />
        <h1>مدیریت کالا</h1>
      </div>

      <div className={styles.button}>
        <button onClick={() => setShowModal(true)}>افزودن محصول</button>
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={(p) => {
            onAdd(p);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default ManagmentProducts;
