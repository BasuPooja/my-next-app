export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface ProductPagination {
  data: Product[];
  last_page: number;
}
