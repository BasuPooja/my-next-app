"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {

    const router = useRouter();

    const loginUser = async () => {

    try {
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

        const data = await response.json();
        localStorage.setItem("token", data.token);
        alert("Login Successful ✅");
        router.push("/products");

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
