import BankAccount from "../model/bank-account";

export const sortBankAccountsByBankName = (data: BankAccount[]) => {
  const sortedAccountsByBankName = [...data].sort((a, b) =>
    a.bankName > b.bankName ? 1 : -1
  );

  return sortedAccountsByBankName;
};
