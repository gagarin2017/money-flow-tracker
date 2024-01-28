import { DefaultOptionType } from "antd/es/select";
import BankAccount from "../model/bank-account";

export const sortBankAccountsByBankNameAccName = (data: BankAccount[]) => {
  const compare = (a: BankAccount, b: BankAccount) => {
    // compare by bank name first
    const bankNameComparison = a.bankName.localeCompare(b.bankName);

    // if bank is the same, compare account names
    return bankNameComparison === 0
      ? a.accountName.localeCompare(b.accountName)
      : bankNameComparison;
  };

  return [...data].sort(compare);
};

export const sortSelectOptions = (data: DefaultOptionType[]) => {
  const sorted = [...data].sort((a, b) => {
    if (a.label && b.label) {
      return a.label > b.label ? 1 : -1;
    }

    return 0;
  });

  return sorted;
};
