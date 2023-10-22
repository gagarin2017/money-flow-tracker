import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import BankAccount from "../../model/bank-account";
import BankAccountItem from "./bank-account-item";
import { getAmountAsFormatedString } from "../../utils/currency-helper";
import { shortenGivenTextWithEllipsis } from "../../utils/display-text-helper";

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

const renderComponent = (isSelected: boolean) => {
  const bankAccount: BankAccount = {
    id: 1,
    bankName: "Test Bank",
    accountName: "Current",
    bankLogo: "kbcLogo",
    isSelected,
    balance: 20450,
    active: true,
  };

  render(
    <BankAccountItem
      bankAccount={bankAccount}
      isSelected={isSelected}
      handleSelectBankAccount={() => {}}
    />
  );

  return { bankAccount };
};

test("that bank account widget displays bank logo, account name, balance and edit button", async () => {
  const { bankAccount } = renderComponent(false);

  const bankAccountCard = screen.getByTestId("bank-account");

  const bankLogo = screen.getByRole("img");

  const accountName = screen.getByText(bankAccount.accountName);

  const editAccountButton = screen.getByRole("button");

  const balance = screen.getByText(
    getAmountAsFormatedString(bankAccount.balance)
  );

  expect(bankAccountCard).toBeInTheDocument();
  expect(bankLogo).toBeInTheDocument();
  expect(bankLogo).toHaveAttribute("src", "kbc-logo.png");
  expect(accountName).toBeInTheDocument();
  expect(accountName).toHaveTextContent(bankAccount.accountName);
  expect(balance).toBeInTheDocument();
  expect(editAccountButton).toBeInTheDocument();
});

test("that the bank account card changes the background style if isSelected flag is true", async () => {
  renderComponent(true);

  // Check background color
  const bankAccountCard = screen.getByTestId("bank-account");

  // assertions
  expect(bankAccountCard).toHaveStyle("background-color: lightBlue");
});

test("that the bank account card has no background style if isSelected flag is false", async () => {
  renderComponent(false);

  // Check background color
  const bankAccountCard = screen.getByTestId("bank-account");

  // assertions
  expect(bankAccountCard).not.toHaveStyle("background-color: lightBlue");
});

it("should open an 'edit billing account popup' when edit billing account button clicked", async () => {
  const { bankAccount } = renderComponent(true);

  const expectedFormTitle = `Test Bank '${bankAccount.accountName}' account`;

  const editAccountButton = screen.getByRole("button");

  expect(screen.queryByText(expectedFormTitle)).not.toBeInTheDocument();

  fireEvent.click(editAccountButton);

  // Check that the modal is now visible
  expect(screen.getByText(expectedFormTitle)).toBeInTheDocument();
});

it("should close 'edit billing account popup' when cancel button is clicked", async () => {
  const { bankAccount } = renderComponent(false);

  const expectedFormTitle = `Test Bank '${bankAccount.accountName}' account`;

  const editAccountButton = screen.getByRole("button");

  fireEvent.click(editAccountButton);

  const formCancelButton = screen.getByRole("button", {
    name: /Cancel/i,
  });

  expect(screen.getByText(expectedFormTitle)).toBeInTheDocument();

  await user.click(formCancelButton);

  expect(screen.queryByText(expectedFormTitle)).not.toBeInTheDocument();
});

it("should call handleSelectBankAccount when user clicks on the billing account", async () => {
  const bankAccount: BankAccount = {
    id: 753,
    bankName: "Test Bank",
    accountName: "Current",
    bankLogo: "kbcLogo",
    isSelected: true,
    balance: 20450,
    active: true,
  };

  const mock = jest.fn();

  render(
    <BankAccountItem
      bankAccount={bankAccount}
      isSelected
      handleSelectBankAccount={mock}
    />
  );

  // Check background color
  const bankAccountCard = screen.getByTestId("bank-account");

  // assertions
  expect(bankAccountCard).toHaveStyle("background-color: lightBlue");

  await user.click(bankAccountCard);

  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledWith(bankAccount.id);
});

it("should display the ellipsis and the tooltip if account name is too long", async () => {
  const bankAccount: BankAccount = {
    id: 753,
    bankName: "Test Bank",
    accountName: "Looong account name",
    bankLogo: "kbcLogo",
    isSelected: true,
    balance: 20450,
    active: true,
  };

  render(
    <BankAccountItem
      bankAccount={bankAccount}
      isSelected
      handleSelectBankAccount={() => {}}
    />
  );

  const expectedAccountName = shortenGivenTextWithEllipsis(
    bankAccount.accountName
  );

  const accountName = screen.getByText(expectedAccountName.resultText);

  expect(accountName).toBeInTheDocument();

  user.hover(accountName);

  const tooltip = await screen.findByRole("tooltip");

  expect(tooltip).toBeInTheDocument();
  expect(tooltip).toHaveTextContent(bankAccount.accountName);
});
