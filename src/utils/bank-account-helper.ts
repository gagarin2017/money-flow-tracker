import { DefaultOptionType } from "antd/es/select";
import BankAccount from "../model/bank-account";

export const sortBankAccountsByBankName = (data: BankAccount[]) => {
  const sortedAccountsByBankName = [...data].sort((a, b) =>
    a.bankName > b.bankName ? 1 : -1
  );

  return sortedAccountsByBankName;
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
