import { useEffect } from "react";
import { useBankAccountsContext } from "../../../context/bank-accounts-context";
import { useTransactionsContext } from "../../../context/transactions-context";
import TransactionsTable from "./transactions-table";
import TheSkeleton from "../../../UI/the-skeleton";

function TransactionsTab() {
  const { selectedBankAccountId } = useBankAccountsContext();
  const { transactions, isLoading, fetchTransactionsByBankAccountId } =
    useTransactionsContext();

  useEffect(() => {
    fetchTransactionsByBankAccountId(selectedBankAccountId);
  }, [selectedBankAccountId]);

  return (
    <TransactionsTable transactions={transactions} isLoading={isLoading} />
  );
}

export default TransactionsTab;
