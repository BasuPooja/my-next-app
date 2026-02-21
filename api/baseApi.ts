const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions extends RequestInit {
  auth?: boolean; // whether token required
}

export const baseApi = async (
  endpoint: string,
  options: RequestOptions = {}
) => {
  const headers: any = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // attach token automatically
  if (options.auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // GLOBAL ERROR HANDLER
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Something went wrong");
    }

    if (response.status === 204) {
      return true;
    }

    return response.json();

  } catch (error: any) {
    console.error("API Error:", error.message);
    throw error;
  }
};

