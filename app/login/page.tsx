"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginApi } from "@/api/authApi";

export default function LoginPage() {

    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: any) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

   const loginUser = async (e: any) => {
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f3f4f6",
      }}
    >
      <form
        onSubmit={loginUser}
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
          width: "340px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "13px",
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>

        {/* Register Link */}
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don’t have an account?
          <span
            onClick={() => router.push("/register")}
            style={{
              color: "#10b981",
              marginLeft: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
