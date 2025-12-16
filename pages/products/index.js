import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";

// components
import SearchBar from "./SearchBar";
import ManagmentProducts from "./ManagmentProducts";
import ProductsTable from "./ProductsTable";
import ConfirmDialog from "./ConfirmDialog";

// hooks & context
import { toPersianNumber } from "../Hooks/usePersian";
import { UserContext } from "../../Context/UserProvider";

// styles
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles/Products.module.css";

export default function Products() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/sign-in");
      }
    }
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          toast.error("خطا در دریافت محصولات");
          setProducts([]);
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setProducts(list);
      } catch (err) {
        console.error(err);
        toast.error("خطا در بارگذاری محصولات");
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredProducts.length <= 6 ? 1 : (filteredProducts.length - 6) / 10 + 1
  );

  const indexOfFirst = currentPage === 1 ? 0 : 6 + (currentPage - 2) * 10;
  const indexOfLast = currentPage === 1 ? 6 : indexOfFirst + 10;

  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const handleAddProduct = async (newProduct) => {
    try {
      const res = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error();
      const added = await res.json();

      setProducts((prev) => [...prev, added]);
      toast.success("محصول اضافه شد");
    } catch {
      toast.error("خطا در افزودن محصول");
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    try {
      const res = await fetch(
        `http://localhost:3000/products/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!res.ok) throw new Error();
      const updated = await res.json();

      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      toast.success("محصول ویرایش شد");
    } catch {
      toast.error("خطا در ویرایش محصول");
    }
  };

  const openConfirmDialog = (id) => {
    setProductToDelete(id);
    setConfirmOpen(true);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/products/${productToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (!res.ok && res.status !== 204) throw new Error();

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete));
      toast.success("محصول حذف شد");
    } catch {
      toast.error("خطا در حذف محصول");
    }

    cancelDelete();
  };

  const renderPagination = () => (
    <div className={styles.pagination}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={n === currentPage ? styles.active : ""}
          onClick={() => setCurrentPage(n)}
          disabled={n === currentPage}
        >
          {toPersianNumber(n)}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.products}>
      <SearchBar
        onSearch={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
      />

      <ManagmentProducts onAdd={handleAddProduct} />

      <ProductsTable
        products={currentProducts}
        onEdit={handleEditProduct}
        onDelete={openConfirmDialog}
      />

      {renderPagination()}

      <ConfirmDialog
        open={confirmOpen}
        message="آیا از حذف این محصول مطمئن هستید؟"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <ToastContainer position="top-right" autoClose={3000} rtl />
    </div>
  );
}
