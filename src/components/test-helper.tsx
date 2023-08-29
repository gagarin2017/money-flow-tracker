import "@testing-library/jest-dom";
import BankAccountsContext, {
  BankAccountsData,
} from "../context/bank-accounts-context";
import BankAccount from "../model/bank-account";

export function setMatchMedia() {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };
}

export const getValueToShare = (
  bankAccounts: BankAccount[],
  selectedBankAccountId: number,
  isLoading: boolean,
  fetchBankAccounts: () => {},
  editBankAccountById: (bankAccount: BankAccount) => {},
  setSelectedBankAccountId: (id: number) => {}
) => {
  return {
    bankAccounts,
    selectedBankAccountId,
    isLoading,
    fetchBankAccounts,
    editBankAccountById,
    setSelectedBankAccountId,
  } as BankAccountsData;
};

// Provide mock context value
export const MockBankAccountProvider = ({
  children,
  valueToShare,
}: {
  children: React.ReactNode;
  valueToShare: BankAccountsData;
}) => (
  <BankAccountsContext.Provider value={valueToShare}>
    {children}
  </BankAccountsContext.Provider>
);
