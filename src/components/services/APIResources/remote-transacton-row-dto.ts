import BankAccount from "../../../model/bank-account";
import { Category } from "../../../model/category";
import { Description } from "../../../model/description";
import { Tag } from "../../../model/tag";

/**
 * @deprecated need to be removed as no serialization/deserialization should be needed. The backend should send the exact object structure as in the UI
 */
export interface RemoteTransactionRow {
  id: number | undefined;
  bankAccount: BankAccount;
  amount?: number;
  debitAmount: number;
  creditAmount: number;
  category: Category;
  date: string;
  description: Description;
  reconsiled: boolean;
  tag: Tag;
  memo: string;
  runningBalance: number | null;
  previouslySavedTransaction?: boolean;
}
