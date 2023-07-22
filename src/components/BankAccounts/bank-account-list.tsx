import { Skeleton } from "antd";
import { useFetchBankAccountsQuery } from "../../store";
import BankAccount from "../../model/bank-account";
import BankAccountItem from "./bank-account-item";
import { useState } from "react";

// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { BankAccount } from "../../model/bank-account";
// import { RootState } from "../../store/money-flow-tracker-store";
// import {
//   bankAccountsActions,
//   fetchActiveBankAccounts,
// } from "../../store/slices/bank-accounts-slice";
// import { fetchTransactionComponents } from "../../store/slices/transaction-components-slice";
// import BankAccountItem from "./bank-account-item";
// import classes from "./bank-account-list.module.css";

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
    content = data?.map((bankAccount: BankAccount) => {
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

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetchActiveBankAccounts());
  //   dispatch(fetchTransactionComponents());
  // }, [dispatch]);

  // const bankAccounts = useSelector(
  //   (state: RootState) => state.bankAccounts.activeBankAccounts
  // );

  // if (bankAccounts.length > 0) {
  //   dispatch(bankAccountsActions.selectBankAccount(bankAccounts[0].id));
  // }

  return (
    <div>
      <h3 style={{ paddingLeft: 7 }}>Bank accounts list</h3>
      {content}
    </div>
    // <ul className={classes["bank-account-list"]}>
    //   {bankAccounts.map((acc: BankAccount) => (
    //     <BankAccountItem key={acc.id} bankAccount={acc} />
    //   ))}
    // </ul>
  );
};

export default BankAccountList;
