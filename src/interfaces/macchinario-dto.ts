import { Category } from "./category";

export interface MacchinarioDTO {
  id: number;
  name: string;
  categories: Category[];
}