import { useEffect, useState } from "react";
import { useBankAccountsContext } from "../../context/bank-accounts-context";
import BankAccount from "../../model/bank-account";
import BankAccountItem from "./bank-account-item";

const BankAccountList = () => {
  const { bankAccounts, fetchBankAccounts } = useBankAccountsContext();

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const [selectedBankAccountId, setSelectedBankAccountId] = useState<
    number | undefined
  >(undefined);

  const handleSelectBankAccount = (id: number) => {
    // update state
    setSelectedBankAccountId(id);
    // fetch transactions for this account
  };

  let content;

  if (bankAccounts) {
    const sortedAccountsByBankName = [...bankAccounts].sort((a, b) =>
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

  return (
    <div>
      <h3 style={{ paddingLeft: 7 }}>Bank accounts list</h3>
      {content}
    </div>
  );
};

export default BankAccountList;
