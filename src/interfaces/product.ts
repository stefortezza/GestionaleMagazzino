import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  location: string;
  quantity: number;
  inputQuantity: number;
  category: Category;
  }