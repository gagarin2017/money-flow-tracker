import { notification } from "antd";
import { createContext, useContext, useState } from "react";
import { isSpringBoot } from "../components/services/api-common";
import {
  deleteTransactionAPI,
  fetchAccountTransactionsAPI,
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
  totalElements: number;
  currentPage: number;
  pageSize: number;
  fetchTransactionsByBankAccount: (
    bankAccount: BankAccount,
    page?: number,
    pageSize?: number
  ) => void;
  fetchTransactionsByBankAccountId: (
    bankAccountId: number,
    page?: number,
    pageSize?: number
  ) => void;
  saveTransactions: (transactions: Transaction[]) => void;
  deleteTransaction: (id: number) => void;
}

const TransactionsContext = createContext<TransactionsData>({
  transactions: [],
  isLoading: true,
  totalElements: 0,
  currentPage: 1,
  pageSize: 10,
  fetchTransactionsByBankAccount: (
    bankAccount: BankAccount,
    page?: number,
    pageSize?: number
  ) => {},
  fetchTransactionsByBankAccountId: (
    bankAccountId: number,
    page?: number,
    pageSize?: number
  ) => {},
  saveTransactions: (transactions: Transaction[]) => {},
  deleteTransaction: (id: number) => {},
});

function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [errors, setErrors] = useState<Error[]>([]);

  const fetchTransactionsByBankAccount = async (
    account: BankAccount,
    page?: number,
    pageSize?: number
  ) => {
    fetchTransactionsByBankAccountId(account.id, page, pageSize);
  };

  const fetchTransactionsByBankAccountId = async (
    bankAccountId: number,
    page: number = 1,
    size: number = 10
  ) => {
    setLoading(true);

    if (bankAccountId < 0) {
      return;
    }

    try {
      const data: any = await fetchAccountTransactionsAPI(
        bankAccountId,
        page,
        size
      );

      const fetchedTransactions = data.transactions;
      const total = data.totalElements || data.total || 0;

      setTransactions(fetchedTransactions);
      setTotalElements(total);
      setCurrentPage(page);
      setPageSize(size);
      setLoading(false);
    } catch (error) {
      console.error(
        `Error fetching transactions for account ${bankAccountId}:`,
        error
      );
      setLoading(false);
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
    totalElements,
    currentPage,
    pageSize,
    fetchTransactionsByBankAccount,
    fetchTransactionsByBankAccountId,
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
