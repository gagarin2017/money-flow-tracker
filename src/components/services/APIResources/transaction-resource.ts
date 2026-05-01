import BankAccount from "../../../model/bank-account";
import { Category } from "../../../model/category";
import { Description } from "../../../model/description";
import { Tag } from "../../../model/tag";
import { Transaction } from "../../../model/transaction";
import { ParsingStatus } from "../../../utils/TxFilesReader";
import {
  getDateFromString,
  getStringFromDate,
} from "../../../utils/date-helper";
import { AccountWithTransactions } from "../../Tabs/transactions-tab/AddTransactionsForm/add-transactions-form";
import { transformRemoteTransactionsIntoFormTransactions } from "../../Tabs/transactions-tab/add-transactions-utils";
import { FileParserResults } from "../../Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import { RemoteAccountTransactions } from "./remote-account-transactions-dto";
import { deserializeCategory } from "./remote-transaction-category";
import { deserializeTag } from "./remote-transaction-tag";
import { deserializeDescription } from "./remote-transacton-description";
import { RemoteTransactionRow } from "./remote-transacton-row-dto";

// TODO: clean this ugly code
export const serializeTransaction = (transaction: Transaction) => {
  console.log("🚀 ~ serializeTransaction ~ transaction:", transaction);

  if (transaction) {
    return {
      id: undefined,
      bankAccount: transaction.bankAccount,
      date: getStringFromDate(transaction.date),
      amount: transaction.amount,
      debitAmount: transaction.debitAmount,
      creditAmount: transaction.creditAmount,
      category: {
        id: transaction.category.id,
        name: transaction.category.name,
      } as Category,
      categoryName: transaction.categoryName,
      description: {
        name: transaction.description?.name || "",
      } as Description,
      descriptionName: transaction.descriptionName,
      memo: transaction.memo,
      reconsiled: transaction.reconsiled,
      tag: { name: transaction.tag ? transaction.tag.name : "" } as Tag,
      runningBalance: null,
    } as RemoteTransactionRow;
  }
};

export const serializeFileTransactions = (
  accountTransactions: FileParserResults
) => {
  if (
    accountTransactions.status === ParsingStatus.FINISHED &&
    (accountTransactions.parsingErrors === undefined ||
      accountTransactions.parsingErrors.length === 0)
  ) {
    return {
      bankAccountId: accountTransactions.accountId,
      fileTransactions: accountTransactions.buildTransactionsForRequest.map(
        (tx: Transaction) => {
          console.log("tx: ", tx);
          return {
            ...tx,
            date: getStringFromDate(tx.date),
          };
        }
      ),
    };
  }
};

export const deserializeTransactions = (
  transactions: RemoteTransactionRow[]
) => {
  if (transactions) {
    return transactions.map((remoteTxRow) => {
      return {
        id: remoteTxRow.id,
        description: deserializeDescription(remoteTxRow.description),
        memo: remoteTxRow.memo,
        category: deserializeCategory(remoteTxRow.category),
        tag: deserializeTag(remoteTxRow.tag),
        reconsiled: remoteTxRow.reconsiled,
        date: getDateFromString(remoteTxRow.date),
        debitAmount: remoteTxRow.debitAmount,
        creditAmount: remoteTxRow.creditAmount,
        runningBalance: remoteTxRow.runningBalance,
      } as Transaction;
    });
  }
};

export const deserializeFilteredTransactions = (
  transactions: RemoteAccountTransactions[]
): AccountWithTransactions[] => {
  let result: AccountWithTransactions[] = [];

  if (transactions) {
    result = transactions.map((accountTransactions) => {
      const formTransactions = transformRemoteTransactionsIntoFormTransactions(
        accountTransactions.fileTransactions
      );
      return {
        bankAccount: { id: accountTransactions.bankAccountId } as BankAccount,
        transactions: formTransactions,
        selectedTransactions: formTransactions
          .filter((tx) => !tx.previouslySavedTransaction)
          .map((tx) => tx.id),
      };
    });
  }

  return result;
};
