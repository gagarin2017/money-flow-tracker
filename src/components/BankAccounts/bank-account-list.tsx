import { useEffect, useState } from "react";
import { useBankAccountsContext } from "../../context/bank-accounts-context";
import BankAccount from "../../model/bank-account";
import BankAccountItem from "./bank-account-item";
import { Empty } from "antd";

const BankAccountList = () => {
  const {
    bankAccounts,
    fetchBankAccounts,
    selectedBankAccountId,
    setSelectedBankAccountId,
  } = useBankAccountsContext();

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const handleSelectBankAccount = (id: number) => {
    // update state
    setSelectedBankAccountId(id);
    // fetch transactions for this account
  };

  let content;

  if (bankAccounts && bankAccounts.length > 0) {
    content = bankAccounts.map((bankAccount: BankAccount) => {
      return (
        <BankAccountItem
          key={bankAccount.id}
          bankAccount={bankAccount}
          isSelected={bankAccount.id === selectedBankAccountId}
          handleSelectBankAccount={handleSelectBankAccount}
        />
      );
    });
  } else {
    content = (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<span style={{ color: "black" }}>No accounts yet.</span>}
      />
    );
  }

  return (
    <div>
      <h3 style={{ paddingLeft: 7 }}>Bank accounts list</h3>
      {content}
    </div>
  );
};

export default BankAccountList;
