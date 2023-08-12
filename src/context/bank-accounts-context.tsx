import { createContext, useContext, useState } from "react";
import BankAccount from "../model/bank-account";

// Define the type for the UserContext data
export interface BankAccountsData {
  bankAccounts: BankAccount[];
  isLoading: boolean;
  fetchBankAccounts: () => void;
}

const BankAccountsContext = createContext<BankAccountsData>({
  bankAccounts: [],
  isLoading: true,
  fetchBankAccounts: () => {},
});

function Provider({ children }: { children: React.ReactNode }) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch("http://localhost:3005/bankAccounts"); // Replace with the API endpoint URL
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBankAccounts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const valueToShare = {
    bankAccounts,
    isLoading,
    fetchBankAccounts,
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

export { Provider };
