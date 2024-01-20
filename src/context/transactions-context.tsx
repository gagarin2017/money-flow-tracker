import { createContext, useContext, useState } from "react";
import BankAccount from "../model/bank-account";
import { Transaction } from "../model/transaction";
import {
  fetchAccountTransactionsAPI,
  filterTransactionsAPI,
  sendTransactionsAPI,
} from "../components/services/transactions-api";
import { FileParserResults } from "../components/Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import { AccountTransaction } from "../components/Tabs/transactions-tab/AddTransactionsForm/add-transactions-form";
import { transformParsedTransactions } from "../components/Tabs/transactions-tab/add-transactions-utils";
import { isSpringBoot } from "../components/services/api-common";
import Error from "../model/error";
import { notification } from "antd";

const description =
  "Request was probably sent, but no response on the other side... Are you calling to the right door?";

export interface TransactionsData {
  transactions: Transaction[];
  isLoading: boolean;
  importedTransactions: AccountTransaction[];
  fetchTransactionsByBankAccount: (bankAccount: BankAccount) => void;
  fetchTransactionsByBankAccountId: (bankAccountId: number) => void;
  fetchTransactionsToBeImported: (
    transactionsToBeImported: FileParserResults[],
    activeBankAccounts: BankAccount[]
  ) => void;
  saveTransactions: (transactions: Transaction[]) => void;
}

const TransactionsContext = createContext<TransactionsData>({
  transactions: [],
  importedTransactions: [],
  isLoading: true,
  fetchTransactionsByBankAccount: (bankAccount: BankAccount) => {},
  fetchTransactionsByBankAccountId: (bankAccountId: number) => {},
  fetchTransactionsToBeImported: (
    transactionsToBeImported: FileParserResults[],
    activeBankAccounts: BankAccount[]
  ) => {},
  saveTransactions: (transactions: Transaction[]) => {},
});

function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [importedTransactions, setImportedTransactions] = useState<
    AccountTransaction[]
  >([]);
  const [errors, setErrors] = useState<Error[]>([]);

  const fetchTransactionsByBankAccount = async (account: BankAccount) => {
    fetchTransactionsByBankAccountId(account.id);
  };

  const fetchTransactionsToBeImported = async (
    transactionsToBeImported: FileParserResults[],
    activeBankAccounts: BankAccount[]
  ) => {
    const filteredTransactions = await filterTransactionsAPI(
      transactionsToBeImported
    );

    const tableTransactions = transformParsedTransactions(
      filteredTransactions,
      activeBankAccounts
    );

    if (tableTransactions && tableTransactions.length > 0) {
      setImportedTransactions(tableTransactions);
    }
  };

  const fetchTransactionsByBankAccountId = async (bankAccountId: number) => {
    setLoading(true);

    if (bankAccountId < 0) {
      return;
    }

    try {
      const data: any = await fetchAccountTransactionsAPI(bankAccountId);

      // DEV ONLY! 1 second pause
      // Fix for production
      const transactions = isSpringBoot ? data._embedded.transactions : data;

      // DEV ONLY! 1 second pause
      // await pause(5000);

      setTransactions(transactions);
      setLoading(false);
    } catch (error) {
      console.error(
        `Error fetching transactions for account ${bankAccountId}:`,
        error
      );
    }
  };

  const saveTransactions = async (transactions: Transaction[]) => {
    setLoading(true);

    try {
      const savedTransactons: Transaction[] | undefined =
        await sendTransactionsAPI(transactions, undefined);

      if (savedTransactons) {
        setTransactions(savedTransactons);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error occurred: ", error);
      const theError: Error = {
        type: "error",
        message: "Failed to send Transactions",
        description,
      };

      console.log(theError);

      const newErrors = [...errors, theError];

      setErrors(newErrors);
    }
  };

  const valueToShare = {
    transactions,
    isLoading,
    importedTransactions,
    fetchTransactionsByBankAccount,
    fetchTransactionsByBankAccountId,
    fetchTransactionsToBeImported,
    saveTransactions,
  } as TransactionsData;

  return (
    <TransactionsContext.Provider value={valueToShare}>
      {children}
    </TransactionsContext.Provider>
  );
}
export function useTransactionsContext() {
  return useContext(TransactionsContext);
}

export default TransactionsContext;

export { TransactionsProvider };

// DEV ONLY!
const pause = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};
