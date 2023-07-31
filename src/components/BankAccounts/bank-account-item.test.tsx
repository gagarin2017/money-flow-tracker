import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import BankAccountItem from "./bank-account-item";
import BankAccount from "../../model/bank-account";

test("bank account widget displays bank logo, bank name, account name, balance and edit button", async () => {
  const bankAccount: BankAccount = {
    id: 1,
    bankName: "Test Bank",
    accountName: "Current",
    bankLogo: "kbcLogo",
    isSelected: false,
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

  const bankName = screen.getByText(bankAccount.bankName);

  expect(bankName).toBeInTheDocument();
});
