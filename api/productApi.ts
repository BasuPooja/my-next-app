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

export const bulkDeleteProducts = (ids: number[]) => {
  return baseApi("/products/bulk-delete", {
    method: "DELETE",
    auth: true,
    body: JSON.stringify({ ids }),
  });
};

export const exportProducts = async (params?: {
  search?: string;
  ids?: number[];
  page?: number;
}): Promise<Blob> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const query = new URLSearchParams();

  if (params?.search) query.append("search", params.search);

  if (params?.ids && params.ids.length > 0) {
    params.ids.forEach((id) => query.append("ids[]", id.toString()));
  }

  if (params?.page) query.append("page", params.page.toString());

  const response = await fetch(
    `${BASE_URL}/products/export?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to export products");
  }

  return response.blob();
};

export const importProducts = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return baseApi("/products/import", {
    method: "POST",
    auth: true,
    body: formData,
  });
};

