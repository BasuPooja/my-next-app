"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductList, exportProducts } from "@/api/productApi";
import { baseApi } from "@/api/baseApi";
import { Product } from "@/types/product";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ProductListPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [exportType, setExportType] = useState<"all" | "page" | "selected">("all");
  
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const data = await getProductList(page,  appliedSearch, sortField, sortDirection);
      setProducts(data.data);
      setLastPage(data.last_page);
      } catch (error) {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProducts();
  }, [page,  appliedSearch, sortField, sortDirection]);

  //------------------- Checkbox select----------------
  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selected.length === products.length) {
      setSelected([]);
    } else {
      setSelected(products.map((p) => p.id));
    }
  };

  //------------------------------- Single delete ------------------------
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await baseApi(`/products/${id}`, {
        method: "DELETE",
        auth: true,
      });

      Swal.fire("Deleted!", "Product has been deleted.", "success");
      fetchProducts();
    } catch {
      Swal.fire("Error!", "Delete failed.", "error");
    }
  };

    // -------------------------------  Bulk delete ------------------------------- 
    const handleBulkDelete = async () => {
      if (selected.length === 0) return;

      const result = await Swal.fire({
        title: "Delete selected products?",
        text: `You are deleting ${selected.length} products.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete!",
      });

      if (!result.isConfirmed) return;

      try {
        await Promise.all(
          selected.map((id) =>
            baseApi(`/products/${id}`, {
              method: "DELETE",
              auth: true,
            })
          )
        );

        Swal.fire("Deleted!", "Bulk delete successful.", "success");
        setSelected([]);
        fetchProducts();
      } catch {
        Swal.fire("Error!", "Bulk delete failed.", "error");
      }
    };

    // ---------------- SHOW ----------------
  const handleShow = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // ---------------- EDIT ----------------
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImage(null);
    setEditModal(true);
  };

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      
      formData.append("_method", "PUT");
      formData.append("name", selectedProduct.name);
      formData.append("price", selectedProduct.price);
      formData.append("description", selectedProduct.description);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

    // ---------------- Export ----------------
    const handleExport = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/export`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "products.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();

      } catch (error) {
        console.error("Export failed:", error);
      }
    };

    await baseApi(`/products/${selectedProduct.id}`, {
      method: "POST",
      body: formData,
      auth: true,
    });

    Swal.fire("Success!", "Product Updated", "success");

    setEditModal(false);
    setShowModal(false);
    setSelectedImage(null);
    fetchProducts();
    } catch {
      Swal.fire("Error!", "Update failed", "error");
    }
  };

  // ---------------- EXPORT ----------------
  // const handleExport = async (
  //   type: "all" | "selected" | "page" | "filtered"
  // ) => {
  //   try {
  //     let params: any = {};

  //     // 🔹 Export Selected Rows
  //     if (type === "selected" && selectedIds.length > 0) {
  //       params.ids = selectedIds;
  //     }

  //     // 🔹 Export Current Page
  //     if (type === "page") {
  //       params.page = currentPage;
  //     }

  //     // 🔹 Export Filtered Data
  //     if (type === "filtered" && search) {
  //       params.search = search;
  //     }

  //     const blob = await exportProducts(params);

  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "products.csv";
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //   } catch (error) {
  //     console.error("Export failed:", error);
  //   }
  // };
  const handleExport = async () => {
    try {
      
      if (exportType === "selected" && selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Product Selected",
        text: "Please select at least one product to export.",
      });
      return;
    }

    let params: any = {};

    if (exportType === "selected") {
      params.ids = selected;
    }

      if (exportType === "page") {
        params.page = page;
      }

      const blob = await exportProducts(params);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      Swal.fire("Success!", "CSV Exported Successfully", "success");

    } catch (error) {
      Swal.fire("Error!", "Export Failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sky-100">
        <h2 className="text-blue-900 text-lg font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-100 p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">
          Product List
        </h1>

        <div className="flex gap-3">

          <div className="flex gap-3 items-center">

            <select
              value={exportType}
              onChange={(e) =>
                setExportType(e.target.value as "all" | "page" | "selected")
              }
              className="border px-3 py-2 rounded-lg"
            >
              <option value="all">All</option>
              <option value="page">Current Page</option>
              <option value="selected">Selected</option>
            </select>

            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Export
            </button>

          </div>
          
          <button
            onClick={() => router.push("/products/import")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Import
          </button>

          <button
            onClick={() => router.push("/products/create")}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Search BAR */}
      <div className="bg-white shadow px-6 py-4 mb-4 flex gap-4 items-center rounded-xl">

         <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                setAppliedSearch(searchInput);
              }
            }}
            className="border px-4 py-2 rounded-lg w-64"
          />

          {/* SORT FIELD */}
          <select
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>

          {/* SORT DIRECTION */}
          <select
            value={sortDirection}
            onChange={(e) => {
              setSortDirection(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

        {selected.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete Selected ({selected.length})
          </button>
        )}

      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-50 text-blue-900">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selected.length === products.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4">ID</th>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-sky-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleSelect(product.id)}
                  />
                </td>

                <td className="p-4">{product.id}</td>

                <td className="p-4">
                  <img
                    src={
                      product.image.startsWith("http")
                        ? product.image
                        : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`
                    }
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                </td>

                <td className="p-4 font-semibold">
                  {product.name}
                </td>

                <td className="p-4 text-green-600 font-bold">
                  ₹ {product.price}
                </td>

                <td className="p-4 flex gap-4 justify-center">
                  <button
                    onClick={() => handleShow(product)}
                    className="text-blue-600 hover:underline"
                  >
                    Show
                  </button>

                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

        {/* PREV */}
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-2 bg-blue-800 text-white rounded disabled:opacity-40"
        >
          Prev
        </button>

        {/* PAGE NUMBERS */}
        {[...Array(lastPage)].map((_, index) => {
          const pageNumber = index + 1;

          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-3 py-2 rounded ${
                page === pageNumber
                  ? "bg-blue-800 text-white"
                  : "bg-white border"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* NEXT */}
        <button
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
          className="px-3 py-2 bg-blue-800 text-white rounded disabled:opacity-40"
        >
          Next
        </button>

      </div>
      {/* SHOW MODAL */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>

            <img
              src={
                selectedProduct.image?.startsWith("http")
                  ? selectedProduct.image
                  : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${selectedProduct.image}`
              }
              className="w-24 h-24 rounded-lg object-cover mb-3"
            />

            <p><strong>ID:</strong> {selectedProduct.id}</p>
            <p><strong>Name:</strong> {selectedProduct.name}</p>
            <p><strong>Price:</strong> ₹ {selectedProduct.price}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setShowModal(false);
                  handleEdit(selectedProduct);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <input
              type="text"
              value={selectedProduct.name}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="number"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, price: e.target.value })
              }
              className="border p-2 w-full mb-3 rounded"
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : selectedProduct.image.startsWith("http")
                  ? selectedProduct.image
                  : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${selectedProduct.image}`
              }
              className="w-24 h-24 rounded-lg object-cover mb-3"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSelectedImage(e.target.files ? e.target.files[0] : null)
              }
              className="mb-3"
            />

            <textarea
              value={selectedProduct.description}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  description: e.target.value,
                })
              }
              className="border p-2 w-full mb-3 rounded"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Update
              </button>

              <button
                onClick={() => setEditModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
