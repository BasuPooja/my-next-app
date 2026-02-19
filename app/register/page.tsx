"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerApi } from "@/api/authApi";
import { RegisterForm } from "@/types/auth"
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerApi(form);
      toast.success("Registration Successful");
      router.push("/login");

    } catch (error) {
      console.error(error);
      toast.error("Registration Failed");
    }
  };

  return (
<div className="flex items-center justify-center min-h-screen bg-indigo-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[380px] text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Create Account
        </h2>

        <form
          onSubmit={registerUser}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

           <div style={{ position: "relative" }}>
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
            Register
          </button>
        </form>

        <p className="mt-6 text-gray-600">
          Already registered?
        </p>

        <button
          onClick={() => router.push("/login")}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
