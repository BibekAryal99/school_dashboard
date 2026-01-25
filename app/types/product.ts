export interface Product {
  id?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  status: "Available" | "Out of Stock";
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  colors?: string[];
  sizes?: string[];
}