"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/api/productApi";
import { Product } from "@/types/product";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [sort, setSort] = useState("latest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedSort, setAppliedSort] = useState("latest");
  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");


  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

 const fetchProducts = async () => {
  setLoading(true);

  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const data = await getProducts(
      page, 
      appliedSearch,
      appliedSort,
      appliedMinPrice,
      appliedMaxPrice
    );

      setProducts(data.data);
      setLastPage(data.last_page);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
};


  useEffect(() => {
    fetchProducts();
  }, [page, appliedSearch, appliedSort, appliedMinPrice, appliedMaxPrice]);

  const addToCart = (product: Product) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);
    toast.success("Added to cart");
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

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
          <div className="relative cursor-pointer">
            <Image
              src="/icons/cart.svg"
              alt="cart"
              width={28}
              height={28}
            />
            {/* Added conditional rendering for cart badge to display only when cart count is greater than zero. */}
            {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs px-2 rounded-full">
              {cartCount}
            </span>
          )}

          </div>
          <button
            onClick={logout}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white shadow-sm px-10 py-4 flex flex-wrap gap-4 items-center">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setAppliedSearch(search);
                setPage(1);
              }
          }}
          className="px-4 py-2 border rounded-lg w-64"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="latest">Latest</option>
          <option value="price_low">Price Low → High</option>
          <option value="price_high">Price High → Low</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-4 py-2 border rounded-lg w-32"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-4 py-2 border rounded-lg w-32"
        />

        <button
          onClick={() => {
            setAppliedSort(sort);
            setAppliedMinPrice(minPrice);
            setAppliedMaxPrice(maxPrice);
            setPage(1);
          }}
          className="bg-blue-800 text-white px-6 py-2 rounded-lg"
        >
          Apply
        </button>

      </div>


      {/* PRODUCTS GRID */}
      <div className="p-10 grid grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition"
          >
            <img
              src={
                product.image.startsWith("http")
                  ? product.image
                  : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`
              }
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

              <button 
                onClick={() => addToCart(product)}
                className="bg-sky-500 text-white px-4 py-1 rounded-lg hover:bg-sky-600 transition">
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
