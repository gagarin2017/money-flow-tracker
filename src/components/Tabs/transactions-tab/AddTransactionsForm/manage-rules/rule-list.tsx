import { Button, Popconfirm, Space, Table, TableProps, Tooltip } from "antd";
import { useImportTransactionsContext } from "../../../../../context/import-transactions-context";
import { InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { ImportTransactionsActionType } from "../../../../../context/import-transactions-context-helpers/constants";
import { useEffect, useState } from "react";
import { useRules } from "../../../../hooks/useRules";
import Rule from "../model/rule";

/**
 * The list of Rules
 */
function RuleList() {
  const { state, dispatch } = useImportTransactionsContext();

  const { deleteRule } = useRules();

  const { rules, isLoading } = state;

  // useEffect(() => {
  //   refetch();
  // }, [refetch]);

  const columns: TableProps<Rule>["columns"] = [
    {
      title: "Rule's Name",
      dataIndex: "name",
      key: "rulesName",
    },
    {
      title: "Payee's Name",
      dataIndex: "payee",
      key: "rulesPayee",
      render: (_, record: Rule) => {
        return record.payee?.name;
      },
    },
    {
      title: (
        <span>
          Matching String
          <Tooltip title="The string Imported Transactions are found by">
            <InfoCircleOutlined style={{ marginLeft: 5, color: "#1890ff" }} />
          </Tooltip>
        </span>
      ),
      dataIndex: "matchingString",
      key: "matchingString",
      render: (_, record: Rule) => {
        return `"${record.matchingString}"`;
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record: Rule) => (
        <Space size="middle">
          <Popconfirm
            title="Delete this payee?"
            onConfirm={() => handleRuleDelete(record.id)}
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

  const handleRuleDelete = (ruleId: number) => {
    dispatch({
      type: ImportTransactionsActionType.DELETE_RULE,
      payload: ruleId,
    });

    deleteRule(ruleId);
  };

  console.log("Fetched rules: ", rules);

  return (
    <Table<Rule>
      columns={columns}
      loading={isLoading}
      dataSource={rules}
      rowKey="id"
    />
  );
}

export default RuleList;
