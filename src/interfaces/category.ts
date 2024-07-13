import { MacchinarioDTO } from "./macchinario-dto";
import { Product } from "./product";

export interface Category {
  id: number;
  name: string;
  macchinario: MacchinarioDTO;
  products: Product[];
  }