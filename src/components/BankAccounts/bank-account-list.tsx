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
    <div>Bank accounts list</div>
    // <ul className={classes["bank-account-list"]}>
    //   {bankAccounts.map((acc: BankAccount) => (
    //     <BankAccountItem key={acc.id} bankAccount={acc} />
    //   ))}
    // </ul>
  );
};

export default BankAccountList;
