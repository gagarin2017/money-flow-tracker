import { DataSourceItemType } from "antd/lib/auto-complete";
import moment from "moment";
import BankAccount from "../../../../model/bank-account";
import { Description } from "../../../../model/description";
import { Tag } from "../../../../model/tag";
import { Transaction } from "../../../../model/transaction";
import { getStringFromDate } from "../../../../utils/date-helper";
import { FileParserResults } from "../ImportTransactionsForm/model/file-parser-results";
import { AccountTransaction } from "./add-transactions-form";
import { Category } from "../../../../model/category";

export interface FormTransaction {
  id: number | undefined;
  date: string;
  payee: string;
  category?: number | undefined;
  description: string;
  memo?: string;
  tag?: string;
  amount: number | undefined;
}

export const EMPTY_FORM_TRANSACTION = {
  id: Math.random() * moment().toISOString().length,
  date: moment().toISOString(),
  category: undefined,
  description: "",
  memo: "",
  tag: "",
  amount: undefined,
} as FormTransaction;

export const createAutoCompleteDescTagDataSource = (
  savedValuesList: Tag[] | Description[]
): DataSourceItemType[] => {
  return [];

  // return savedValuesList.map((item) => {
  //   return { key: item.id, value: item.name };
  // });
};

export const transformParsedTransactions = (
  parsedResults: FileParserResults[],
  activeAccounts: BankAccount[]
): AccountTransaction[] => {
  const result: AccountTransaction[] = [];

  parsedResults.forEach((parserResults: FileParserResults) => {
    const account = activeAccounts.find(
      (acc) => acc.id === parserResults.accountId
    );
    if (account) {
      const tableTransactions = {
        bankAccount: account,
        transactions: transformTransactionsToTableTransactions(
          parserResults.buildTransactionsForRequest
        ),
      } as AccountTransaction;

      result.push(tableTransactions);
    }
  });

  return result;
};

/**
 * Return the transaction as an editable table row in the Add transaction form
 *
 * @param buildTransactionsForRequest
 */
function transformTransactionsToTableTransactions(
  transactionsToBeImported: Transaction[]
): FormTransaction[] {
  const result: FormTransaction[] = transactionsToBeImported.map(
    (txToImport: Transaction) => {
      // console.log("🚀 ~ file: add-transactions-utils.ts:78 ~ txToImport:", txToImport)
      const date = getStringFromDate(txToImport.date);
      return {
        id: -date.length * Math.random() * 1234,
        date: date,
        description: txToImport.description.name,
        amount: txToImport.amount,
      } as FormTransaction;
      // return {} as FormTransaction
    }
  );
  return result;
}
