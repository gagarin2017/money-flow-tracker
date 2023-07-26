import { Skeleton } from "antd";
import { useFetchBankAccountsQuery } from "../../store";
import BankAccount from "../../model/bank-account";
import BankAccountItem from "./bank-account-item";
import { useState } from "react";

const BankAccountList = () => {
  const { data, error, isLoading } = useFetchBankAccountsQuery();

  const [selectedBankAccountId, setSelectedBankAccountId] = useState<
    number | undefined
  >(undefined);

  const handleSelectBankAccount = (id: number) => {
    // update state
    setSelectedBankAccountId(id);

    // fetch transactions for this account
  };

  let content;

  if (isLoading) {
    content = <Skeleton loading={isLoading} />;
  } else if (error) {
    content = "Error loading bank accounts";
  } else {
    if (data) {
      const sortedAccountsByBankName = [...data].sort((a, b) =>
        a.bankName > b.bankName ? 1 : -1
      );
      content = sortedAccountsByBankName?.map((bankAccount: BankAccount) => {
        return (
          <BankAccountItem
            key={bankAccount.id}
            bankAccount={bankAccount}
            isSelected={bankAccount.id === selectedBankAccountId}
            handleSelectBankAccount={handleSelectBankAccount}
          />
        );
      });
    }
  }

  return (
    <div>
      <h3 style={{ paddingLeft: 7 }}>Bank accounts list</h3>
      {content}
    </div>
  );
};

export default BankAccountList;
