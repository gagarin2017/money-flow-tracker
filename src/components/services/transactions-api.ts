import { Transaction } from "../../model/transaction";
import { AccountWithTransactions } from "../Tabs/transactions-tab/AddTransactionsForm/add-transactions-form";
import { FileParserResults } from "../Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import { RemoteAccountTransactions } from "./APIResources/remote-account-transactions-dto";
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
  const filterTransactionsUrl: string = BASE_URL.concat("/")
    .concat(TRANSACTIONS_FIELD)
    .concat("/")
    .concat("filter");

  const transactionsToBeFiltered = accountTransactions.map((tx) =>
    serializeFileTransactions(tx)
  );

  let result: AccountWithTransactions[] = [];

  if (transactionsToBeFiltered) {
    // await new Promise((resolve) => setTimeout(resolve, 5000)); // Add timeout for DEV purposes

    const filteredTransactions = await fetch(filterTransactionsUrl, {
      method: Method.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionsToBeFiltered),
    });

    if (!filteredTransactions.ok) {
      throw new Error("Transactions API: Sending of data failed");
    }

    let receivedTransactions: RemoteAccountTransactions[] =
      await filteredTransactions.json();

    result = deserializeFilteredTransactions(receivedTransactions);
  } else {
    throw new Error("Transactions API: No params to be used for fetch");
  }

  return result;
};

export const saveTransactionsAPI = async (
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

export const fetchCurrentMonthTransactionsAPI = async (
  dateFrom: string,
  dateTo: string
) => {
  const transactionsUrl: string = BASE_URL.concat("/")
    .concat(TRANSACTIONS_FIELD)
    .concat("?")
    .concat(`dateFrom=${dateFrom}&dateTo=${dateTo}`);
  const response = await fetch(transactionsUrl);

  if (!response.ok) {
    throw new Error("Transactions API: Fetching of data failed");
  }

  return await response.json();
};
