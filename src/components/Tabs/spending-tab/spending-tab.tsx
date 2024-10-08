import { spendingBackgroundCardStyle } from "./spending-tab-styles";
import { Card, Col, Row } from "antd";
import CurrentMonthPeriod from "../budget-tab/current-month-period";
import SpendingGraph from "./spending-graph/spending-graph";
import SpendingGraphBar from "./spending-graph/spending-graph-bar";
import SpendingGraphStackGroupColumn from "./spending-graph/spending-graph-stack-group-column";
import SpendingGraphStackedColumnChart from "./spending-graph/spending-graph-stacked-column-chart";
import { useEffect, useState } from "react";
import { Transaction } from "../../../model/transaction";
import { fetchCurrentMonthTransactionsAPI } from "../../services/transactions-api";
import {
  getStringFromDate,
  getStringFromMomentDate,
} from "../../../utils/date-helper";
import moment from "moment";
import TransactionsTable from "../transactions-tab/transactions-table";
import { isSpringBoot } from "../../services/api-common";
import { getAmountAsFormatedString } from "../../../utils/currency-helper";

function SpendingTab() {
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<
    Transaction[]
  >([]);

  const spendingTransactions = currentMonthTransactions.filter(
    (tx) => tx.debitAmount
  );

  console.log("spendingTransactions", spendingTransactions);
  const currentMonthTotal = spendingTransactions
    .map((tx) => tx.debitAmount)
    // .filter((amount) => typeof amount === "number" && !isNaN(amount))
    .reduce((total, amount) => total + amount, 0);

  console.log("currentMonthTotal", currentMonthTotal);

  useEffect(() => {
    fetchData().then((data) => setCurrentMonthTransactions(data));
  }, []);

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
    <Card style={spendingBackgroundCardStyle}>
      <Row>
        <Col span={15}>
          <h4>
            This month spending: {getAmountAsFormatedString(currentMonthTotal)}
          </h4>

          {/* <SpendingGraph /> */}
          {/* <SpendingGraphBar /> */}
          {/* <SpendingGraphStackGroupColumn /> */}
          <SpendingGraphStackedColumnChart />
        </Col>
        <Col span={9}>
          <div>This month Info</div>
          <CurrentMonthPeriod />
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <div>This month close look:</div>
        </Col>
        <Col span={16}>
          <div>This month single category breakdown</div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <TransactionsTable
            transactions={currentMonthTransactions}
            isLoading={false}
            handleTransactionDeletion={() => {}}
          />
        </Col>
      </Row>
    </Card>
  );
}

export default SpendingTab;
