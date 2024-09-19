import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Category } from "../../../model/category";
import { Description } from "../../../model/description";
import { Tag as TxTag } from "../../../model/tag";
import { Transaction } from "../../../model/transaction";
import { getAmountAsFormatedString } from "../../../utils/currency-helper";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getStringFromDateWFormatter,
} from "../../../utils/date-helper";
import { getCategoryAsString } from "../../../utils/transactions-helper";
import BankAccount from "../../../model/bank-account";
import { useEffect, useState } from "react";

// The representation of the transaction (we might not want to include all transaction fields to be displayed on the UI)
interface DataType {
  key: number;
  id: number;
  bankAccount: BankAccount;
  date: Date;
  category: Category;
  description: Description;
  memo: string;
  tag: TxTag;
  reconsiled?: boolean;
  amount: number;
  creditAmount: number;
  debitAmount: number;
  runningBalance: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  handleTransactionDeletion: (id: number) => void;
}

function TransactionsTable({
  transactions,
  isLoading,
  handleTransactionDeletion,
}: TransactionsTableProps) {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    pageSize: 9,
    showSizeChanger: false,
    current: 1,
  });

  useEffect(() => {
    // Reset pagination to the first page when data changes
    setPagination({ ...pagination, current: 1 });
  }, [transactions]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (_: any, record: Transaction) =>
        getStringFromDateWFormatter(record.date, DATE_FORMAT_DD_MM_YYYY),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_: any, record: Transaction) => {
        return getCategoryAsString(record.category);
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_: any, record: Transaction) => {
        return record.description?.name || undefined;
      },
    },
    {
      title: "Memo",
      dataIndex: "memo",
      key: "memo",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (_: any, record: Transaction) => {
        return record.tag?.name || undefined;
      },
    },
    {
      title: "Reconsiled",
      dataIndex: "reconciled",
      key: "reconciled",
      render: (_: any, { reconsiled }: Transaction) => {
        return (
          <Tag color={reconsiled ? "green" : "volcano"}>
            {reconsiled ? "Yes" : "No"}
          </Tag>
        );
      },
    },
    {
      title: "Credit",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: Transaction) => {
        return record.creditAmount > 0 ? (
          <span style={{ color: "green" }}>
            {getAmountAsFormatedString(record.creditAmount)}
          </span>
        ) : (
          <></>
        );
      },
    },
    {
      title: "Debit",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: Transaction) => {
        return record.debitAmount < 0 ? (
          <span style={{ color: "red" }}>
            {getAmountAsFormatedString(record.debitAmount)}
          </span>
        ) : (
          <></>
        );
      },
    },
    {
      title: "Balance",
      dataIndex: "runningBalance",
      key: "runningBalance",
      render: (_: any, record: Transaction) => {
        return record.runningBalance < 0 ? (
          <span style={{ color: "red" }}>
            {getAmountAsFormatedString(record.runningBalance)}
          </span>
        ) : (
          <span>{getAmountAsFormatedString(record.runningBalance)}</span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Transaction) => (
        <Space size="middle">
          <Popconfirm
            title="Delete this transaction?"
            onConfirm={() => handleTransactionDelete(record.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTransactionDelete = (transactionId: number) => {
    handleTransactionDeletion(transactionId);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const data: DataType[] = transactions.map((tx) => ({ ...tx, key: tx.id }));

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={isLoading}
      pagination={pagination}
      onRow={(record, index) => ({
        style: {
          backgroundColor:
            index !== undefined && (index === 0 || index % 2 === 0)
              ? "default"
              : "#F7FCFF",
        },
      })}
      onChange={handleTableChange}
    />
  );
}

export default TransactionsTable;
