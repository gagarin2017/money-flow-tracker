import { Category } from "../../../../../model/category";
import { Tag } from "../../../../../model/tag";

export default interface Payee {
  id: number;
  name: string;
  category: Category;
  tag: Tag;
  amount?: number;
}
