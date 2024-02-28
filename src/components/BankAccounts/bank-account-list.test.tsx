import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import BankAccount from "../../model/bank-account";
import {
  MockBankAccountProvider,
  getBankAccCtxValueToShare,
  setMatchMedia,
} from "../test-helper";
import BankAccountList from "./bank-account-list";

setMatchMedia();

const dummyBankAccounts: BankAccount[] = [
  {
    id: 1,
    bankName: "BOI Bank 1",
    accountName: "John Doe",
    balance: 1500,
    active: true,
    isSelected: false,
    bankLogo: "boiLogo",
  },
  {
    id: 11,
    bankName: "BOI Bank 1",
    accountName: "Keitlyn Doe",
    balance: 200,
    active: true,
    isSelected: false,
    bankLogo: "boiLogo",
  },
  {
    id: 2,
    bankName: "KBC Bank 2",
    accountName: "Jane Smith",
    balance: 2300,
    active: true,
    isSelected: false,
    bankLogo: "kbcLogo",
  },
  {
    id: 3,
    bankName: "AIB Bank 3",
    accountName: "Alice Johnson",
    balance: 800,
    active: false,
    isSelected: false,
    bankLogo: "aibLogo",
  },
  // Add more dummy bank accounts here if needed
];

const mockedFetchAccountsFunction = jest.fn();
const mockedEditAccountFunction = jest.fn();
const mockedSetSelectedBankAccountIdFunction = jest.fn();

const contextValueWithAccounts = getBankAccCtxValueToShare(
  dummyBankAccounts,
  dummyBankAccounts[1].id,
  false,
  mockedFetchAccountsFunction,
  mockedEditAccountFunction,
  mockedSetSelectedBankAccountIdFunction
);

const contextValueWithoutAccounts = getBankAccCtxValueToShare(
  [],
  -1,
  false,
  mockedFetchAccountsFunction,
  mockedEditAccountFunction,
  mockedSetSelectedBankAccountIdFunction
);

test("that selected bank account card has unique style", async () => {
  render(
    <MockBankAccountProvider valueToShare={contextValueWithAccounts}>
      <BankAccountList />
    </MockBankAccountProvider>
  );

  const bankAccountCards = screen.getAllByTestId("bank-account");

  expect(bankAccountCards[0]).not.toHaveStyle("background-color: lightBlue");
  expect(bankAccountCards[1]).toHaveStyle("background-color: lightBlue");
  expect(bankAccountCards[2]).not.toHaveStyle("background-color: lightBlue");
  expect(bankAccountCards[3]).not.toHaveStyle("background-color: lightBlue");

  expect(mockedFetchAccountsFunction).toHaveBeenCalledTimes(1);
});

test("that Empty component is displayed when there are no bank accounts passed to the list", async () => {
  render(
    <MockBankAccountProvider valueToShare={contextValueWithoutAccounts}>
      <BankAccountList />
    </MockBankAccountProvider>
  );

  const bankAccountCards = screen.queryAllByTestId("bank-account");

  const emptyData = screen.getByText("No accounts exist yet.");

  expect(bankAccountCards).toHaveLength(0);
  expect(emptyData).toBeInTheDocument();

  expect(mockedFetchAccountsFunction).toHaveBeenCalledTimes(1);
});
