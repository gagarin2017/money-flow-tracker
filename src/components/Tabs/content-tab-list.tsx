import { Tabs, ConfigProvider } from "antd";
import type { TabsProps } from "antd";
import TransactionsTab from "./transactions-tab/transactions-tab";
import SummaryTab from "./summary-tab/summary-tab";
import BudgetTab from "./budget-tab/budget-tab";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "2",
    label: "Summary",
    children: <SummaryTab />,
  },
  {
    key: "1",
    label: "Transactions",
    children: <TransactionsTab />,
  },
  {
    key: "3",
    label: "Spending",
    children: "Content of Tab Pane 2",
  },
  {
    key: "4",
    label: "Budget",
    children: <BudgetTab />,
  },
  {
    key: "5",
    label: "Loan calculator",
    children: <BudgetTab />,
  },
];

function ContentTabList() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            // colorText: "white",

            itemSelectedColor: "white",
            colorPrimary: "#073b5f",
            itemHoverColor: "white",
            // horizontalItemPadding: "",
            // horizontalItemMargin: "",
            algorithm: true,
            lineWidth: 0,
            margin: 0,
          },
        },
      }}
    >
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </ConfigProvider>
  );
}

export default ContentTabList;
