import { Transaction } from "../../../model/transaction";

export interface RemoteAccountTransactions {
  bankAccountId: number;
  fileTransactions: Transaction[];
}
