import { useEffect } from "react";
import { useBankAccountsContext } from "../../../context/bank-accounts-context";
import { useTransactionsContext } from "../../../context/transactions-context";
import TransactionsTable from "./transactions-table";
import TheSkeleton from "../../../UI/the-skeleton";
import TransactionsMenu from "./transactions-menu";
import { Col, Row, Space } from "antd";

function TransactionsTab() {
  const { selectedBankAccountId } = useBankAccountsContext();
  const { transactions, isLoading, fetchTransactionsByBankAccountId } =
    useTransactionsContext();

  useEffect(() => {
    fetchTransactionsByBankAccountId(selectedBankAccountId);
  }, [selectedBankAccountId]);

  return (
    <>
      <Row>
        <Col
          span={24}
          style={{ display: "flex", marginTop: 10, marginBottom: 10 }}
        >
          <TransactionsMenu />
        </Col>
        <Col span={24}>
          <TransactionsTable
            transactions={transactions}
            isLoading={isLoading}
          />
        </Col>
      </Row>
    </>
  );
}

export default TransactionsTab;
