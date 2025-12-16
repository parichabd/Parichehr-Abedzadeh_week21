import { useState } from "react";

import { formatPrice, toPersianNumber } from "../Hooks/usePersian";
import styles from "../../styles/ProductsTable.module.css";

function EditModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product.name || "",
    price: product.price || "",
    quantity: product.quantity || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "نام کالا الزامی است.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      e.price = "قیمت معتبر وارد کنید.";
    if (
      !form.quantity ||
      !Number.isInteger(Number(form.quantity)) ||
      Number(form.quantity) < 0
    )
      e.quantity = "موجودی معتبر وارد کنید.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({
      id: product.id,
      name: form.name,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    });
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>ویرایش اطلاعات</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.fieldWrapper}>
            <label>نام کالا</label>
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <p className={styles.errorText}>{errors.name}</p>}
          </div>

          <div className={styles.fieldWrapper}>
            <label>موجودی</label>
            <input
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              type="number"
            />
            {errors.quantity && (
              <p className={styles.errorText}>{errors.quantity}</p>
            )}
          </div>

          <div className={styles.fieldWrapper}>
            <label>قیمت</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              step="0.01"
            />
            {errors.price && <p className={styles.errorText}>{errors.price}</p>}
          </div>

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.submit}>
              ثبت تغییرات
            </button>
            <button type="button" className={styles.cancle} onClick={onClose}>
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductsTable({ products = [], onEdit, onDelete }) {
  const [editingProduct, setEditingProduct] = useState(null);

  const openEdit = (product) => setEditingProduct(product);
  const closeEdit = () => setEditingProduct(null);

  const saveEdit = (updated) => {
    onEdit(updated);
    closeEdit();
  };

  return (
    <div>
      <table className={styles.TableProducts}>
        <thead>
          <tr>
            <th>نام کالا</th>
            <th>موجودی</th>
            <th>قیمت</th>
            <th>شناسه کالا</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) ? (
            products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{toPersianNumber(product.quantity)}</td>
                  <td className={styles.priceCell}>
                    <span>{formatPrice(product.price)}</span>
                    <p>تومان</p>
                  </td>
                  <td
                    dir="ltr"
                    style={{ fontFamily: "monospace", fontSize: "14px" }}
                  >
                    {product.id}
                  </td>
                  <td className={styles.actions}>
                    <img
                      src="/edit.png"
                      alt="ویرایش"
                      onClick={() => openEdit(product)}
                      style={{ cursor: "pointer" }}
                    />
                    <img
                      src="/trash.png"
                      alt="حذف"
                      onClick={() => onDelete(product.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#999",
                  }}
                >
                  محصولی یافت نشد
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td
                colSpan="5"
                style={{ textAlign: "center", padding: "60px", color: "#aaa" }}
              >
                در حال بارگذاری...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={closeEdit}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}

export default ProductsTable;
