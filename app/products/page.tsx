"use client";

export default function TestPage() {

  const connectLaravel = async () => {
    const res = await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
      method: "GET",
      credentials: "include",
    });

    console.log("Connected:", res.status);
  };

  return (
    <button onClick={connectLaravel}>
      Connect Laravel
    </button>
  );
}
