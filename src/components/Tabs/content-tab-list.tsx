import { Tabs, ConfigProvider } from "antd";
import type { TabsProps } from "antd";
import TransactionsTab from "./transactions-tab/transactions-tab";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Transactions",
    children: <TransactionsTab />,
  },
  {
    key: "2",
    label: "Spending",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Budget",
    children: "Content of Tab Pane 3",
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
