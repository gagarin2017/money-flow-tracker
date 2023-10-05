import { createContext, useContext, useState } from "react";
import BankAccount from "../model/bank-account";
import { Transaction } from "../model/transaction";

export interface TransactionsData {
  transactions: Transaction[];
  isLoading: boolean;
  fetchTransactionsByBankAccount: (bankAccount: BankAccount) => void;
  fetchTransactionsByBankAccountId: (bankAccountId: number) => void;
}

const TransactionsContext = createContext<TransactionsData>({
  transactions: [],
  isLoading: true,
  fetchTransactionsByBankAccount: (bankAccount: BankAccount) => {},
  fetchTransactionsByBankAccountId: (bankAccountId: number) => {},
});

function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const fetchTransactionsByBankAccount = async (account: BankAccount) => {
    fetchTransactionsByBankAccountId(account.id);
  };

  const fetchTransactionsByBankAccountId = async (bankAccountId: number) => {
    console.log("fetching transactions for the account id ", bankAccountId);

    setLoading(true);

    if (bankAccountId < 0) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3005/transactions/bankAccount/${bankAccountId}`
      );

      // DEV ONLY! 1 second pause
      await pause(5000);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setTransactions(data);
      setLoading(false);

      console.log("Response: ", response);
    } catch (error) {
      console.error(
        `Error fetching transactions for account ${bankAccountId}:`,
        error
      );
    }
  };

  const valueToShare = {
    transactions,
    isLoading,
    fetchTransactionsByBankAccount,
    fetchTransactionsByBankAccountId,
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