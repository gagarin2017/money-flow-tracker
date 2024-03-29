import { Category } from "./category";
import { Description } from "./description";
import { Tag } from "./tag";

export interface Transaction {
  id: number;
  bankAccount?: number;
  date: Date;
  category: Category;
  categoryName?: string;
  description: Description;
  descriptionName?: string;
  memo: string;
  tag: Tag;
  reconsiled: boolean;
  // balance from the transactions file (csv, txt)
  balance?: number;
  type?: string;
  amount: number;
  // running balance calculated for all transactions on the billing account
  runningBalance: number;
  // the flag needed to filter transactions for the report (need to ignore these to caclulate the spending sum per month, for example)
  betweenAccountsTransaction?: boolean;
  created_At?: string;
  updated_At?: string;
  _links?: object;
}
