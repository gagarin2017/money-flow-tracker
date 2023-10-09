import "@testing-library/jest-dom";
import BankAccountsContext, {
  BankAccountsData,
} from "../context/bank-accounts-context";
import TransactionsContext, {
  TransactionsData,
} from "../context/transactions-context";
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

export const getBankAccCtxValueToShare = (
  bankAccounts: BankAccount[],
  selectedBankAccountId: number,
  isLoading: boolean,
  fetchBankAccounts: () => {},
  editBankAccount: (bankAccount: BankAccount) => {},
  setSelectedBankAccountId: (id: number) => {}
) => {
  return {
    bankAccounts,
    selectedBankAccountId,
    isLoading,
    fetchBankAccounts,
    editBankAccount,
    setSelectedBankAccountId,
  } as BankAccountsData;
};

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

export const MockTransactionsProvider = ({
  children,
  valueToShare,
}: {
  children: React.ReactNode;
  valueToShare: TransactionsData;
}) => (
  <TransactionsContext.Provider value={valueToShare}>
    {children}
  </TransactionsContext.Provider>
);
