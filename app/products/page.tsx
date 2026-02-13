"use client";

export default function ProductPage() {

  const showProduct = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/api/products/1", {
      // method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    alert("Check console for product details");
  };

  return (
    <button onClick={showProduct}>
      Show Product
    </button>
  );
}
