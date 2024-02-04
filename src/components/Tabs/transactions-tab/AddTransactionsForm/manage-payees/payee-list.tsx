import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../../context/import-transactions-context";
import { getCategoryAsString } from "../../../../../utils/transactions-helper";
import Payee from "../model/payee";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { getAmountAsFormatedString } from "../../../../../utils/currency-helper";

function PayeeList() {
  const { state, dispatch } = useImportTransactionsContext();

  const { payees } = state;

  const sortedPayeesByName =
    payees && payees.length > 0
      ? [...payees].sort((a, b) => (a.name > b.name ? 1 : -1))
      : [];

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
        return record.amount && getAmountAsFormatedString(record.amount);
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record: Payee) => (
        <Space size="middle">
          <Popconfirm
            title="Delete this payee?"
            onConfirm={() => handlePayeeDelete(record.id)}
            onCancel={() => {}}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
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

  return <Table columns={columns} dataSource={sortedPayeesByName} />;
}

export default PayeeList;
