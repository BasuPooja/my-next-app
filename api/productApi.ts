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
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);

  return baseApi(`/products?${params.toString()}`, {
    method: "GET",
    auth: true,
  });
};

export const getProductList = (
  page: number,
  search?: string,
  sortField?: string,
  sortDirection?: string
): Promise<ProductPagination> => {

  const params = new URLSearchParams({
    page: String(page),
  });

  if (search) params.append("search", search);
  if (sortField) params.append("sortField", sortField);
  if (sortDirection) params.append("sortDirection", sortDirection);

  return baseApi(`/products?${params.toString()}`, {
    method: "GET",
    auth: true,
  });
};


