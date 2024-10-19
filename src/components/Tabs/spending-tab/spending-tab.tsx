import { Button, Card, Col, Drawer, Row, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Transaction } from "../../../model/transaction";
import { getAmountAsFormatedString } from "../../../utils/currency-helper";
import { getStringFromMomentDate } from "../../../utils/date-helper";
import { isSpringBoot } from "../../services/api-common";
import { fetchCurrentMonthTransactionsAPI } from "../../services/transactions-api";
import CurrentMonthPeriod from "../budget-tab/current-month-period";
import SpendingGraphStackedColumnChart from "./spending-graph/spending-graph-stacked-column-chart";
import { spendingBackgroundCardStyle } from "./spending-tab-styles";
import CurrentMonthSpendingList from "./current-month-spending-list";
import { groupTransactionsByParentCategory } from "../../services/spending/spending-service";
import TransactionsTable from "./transactions-table";
import { CloseOutlined } from "@ant-design/icons";
import SingleCategoryBreakdown from "./single-category-breakdown";
import { SpendingItem } from "./model/spending-item";

function SpendingTab() {
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<
    Transaction[]
  >([]);

  const [isAllTxDrawerOpen, setAllTxDrawerOpen] = useState<boolean>(false);
  const [selectedSpendingCategoryName, setSelectedSpendingCategoryName] =
    useState<string | undefined>(undefined);

  const [spendingItemsMap, setSpendingItemsMap] = useState<
    Map<string, Transaction[]>
  >(new Map());

  const [spendingItems, setSpendingItems] = useState<SpendingItem[]>();

  const showAllTransactionsDrawer = () => {
    setAllTxDrawerOpen(true);
  };

  const onAllTransactionsDrawerCloseClose = () => {
    setAllTxDrawerOpen(false);
  };

  const handleSpendingCategoryLinkClick = (parentCateogryName: string) => {
    setSelectedSpendingCategoryName(parentCateogryName);
  };

  // Calculate the total spending for the current month
  const currentMonthTotal = currentMonthTransactions
    .filter((tx) => tx.debitAmount)
    .map((tx) => tx.debitAmount)
    .reduce((total, amount) => total + amount, 0);

  const buildSpendingItemsFromMap = (
    spendingItemsMap: Map<string, Transaction[]>
  ) => {
    return Array.from(spendingItemsMap, ([key, transactions]) => ({
      name: key,
      amount: transactions.reduce((sum, tx) => sum + tx.debitAmount, 0),
    })).sort((a, b) => b.amount - a.amount);
  };

  useEffect(() => {
    fetchData().then((data) => {
      setCurrentMonthTransactions(data);
      setSpendingItemsMap(
        groupTransactionsByParentCategory(
          data.filter((tx: Transaction) => tx.debitAmount)
        )
      );
      setSpendingItems(buildSpendingItemsFromMap(spendingItemsMap));
    });
  }, [spendingItemsMap]);

  /*
   * Fetch the transactions for the current month
   **/
  const fetchData = async () => {
    const dateFrom = getStringFromMomentDate(moment().startOf("month"));
    const dateTo = getStringFromMomentDate(moment().endOf("month"));
    const fetchedData = await fetchCurrentMonthTransactionsAPI(
      dateFrom,
      dateTo
    );

    const fetchedTransactions = isSpringBoot
      ? fetchedData._embedded.transactions
      : fetchedData;

    return fetchedTransactions;
  };

  return (
    <>
      <Card style={spendingBackgroundCardStyle}>
        <Row>
          <Col span={15}>
            <Card style={{ backgroundColor: "#d8d5d5", margin: 10 }}>
              <h4>
                This month spending:{" "}
                {getAmountAsFormatedString(currentMonthTotal)}
              </h4>

              {/* <SpendingGraph /> */}
              {/* <SpendingGraphBar /> */}
              {/* <SpendingGraphStackGroupColumn /> */}
              <SpendingGraphStackedColumnChart />
            </Card>
          </Col>

          <Col span={9}>
            <Card style={{ backgroundColor: "#d8d5d5", margin: 10 }}>
              <div>This month Info</div>
              <CurrentMonthPeriod />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={7}>
            <Card style={{ backgroundColor: "#d8d5d5", margin: 10 }}>
              <div>This month close look:</div>
              <CurrentMonthSpendingList
                data={spendingItems || []}
                handleSpendingCategoryLinkClick={
                  handleSpendingCategoryLinkClick
                }
              />
              <Button type="primary" onClick={showAllTransactionsDrawer}>
                All transactions
              </Button>
            </Card>
          </Col>
          <Col span={17}>
            <Card style={{ backgroundColor: "#d8d5d5", margin: 10 }}>
              <div>This month single category breakdown</div>
              <SingleCategoryBreakdown
                selectedCategoryName={
                  selectedSpendingCategoryName ||
                  (spendingItems && spendingItems.length > 0
                    ? spendingItems[0].name
                    : "")
                }
                spendingItemsMap={spendingItemsMap}
              />
            </Card>
          </Col>
        </Row>
      </Card>
      <Drawer
        title={
          <>
            Current month
            <Tag
              bordered={false}
              // color="processing"
              style={{ marginLeft: 3, fontSize: 14 }}
            >
              {currentMonthTransactions.length}
            </Tag>
            transactions
          </>
        }
        placement="bottom"
        closable={false}
        onClose={onAllTransactionsDrawerCloseClose}
        open={isAllTxDrawerOpen}
        height={780}
        extra={
          <Button onClick={onAllTransactionsDrawerCloseClose}>
            <CloseOutlined />
          </Button>
        }
        style={{ width: "98%", marginLeft: 15, marginRight: 15 }}
      >
        <TransactionsTable
          transactions={currentMonthTransactions}
          isLoading={false}
        />
      </Drawer>
    </>
  );
}

export default SpendingTab;
