import { Category } from "./category";
import { Description } from "./description";
import { Tag } from "./tag";

export interface TransactionComponents {
  categories: Category[];
  descriptions: Description[];
  tags: Tag[];
}
