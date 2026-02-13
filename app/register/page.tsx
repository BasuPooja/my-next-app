"use client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const registerUser = async () => {
    try {

      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: "Pooja",
          email: "Pooja@gmail.com",
          password: "12345678",
        }),
      });

      if (!response.ok) {
        alert("Registration Failed ❌");
        return;
      }

      alert("Registration Successful ✅");

      // redirect to login
      router.push("/login");

    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <button onClick={registerUser}>
      Register
    </button>
  );
}
