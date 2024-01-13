import { Transaction } from "../../model/transaction";
import { FileParserResults } from "../Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import {
  deserializeFilteredTransactions,
  deserializeTransactions,
  serializeFileTransactions,
  serializeTransaction,
} from "./APIResources/transaction-resource";
import { BASE_URL } from "./api-common";
import { Method } from "./api-methods";

const BANK_ACCOUNT_FIELD = "bank-account";
const TRANSACTIONS_FIELD = "transactions";

export const fetchAccountTransactionsAPI = async (bankAccountId: number) => {
  const transactionsUrl: string = BASE_URL.concat("/")
    .concat(TRANSACTIONS_FIELD)
    .concat("/")
    .concat(BANK_ACCOUNT_FIELD)
    .concat(`/${bankAccountId}/`);
  const response = await fetch(transactionsUrl);

  if (!response.ok) {
    throw new Error("Transactions API: Fetching of data failed");
  }

  return await response.json();
};

export const filterTransactionsAPI = async (
  accountTransactions: FileParserResults[]
) => {
  const transactionsUrl: string = BASE_URL.concat("/")
    .concat(TRANSACTIONS_FIELD)
    .concat("/")
    .concat("filter");

  const transactionsToBeFiltered = accountTransactions.map((tx) =>
    serializeFileTransactions(tx)
  );

  const filteredTransactions = await fetch(transactionsUrl, {
    method: Method.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionsToBeFiltered),
  });

  if (!filteredTransactions.ok) {
    throw new Error("Transactions API: Sending of data failed");
  }

  const receivedTransactions = await filteredTransactions.json();

  const result: FileParserResults[] =
    deserializeFilteredTransactions(receivedTransactions);

  return result;
};

export const sendTransactionsAPI = async (
  transactions: Transaction[],
  url: string | undefined
) => {
  const defaultUrl: string = BASE_URL.concat("/")
    .concat(TRANSACTIONS_FIELD)
    .concat("/");
  const transactionsUrl = url ? url : defaultUrl;
  const transactionsToSend = transactions.map((tx) => serializeTransaction(tx));
  const response = await fetch(transactionsUrl, {
    method: Method.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionsToSend),
  });

  if (!response.ok) {
    throw new Error("Transactions API: Sending of data failed");
  }

  const receivedTransactions = await response.json();
  const deserializedTransactions: Transaction[] | undefined =
    deserializeTransactions(receivedTransactions._embedded.transactions);

  return deserializedTransactions;
};

export const deleteTransactionAPI = async (transactionId: number) => {
  const transactionsUrl: string = BASE_URL.concat("/")
    .concat(TRANSACTIONS_FIELD)
    .concat("/")
    .concat(transactionId.toString());

  const response = await fetch(transactionsUrl, {
    method: Method.DELETE,
  });

  if (!response.ok) {
    throw new Error("Transactions API: Deleting of data failed");
  }
};
