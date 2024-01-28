import { notification } from "antd";
import { createContext, useContext, useState } from "react";
import { AccountTransaction } from "../components/Tabs/transactions-tab/AddTransactionsForm/add-transactions-form";
import { FileParserResults } from "../components/Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import { transformParsedTransactions } from "../components/Tabs/transactions-tab/add-transactions-utils";
import { isSpringBoot } from "../components/services/api-common";
import {
  deleteTransactionAPI,
  fetchAccountTransactionsAPI,
  filterTransactionsAPI,
  saveTransactionsAPI,
} from "../components/services/transactions-api";
import BankAccount from "../model/bank-account";
import Error from "../model/error";
import { Transaction } from "../model/transaction";

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
  deleteTransaction: (id: number) => void;
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
  deleteTransaction: (id: number) => {},
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
      const fetchedTransactions = isSpringBoot
        ? data._embedded.transactions
        : data;

      // DEV ONLY! 1 second pause
      // await pause(5000);

      setTransactions(fetchedTransactions);
      setLoading(false);
    } catch (error) {
      console.error(
        `Error fetching transactions for account ${bankAccountId}:`,
        error
      );
    }
  };

  const saveTransactions = async (transactionsToSave: Transaction[]) => {
    setLoading(true);

    try {
      const savedTransactons: Transaction[] | undefined =
        await saveTransactionsAPI(transactionsToSave, undefined);

      if (savedTransactons) {
        const newState = [...savedTransactons, ...transactions];
        setTransactions(newState);
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

  const deleteTransaction = async (transactionId: number) => {
    setLoading(true);

    try {
      await deleteTransactionAPI(transactionId);

      const newState = [...transactions].filter(
        (tx) => tx.id !== transactionId
      );
      setTransactions(newState);
      setLoading(false);
    } catch (error) {
      console.log("Error occurred while deleting the transaction: ", error);
      const theError = {
        message: "Failed to delete Transaction",
        description,
      };

      notification.error({ ...theError, duration: 0 });
      // dispatch(errorActions.addError({ ...theError, type: "error" }));
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
    deleteTransaction,
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
