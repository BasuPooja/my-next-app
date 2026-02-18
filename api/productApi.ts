import { baseApi } from "./baseApi";
import { ProductPagination } from "@/types/product";

export const getProducts = (
  page: number,
  search: string,
  sort?: string,
  minPrice?: string,
  maxPrice?: string
): Promise<ProductPagination> => {

  const params = new URLSearchParams({
    page: String(page),
    search: search || "",
  });

  if (sort) params.append("sort", sort);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);

  return baseApi(`/products?${params.toString()}`, {
    method: "GET",
    auth: true,
  });
};

