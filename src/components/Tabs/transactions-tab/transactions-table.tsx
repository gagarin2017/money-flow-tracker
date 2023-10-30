import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useBankAccountsContext } from "../../../context/bank-accounts-context";
import { Category } from "../../../model/category";
import { Transaction } from "../../../model/transaction";
import { Description } from "../../../model/description";
import { Tag as TxTag } from "../../../model/tag";
import { getCategoryAsString } from "../../../utils/transactions-helper";
import { getAmountAsFormatedString } from "../../../utils/currency-helper";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getStringFromDateWFormatter,
} from "../../../utils/date-helper";

// The representation of the transaction (we might not want to include all transaction fields to be displayed on the UI)
interface DataType {
  key: number;
  id: number;
  date: Date;
  category: Category;
  description: Description;
  memo: string;
  tag: TxTag;
  reconsiled: boolean;
  amount: number;
  runningBalance: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

function TransactionsTable({
  transactions,
  isLoading,
}: TransactionsTableProps) {
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
        return record.description.name;
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
        return record.tag.name;
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: Transaction) => {
        return record.amount > 0 ? (
          <span style={{ color: "green" }}>
            {getAmountAsFormatedString(record.amount)}
          </span>
        ) : (
          <span style={{ color: "red" }}>
            {getAmountAsFormatedString(record.amount)}
          </span>
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
          <Button type="link">{`Edit tx id ${record.id}`}</Button>
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
    console.log("Deleting transaction", transactionId);
  };

  const data: DataType[] = transactions.map((tx) => ({ ...tx, key: tx.id }));

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={isLoading}
      pagination={{ pageSize: 9, showSizeChanger: false }}
      onRow={(record, index) => ({
        style: {
          backgroundColor:
            index !== undefined && (index === 0 || index % 2 === 0)
              ? "default"
              : "#F7FCFF",
        },
      })}
    />
  );
}

export default TransactionsTable;
