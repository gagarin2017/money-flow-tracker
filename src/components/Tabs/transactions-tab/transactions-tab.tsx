import { useEffect } from "react";
import { useBankAccountsContext } from "../../../context/bank-accounts-context";
import { useTransactionsContext } from "../../../context/transactions-context";
import TransactionsTable from "./transactions-table";
import TheSkeleton from "../../../UI/the-skeleton";
import TransactionsMenu from "./transactions-menu";
import { Col, Row, Space } from "antd";
import { ImportTransactionsProvider } from "../../../context/import-transactions-context";

function TransactionsTab() {
  const { selectedBankAccountId, fetchBankAccounts } = useBankAccountsContext();
  const {
    transactions,
    isLoading,
    fetchTransactionsByBankAccountId,
    deleteTransaction,
  } = useTransactionsContext();

  useEffect(() => {
    fetchTransactionsByBankAccountId(selectedBankAccountId);
  }, [selectedBankAccountId]);

  const handleTransactionDeletion = async (id: number) => {
    deleteTransaction(id);

    // refresh bank accounts and their balances
    await fetchBankAccounts();
  };

  return (
    <>
      <Row>
        <Col
          span={24}
          style={{ display: "flex", marginTop: 10, marginBottom: 10 }}
        >
          <ImportTransactionsProvider>
            <TransactionsMenu />
          </ImportTransactionsProvider>
        </Col>
        <Col span={24}>
          <TransactionsTable
            transactions={transactions}
            isLoading={isLoading}
            handleTransactionDeletion={handleTransactionDeletion}
          />
        </Col>
      </Row>
    </>
  );
}

export default TransactionsTab;
