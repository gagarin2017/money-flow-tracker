import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useBankAccountsContext } from "../../../context/bank-accounts-context";
import { Category } from "../../../model/category";
import { Transaction } from "../../../model/transaction";

// The representation of the transaction (we might not want to include all transaction fields to be displayed on the UI)
interface DataType {
  key: number;
  id: number;
  date: string;
  payee: string;
  memo: string;
  //   category: Category;
  categoryName: string;
  //   description: string;
  //   descriptionName: string;
  //   memo: string;
  tag: string;
  //   balance: number;
  //   type: string;
  //   reconciled: boolean;
  amount: number;
  runningBalance: number;
  //   name: string;
  //   age: number;
  //   address: string;
  //   tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 10,
  },
  {
    title: "Payee",
    dataIndex: "payee",
    key: "payee",
  },
  {
    title: "Memo",
    dataIndex: "memo",
    key: "memo",
  },
  {
    title: "Category",
    dataIndex: "categoryName",
    key: "categoryName",
  },
  {
    title: "Tag",
    dataIndex: "tag",
    key: "tag",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "a/c balance",
    dataIndex: "runningBalance",
    key: "runningBalance",
  },
  //   {
  //     title: "Tags",
  //     key: "tags",
  //     dataIndex: "tags",
  //     render: (_, { tags }) => (
  //       <>
  //         {tags.map((tag) => {
  //           let color = tag.length > 5 ? "geekblue" : "green";
  //           if (tag === "loser") {
  //             color = "volcano";
  //           }
  //           return (
  //             <Tag color={color} key={tag}>
  //               {tag.toUpperCase()}
  //             </Tag>
  //           );
  //         })}
  //       </>
  //     ),
  //   },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.id}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

interface TransactionsTableProps {
  transactions: Transaction[];
}

function TransactionsTable({ transactions }: TransactionsTableProps) {
  const data: DataType[] = transactions.map((tx) => {
    return {
      key: tx.id,
      id: tx.id,
      date: "29/08/2023",
      payee: "payeeName",
      memo: "",
      categoryName: "Groceries",
      tag: "",
      amount: tx.amount,
      runningBalance: tx.runningBalance,
    } as DataType;
  });

  // const data: DataType[] = [
  //   {
  //     key: 1,
  //     id: 1,
  //     date: "29/08/2023",
  //     payee: "payeeName",
  //     memo: "",
  //     categoryName: "Groceries",
  //     tag: "",
  //     amount: 23.5,
  //     runningBalance: 10255.11,
  //   },
  //   {
  //     key: 2,
  //     id: 2,
  //     date: "29/08/2023",
  //     payee: "payeeName",
  //     memo: "",
  //     categoryName: "Groceries",
  //     tag: "",
  //     amount: 23.5,
  //     runningBalance: 10255.11,
  //   },
  //   {
  //     key: 3,
  //     id: 3,
  //     date: "29/08/2023",
  //     payee: "payeeName",
  //     memo: "",
  //     categoryName: "Groceries",
  //     tag: "",
  //     amount: 23.5,
  //     runningBalance: 10255.11,
  //   },
  // ];

  return <Table columns={columns} dataSource={data} />;
}

export default TransactionsTable;
