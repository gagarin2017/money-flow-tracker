import { Empty } from "antd";
import { useEffect } from "react";
import TheSkeleton from "../../UI/the-skeleton";
import { useBankAccountsContext } from "../../context/bank-accounts-context";
import BankAccount from "../../model/bank-account";
import BankAccountItem from "./bank-account-item";

const BankAccountList = () => {
  const {
    bankAccounts,
    fetchBankAccounts,
    selectedBankAccountId,
    setSelectedBankAccountId,
    isLoading,
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
    const sortedAccountsByBankName = [...bankAccounts].sort((a, b) =>
      a.bankName > b.bankName ? 1 : -1
    );
    setSelectedBankAccountId(sortedAccountsByBankName[0].id);
    content = sortedAccountsByBankName.map((bankAccount: BankAccount) => {
      return (
        <BankAccountItem
          key={bankAccount.id}
          bankAccount={bankAccount}
          isSelected={bankAccount.id === selectedBankAccountId}
          handleSelectBankAccount={handleSelectBankAccount}
        />
      );
    });
  } else if (isLoading) {
    content = <TheSkeleton width={150} />;
  } else {
    content = (
      <Empty
        style={{ fontWeight: "bolder" }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No accounts exist yet."
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
