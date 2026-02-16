"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      setProducts(data.data);
      setLastPage(data.last_page);
      setLoading(false);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-100">
        <h2 className="text-xl text-blue-900 font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-100">

      <div className="bg-white shadow-md px-10 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-900">
          E-Commerce
        </h1>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <button
            onClick={logout}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="p-10 grid grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition"
          >
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

            <h2 className="text-lg font-semibold text-blue-900">
              {product.name}
            </h2>

            <p className="text-gray-500 text-sm mb-3">
              {product.description}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-green-600 font-bold text-lg">
                ₹ {product.price}
              </span>

              <button className="bg-sky-500 text-white px-4 py-1 rounded-lg hover:bg-sky-600 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 pb-10">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-blue-800 text-white px-4 py-2 rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="font-semibold text-blue-900">
          Page {page} of {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
          className="bg-blue-800 text-white px-4 py-2 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

    </div>
  );
}
