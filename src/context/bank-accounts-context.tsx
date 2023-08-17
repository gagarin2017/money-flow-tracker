import { createContext, useContext, useState } from "react";
import BankAccount from "../model/bank-account";

// Define the type for the UserContext data
export interface BankAccountsData {
  bankAccounts: BankAccount[];
  isLoading: boolean;
  fetchBankAccounts: () => void;
  editBankAccountById: (bankAccount: BankAccount) => void;
}

const BankAccountsContext = createContext<BankAccountsData>({
  bankAccounts: [],
  isLoading: true,
  fetchBankAccounts: () => {},
  editBankAccountById: (bankAccount: BankAccount) => {},
});

function Provider({ children }: { children: React.ReactNode }) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch("http://localhost:3005/bankAccounts");
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

  const editBankAccountById = async (bankAccount: BankAccount) => {
    console.log("saving bank account", bankAccount);

    try {
      const response = await fetch(
        `http://localhost:3005/bankAccounts/${bankAccount.id}`,
        {
          method: "PUT", // Use the appropriate HTTP method (PUT, POST, etc.)
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bankAccount),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Response: ", response);

      const updatedBankAccountsList: BankAccount[] = bankAccounts.map(
        (book) => {
          if (book.id === bankAccount.id) {
            return { ...bankAccounts, ...bankAccount };
          }
          return book;
        }
      );

      setBankAccounts(updatedBankAccountsList);

      // Handle successful update, e.g., show a success message
    } catch (error) {
      console.error("Error updating bank account:", error);
      // Handle error, e.g., show an error message
    }
  };

  const valueToShare = {
    bankAccounts,
    isLoading,
    fetchBankAccounts,
    editBankAccountById,
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
