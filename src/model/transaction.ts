import { Category } from "./category";

export interface Transaction {
  id: number;
  bankAccount: number;
  date: Date;
  category: Category;
  categoryName: string;
  description: string;
  descriptionName: string;
  memo: string;
  tag: string;
  balance: number; // balance from the transactions file (csv, txt)
  type: string;
  reconciled: boolean;
  amount: number;
  runningBalance: number;
}
