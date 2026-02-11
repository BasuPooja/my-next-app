"use client";

export default function LoginPage() {

  const loginUser = async () => {


    await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });

  
    await fetch("http://127.0.0.1:8000/login", {
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
  };

  return (
    <button onClick={loginUser}>
      Login
    </button>
  );
}
