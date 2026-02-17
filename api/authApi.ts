import { baseApi } from "./baseApi";

export const loginApi = (form: {
  email: string;
  password: string;
}) => {
  return baseApi("/login", {
    method: "POST",
    body: JSON.stringify(form),
  });
};

export const registerApi = (form: {
  name: string;
  email: string;
  password: string;
}) => {
  return baseApi("/register", {
    method: "POST",
    body: JSON.stringify(form),
  });
};


