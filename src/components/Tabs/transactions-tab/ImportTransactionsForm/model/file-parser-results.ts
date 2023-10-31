import { Transaction } from "../../../../../model/transaction";

export interface FileParserResults {
  buildTransactionsForRequest: Transaction[];
  parsingErrors: string[];
  status: string;
  accountId: number;
  fileName: string;
}
