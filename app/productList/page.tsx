"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductList } from "@/api/productApi";
import { baseApi } from "@/api/baseApi";
import { Product } from "@/types/product";
import toast from "react-hot-toast";

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
    if (!confirm("Delete this product?")) return;

    try {
      await baseApi(`/products/${id}`, {
        method: "DELETE",
        auth: true,
      });

      toast.success("Deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  // -------------------------------  Bulk delete ------------------------------- 
  const handleBulkDelete = async () => {
    if (selected.length === 0) return;

    if (!confirm("Delete selected products?")) return;

    try {
      await Promise.all(
        selected.map((id) =>
          baseApi(`/products/${id}`, {
            method: "DELETE",
            auth: true,
          })
        )
      );

      toast.success("Bulk delete successful");
      setSelected([]);
      fetchProducts();
    } catch {
      toast.error("Bulk delete failed");
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
          <button
            onClick={() => router.push("/products/import")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Import
          </button>

          <button
            onClick={() => router.push("/products/export")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Export
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
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Show
                  </button>

                  <button
                    onClick={() =>
                      router.push(`/products/edit/${product.id}`)
                    }
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


    </div>
  );
}
