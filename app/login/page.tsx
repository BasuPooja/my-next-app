"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginApi } from "@/api/authApi";
import { LoginForm } from "@/types/auth";

export default function LoginPage() {

    const router = useRouter();
    const [form, setForm] = useState<LoginForm>({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

   const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginApi(form);

      localStorage.setItem("token", data.token);
      alert("Login Successful");
      router.push("/products");

    } catch (error) {
      console.error(error);
      alert("Login Failed");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={loginUser}
        className="bg-white p-10 rounded-2xl shadow-xl w-[360px] flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-2">
          Login
        </h2>


        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
             className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-blue-600 font-semibold"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <button
          type="submit"
          className="bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
        >
          Login
        </button>

        <p className="text-center text-gray-600 mt-2">
          Don’t have an account?
          <span
            onClick={() => router.push("/register")}
             className="text-green-600 ml-2 cursor-pointer font-semibold"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
