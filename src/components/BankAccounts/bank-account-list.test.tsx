import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import BankAccount from "../../model/bank-account";
import BankAccountList from "./bank-account-list";
import { getAmountAsFormatedString } from "../../utils/currency-helper";
import { shortenGivenTextWithEllipsis } from "../../utils/display-text-helper";
import {
  BankAccountsData,
  Provider,
} from "../../context/bank-accounts-context";
import BankAccountsContext from "../../context/bank-accounts-context";

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

const dummyBankAccounts: BankAccount[] = [
  {
    id: 1,
    bankName: "Example Bank 1",
    accountName: "John Doe",
    balance: 1500,
    active: true,
    isSelected: false,
    bankLogo: "kbcLogo",
  },
  {
    id: 2,
    bankName: "Sample Bank 2",
    accountName: "Jane Smith",
    balance: 2300,
    active: true,
    isSelected: false,
    bankLogo: "kbcLogo",
  },
  {
    id: 3,
    bankName: "Test Bank 3",
    accountName: "Alice Johnson",
    balance: 800,
    active: false,
    isSelected: false,
    bankLogo: "kbcLogo",
  },
  // Add more dummy bank accounts here if needed
];

const valueToShare = {
  bankAccounts: dummyBankAccounts,
  isLoading: false,
  fetchBankAccounts: () => {},
} as BankAccountsData;

// Provide mock context value
const MockBankAccountProvider: any = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <BankAccountsContext.Provider value={valueToShare}>
    {children}
  </BankAccountsContext.Provider>
);

it("should display card per each bank account passed to the list", async () => {
  render(
    <MockBankAccountProvider>
      <BankAccountList />
    </MockBankAccountProvider>
  );

  const bankAccountCards = screen.getAllByTestId("bank-account");

  expect(bankAccountCards.length).toBe(3);

  // Assert that there are exactly 3 elements
  expect(bankAccountCards).toHaveLength(3);
});
