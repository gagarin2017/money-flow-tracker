import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import BankAccount from "../../model/bank-account";
import {
  MockBankAccountProvider,
  getBankAccCtxValueToShare,
  setMatchMedia,
} from "../test-helper";
import BankAccountList from "../BankAccounts/bank-account-list";
import { Transaction } from "../../model/transaction";
import { Category } from "../../model/category";

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
];

const dummyTransactions: Transaction[] = [
  {
    id: 100,
    date: new Date(),
    bankAccount: 7,
    categoryName: "Groceries",
    category: {
      id: 1,
      name: "Groceries",
      parentCategory: {} as Category,
      subCategories: [],
    },
    amount: 7.32,
    runningBalance: 12.334,
    balance: 1255,
    description: "",
    descriptionName: "",
    memo: "",
    reconciled: true,
    tag: "",
    type: "",
  },
  {
    id: 101,
    date: new Date(),
    bankAccount: 3,
    categoryName: "Groceries",
    category: {
      id: 1,
      name: "Groceries",
      parentCategory: {} as Category,
      subCategories: [],
    },
    amount: 71.32,
    runningBalance: 12.334,
    balance: 1255,
    description: "",
    descriptionName: "",
    memo: "",
    reconciled: true,
    tag: "",
    type: "",
  },
];

const mockedFetchAccountsFunction = jest.fn();
const mockedEditAccountFunction = jest.fn();
const mockedSetSelectedBankAccountIdFunction = jest.fn();

const contextValueWithBankAccounts = getBankAccCtxValueToShare(
  dummyBankAccounts,
  dummyBankAccounts[1].id,
  false,
  mockedFetchAccountsFunction,
  mockedEditAccountFunction,
  mockedSetSelectedBankAccountIdFunction
);

// WIP
it.skip("should display card per each bank account passed to the list sorted by bank name", async () => {
  render(
    <MockBankAccountProvider valueToShare={contextValueWithBankAccounts}>
      <BankAccountList />
    </MockBankAccountProvider>
  );

  const bankAccountCards = screen.getAllByTestId("bank-account");

  // Assert that there are exactly 4 bank account cards
  expect(bankAccountCards).toHaveLength(4);

  const bankAccountLogo01 = within(bankAccountCards[0]).getByRole("img");
  const bankAccountLogo02 = within(bankAccountCards[1]).getByRole("img");
  const bankAccountLogo03 = within(bankAccountCards[2]).getByRole("img");
  const bankAccountLogo04 = within(bankAccountCards[3]).getByRole("img");

  expect(bankAccountLogo01).toHaveAttribute("src", "aib-logo.png");
  expect(bankAccountLogo02).toHaveAttribute("src", "boi-logo-1.png");
  expect(bankAccountLogo03).toHaveAttribute("src", "boi-logo-1.png");
  expect(bankAccountLogo04).toHaveAttribute("src", "kbc-logo.png");

  expect(mockedFetchAccountsFunction).toHaveBeenCalledTimes(1);
});
