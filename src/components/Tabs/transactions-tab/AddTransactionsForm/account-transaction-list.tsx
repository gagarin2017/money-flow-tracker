import { Col, Row } from "antd";
import AccountTransaction from "./account-transaction";
import { FormTransaction } from "../add-transactions-utils";
import { FormikErrors, FormikTouched } from "formik";
import { NewTransactionsFormData } from "./add-transactions-form";

export const ROW_WIDTH = 1410;

const style: React.CSSProperties = {
  background: "#0092ff",
  paddingLeft: "10px",
};

const HEADER_ROW = (
  <Row
    gutter={[2, 4]}
    justify={"center"}
    style={{ width: ROW_WIDTH, fontWeight: "bold" }}
  >
    <Col className="gutter-row" span={2} key={"Date"}>
      <div style={style}>Date</div>
    </Col>
    <Col className="gutter-row" span={3} key={"Payee"}>
      <div style={style}>Payee</div>
    </Col>
    <Col className="gutter-row" span={3} key={"Description"}>
      <div style={style}>Description</div>
    </Col>
    <Col className="gutter-row" span={3} key={"Memo"}>
      <div style={style}>Memo</div>
    </Col>
    <Col className="gutter-row" span={3} key={"Category"}>
      <div style={style}>Category</div>
    </Col>
    <Col className="gutter-row" span={3} key={"Tag"}>
      <div style={style}>Tag</div>
    </Col>
    <Col className="gutter-row" span={2} key={"DebitAmount"}>
      <div style={style}>Debit</div>
    </Col>
    <Col className="gutter-row" span={2} key={"CreditAmount"}>
      <div style={style}>Credit</div>
    </Col>
    <Col className="gutter-row" span={2} key={"Action"}>
      <div style={style}>Action</div>
    </Col>
  </Row>
);

interface AccountTransactionsListProps {
  transactions: FormTransaction[];
  accountIndex: number;
  isDateEditable?: boolean;
  errors: FormikErrors<NewTransactionsFormData>;
  touched: FormikTouched<NewTransactionsFormData>;
}

function AccountTransactionsList({
  accountIndex,
  transactions,
  isDateEditable,
  errors,
  touched,
}: AccountTransactionsListProps) {
  return (
    <>
      {HEADER_ROW}
      {transactions.map((transaction, txIndex) => {
        return (
          <AccountTransaction
            key={accountIndex + txIndex}
            transaction={transaction}
            accountIndex={accountIndex}
            txIndex={txIndex}
            isDateEditable={isDateEditable}
          />
        );
      })}
    </>
  );
}

export default AccountTransactionsList;
