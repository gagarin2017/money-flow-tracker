import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { bankLogoMap } from "../../UI/logo-map";
import BankAccount from "../../model/bank-account";
import { getAmountAsFormatedString } from "../../utils/currency-helper";
import {
  MockBankAccountProvider,
  getValueToShare,
  setMatchMedia,
} from "../test-helper";
import EditBankAccountForm from "./form/edit-bank-account-form";

setMatchMedia();

const mockedFetchAccountsFunction = jest.fn();
const mockedEditAccountFunction = jest.fn();

const contextValueWithoutAccounts = getValueToShare(
  [],
  false,
  mockedFetchAccountsFunction,
  mockedEditAccountFunction
);

const mockedHandleFormClose = jest.fn();

const renderComponent = () => {
  const bankAccount: BankAccount = {
    id: 1,
    bankName: "Test Bank",
    accountName: "Current",
    bankLogo: "kbcLogo",
    isSelected: true,
    balance: 20450,
    active: true,
  };

  render(
    <MockBankAccountProvider valueToShare={contextValueWithoutAccounts}>
      <EditBankAccountForm
        bankAccount={bankAccount}
        isVisible={true}
        handleFormClose={mockedHandleFormClose}
      />
    </MockBankAccountProvider>
  );

  return { bankAccount };
};

it("should should have the correct title, account name input field, bank logo selection dropdown, balance, Ok and Cancel buttons", async () => {
  const { bankAccount } = renderComponent();

  const expectedFormTitle = `Test Bank '${bankAccount.accountName}' account`;

  // Check that the modal is now visible
  expect(screen.getByText(expectedFormTitle)).toBeInTheDocument();

  const okButton = screen.getByText("Ok");
  const cancelButton = screen.getByText("Cancel");

  expect(okButton).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();

  const accountNameField = screen.getByRole("textbox");

  expect(accountNameField).toBeInTheDocument();

  const bankLogo = screen.getByRole("img");

  expect(bankLogo).toHaveAttribute(
    "src",
    bankLogoMap.get(bankAccount.bankLogo)?.img
  );

  const bankLogoDropdown: HTMLElement = screen.getByRole("combobox");

  expect(bankLogoDropdown).toBeInTheDocument();

  const balance = screen.getByText(
    `Account Balance: ${getAmountAsFormatedString(bankAccount.balance)}`
  );
  expect(balance).toBeInTheDocument();
});

it("should change the logo image as per bank account selected in the dropdown", async () => {
  const { bankAccount } = renderComponent();

  const ebsBankLogo = bankLogoMap.get("ebsLogo");

  const bankLogo = screen.getByRole("img");

  expect(bankLogo).toHaveAttribute(
    "src",
    bankLogoMap.get(bankAccount.bankLogo)?.img
  );

  const bankLogoDropdown: HTMLElement = screen.getByRole("combobox");

  expect(bankLogoDropdown).toBeInTheDocument();

  fireEvent.mouseDown(bankLogoDropdown);

  if (ebsBankLogo) {
    fireEvent.click(screen.getByText(ebsBankLogo.desc));
  }

  expect(bankLogo).not.toHaveAttribute(
    "src",
    bankLogoMap.get(bankAccount.bankLogo)?.img
  );

  expect(bankLogo).toHaveAttribute("src", ebsBankLogo?.img);
});

it("should call handleClose when Ok button is clicked", async () => {
  renderComponent();

  const formOkButton = screen.getByRole("button", {
    name: "Ok",
  });

  await user.click(formOkButton);

  await waitFor(() => expect(mockedHandleFormClose).toHaveBeenCalledTimes(1));
});

it("should try to save the updated account when form is submitted", async () => {
  renderComponent();
  const accountNameField = screen.getByRole("textbox");

  expect(accountNameField).toBeInTheDocument();

  const newAccountName: string = "some new account";

  // Update account name
  fireEvent.change(accountNameField, { target: { value: newAccountName } });

  const formOkButton = screen.getByRole("button", {
    name: "Ok",
  });

  await user.click(formOkButton);

  const expectedAccountToBeSaved: BankAccount = {
    id: 1,
    bankName: "Test Bank",
    accountName: newAccountName,
    bankLogo: "kbcLogo",
    isSelected: true,
    balance: 20450,
    active: true,
  };

  await waitFor(() =>
    expect(mockedEditAccountFunction).toHaveBeenCalledWith(
      expectedAccountToBeSaved
    )
  );
});
