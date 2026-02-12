"use client";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
export default function LoginPage() {

  const loginUser = async () => {
    const router = useRouter();
    try{
        const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            email: "Pooja@gmail.com",
            password: "12345678",
        }),
        });
        if (!response.ok) {
            alert("Login Failed ❌");
            return;
        }

        alert("Login Successful ✅");
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/products");

=======

export default function LoginPage() {

    const router = useRouter();

    const loginUser = async () => {

    try {
        await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
            method: "GET",
            credentials: "include",
        });

  
        const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            email: "Pooja@gmail.com",
            password: "12345678",
        }),
        });
        if (!response.ok) {
            alert("Login Failed ❌");
            return;
        }

        alert("Login Successful ✅");
        router.push("/products");

>>>>>>> 8a04ed8 (Login page added)
    } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong ❌");
    }
  };

  return (
    <button onClick={loginUser}>
      Login
    </button>
  );
}
