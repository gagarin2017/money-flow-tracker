import "./spending-tab-styles.css";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import BankAccount from "../../../model/bank-account";
import { Category } from "../../../model/category";
import { Description } from "../../../model/description";
import { Tag } from "../../../model/tag";
import { Transaction } from "../../../model/transaction";
import { getCategoryAsString } from "../../../utils/category-helper";
import { getAmountAsFormatedString } from "../../../utils/currency-helper";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getStringFromDateWFormatter,
} from "../../../utils/date-helper";

// The representation of the transaction (we might not want to include all transaction fields to be displayed on the UI)
interface DataType {
  key: number;
  id: number;
  bankAccount: BankAccount;
  date: Date;
  category: Category;
  description: Description;
  memo: string;
  tag: Tag;
  reconsiled?: boolean;
  creditAmount: number;
  debitAmount: number;
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
      width: 110,
      render: (_: any, record: DataType) =>
        getStringFromDateWFormatter(record.date, DATE_FORMAT_DD_MM_YYYY),
      sorter: (a: DataType, b: DataType) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: "ascend",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 450, // Ensure this column has a fixed width
      ellipsis: true, // Enable text truncation with ellipsis
      render: (_: any, record: DataType) => {
        return getCategoryAsString(record.category);
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_: any, record: DataType) => {
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
      render: (_: any, record: DataType) => {
        return record.tag?.name || undefined;
      },
    },
    {
      title: "Reconsiled",
      dataIndex: "reconciled",
      key: "reconciled",
      width: 110,
      //   render: (_: any, { reconsiled }: Transaction) => {
      //     return (
      //       <Tag color={reconsiled ? "green" : "volcano"}>
      //         {reconsiled ? "Yes" : "No"}
      //       </Tag>
      //     );
      //   },
    },
    {
      title: "Debit",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (_: any, record: DataType) => {
        return record.debitAmount ? (
          <span style={{ color: "red" }}>
            {getAmountAsFormatedString(record.debitAmount)}
          </span>
        ) : (
          <></>
        );
      },
    },
    {
      title: "Credit",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (_: any, record: DataType) => {
        return record.creditAmount > 0 ? (
          <span style={{ color: "green" }}>
            {getAmountAsFormatedString(record.creditAmount)}
          </span>
        ) : (
          <></>
        );
      },
    },
  ];

  const data: DataType[] = transactions.map((tx) => ({ ...tx, key: tx.id }));

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={isLoading}
      pagination={false}
      scroll={{ y: 600 }} // Enable vertical scroll with a fixed height
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
