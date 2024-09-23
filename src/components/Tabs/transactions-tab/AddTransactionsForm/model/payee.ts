import { Category } from "../../../../../model/category";
import { Description } from "../../../../../model/description";
import { Tag } from "../../../../../model/tag";

export default interface Payee {
  id: number;
  name: string;
  description?: Description;
  category: Category;
  tag: Tag;
  amount?: number;
  debitAmount?: number;
  creditAmount?: number;
}
