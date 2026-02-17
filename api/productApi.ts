import { baseApi } from "./baseApi";

export const getProducts = (page: number, search: string) => {
  return baseApi(`/products?page=${page}&search=${search}`, {
    method: "GET",
    auth: true,
  });
};

