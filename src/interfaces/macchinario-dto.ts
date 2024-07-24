import { Category } from "./category";
import { Product } from "./product";

export interface MacchinarioDTO {
  id: number;
  name: string;
  categoryIds: number[]; // Lista degli ID delle categorie
  productIds: number[];  // Lista degli ID dei prodotti
  categories: Category[];
  products: Product[]; 
}