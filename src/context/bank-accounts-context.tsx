import { createContext, useContext, useState } from "react";
import BankAccount from "../model/bank-account";
import {
  editBankAccountsAPI,
  fetchBankAccountsAPI,
} from "../components/services/bank-account-api";
import { sortBankAccountsByBankName } from "../utils/bank-account-helper";

export interface BankAccountsData {
  bankAccounts: BankAccount[];
  selectedBankAccountId: number;
  isLoading: boolean;
  fetchBankAccounts: () => void;
  editBankAccount: (bankAccount: BankAccount) => void;
  setSelectedBankAccountId: (id: number) => void;
}

const BankAccountsContext = createContext<BankAccountsData>({
  bankAccounts: [],
  selectedBankAccountId: -1,
  isLoading: true,
  fetchBankAccounts: () => {},
  editBankAccount: (bankAccount: BankAccount) => {},
  setSelectedBankAccountId: (id: number) => {},
});

function BankAccountsProvider({ children }: { children: React.ReactNode }) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [selectedBankAccountId, setSelectedBankAccountId] =
    useState<number>(-1);

  const fetchBankAccounts = async () => {
    try {
      const rawData = await fetchBankAccountsAPI();

      // const data = rawData._embedded.bankAccounts;
      const data = rawData;


      if (data && data.length > 0) {
        const sortedBankAccounts = sortBankAccountsByBankName(data);
        setSelectedBankAccountId(sortedBankAccounts[0].id);
        setBankAccounts(sortedBankAccounts);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const editBankAccount = async (account: BankAccount) => {
    try {
      const fetchedAccount = editBankAccountsAPI(account);

      const updatedBankAccountsList: BankAccount[] = bankAccounts.map(
        (bankAccount) => {
          if (bankAccount.id === account.id) {
            return { ...bankAccount, ...fetchedAccount };
          }
          return bankAccount;
        }
      );

      setBankAccounts(sortBankAccountsByBankName(updatedBankAccountsList));
    } catch (error) {
      console.error("Error updating bank account:", error);
    }
  };

  const valueToShare = {
    bankAccounts,
    selectedBankAccountId,
    isLoading,
    fetchBankAccounts,
    editBankAccount,
    setSelectedBankAccountId,
  } as BankAccountsData;

  return (
    <BankAccountsContext.Provider value={valueToShare}>
      {children}
    </BankAccountsContext.Provider>
  );
}

// Create a custom hook to easily access the UserContext
export function useBankAccountsContext() {
  return useContext(BankAccountsContext);
}

export default BankAccountsContext;

export { BankAccountsProvider };

// DEV ONLY!
const pause = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};
