import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../../context/import-transactions-context";
import { getCategoryAsString } from "../../../../../utils/transactions-helper";
import Payee from "../model/payee";
function PayeeList() {
  const { state, dispatch } = useImportTransactionsContext();

  const columns: ColumnsType<Payee> = [
    {
      title: "Payee Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_: any, record: Payee) => {
        return getCategoryAsString(record.category);
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_: any, record: Payee) => {
        return record.description?.name;
      },
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (_: any, record: Payee) => {
        return (
          <>
            {record.tag.name && (
              <Tag color="green" key={record.tag.id}>
                {record.tag.name}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: Payee) => {
        return record.amount;
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record: Payee) => (
        <Space size="middle">
          <Popconfirm
            title="Delete this transaction?"
            onConfirm={() => handlePayeeDelete(record.id)}
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

  const handlePayeeDelete = (payeeId: number) => {
    dispatch({
      type: ImportTransactionsActionType.DELETE_PAYEE,
      payload: payeeId,
    });
  };

  return <Table columns={columns} dataSource={state.payees} />;
}

export default PayeeList;
