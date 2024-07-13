import { Category } from "./category";

export interface Product {
  idProducts: string;
  id: number;
  name: string;
  location: string;
  quantity: number;
  inputQuantity: number;
  category: Category;
  }