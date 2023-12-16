import { Col, Row } from "antd";
import { ErrorMessage, Field } from "formik";
import AddTransactionsFormTransactionCategoryField from "./add-transactions-form-transaction-category-field";
import { FormTransaction } from "./add-transactions-utils";

const ROW_WIDTH = 1410;

interface AccountTransactionsToBeImportedProps {
  transactions: FormTransaction[];
  accountIndex: number;
}

function AccountTransactionsToBeImported({
  accountIndex,
  transactions,
}: AccountTransactionsToBeImportedProps) {
  const style: React.CSSProperties = {
    background: "#0092ff",
    paddingLeft: "10px",
  };
  const rowStyle: React.CSSProperties = {
    padding: 0,
    width: "100%",
  };
  return (
    <>
      <Row gutter={[2, 4]} justify={"center"} style={{ width: ROW_WIDTH }}>
        <Col className="gutter-row" span={3} key={"Date"}>
          <div style={style}>Date</div>
        </Col>
        <Col className="gutter-row" span={3} key={"Payee"}>
          <div style={style}>Payee</div>
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
        <Col className="gutter-row" span={3} key={"Amount"}>
          <div style={style}>Amount</div>
        </Col>
        <Col className="gutter-row" span={3} key={"Action"}>
          <div style={style}>Action</div>
        </Col>
      </Row>
      {transactions.map((transaction, txIndex) => {
        return (
          <Row
            gutter={[2, 4]}
            justify={"center"}
            key={transaction.id}
            style={{ width: ROW_WIDTH }}
          >
            <Col className="gutter-row" span={3}>
              {transaction.date}
            </Col>
            <Col className="gutter-row" span={3}>
              <div style={rowStyle}>
                <Field
                  name={`accountTransactions.${accountIndex}.transactions.${txIndex}.payee`}
                />
                <ErrorMessage
                  name={`accountTransactions.${accountIndex}.transactions.${txIndex}.payee`}
                  component="div"
                />
              </div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div>
                <Field
                  name={`accountTransactions.${accountIndex}.transactions.${txIndex}.description`}
                />
                <ErrorMessage
                  name={`accountTransactions.${accountIndex}.transactions.${txIndex}.description`}
                  component="div"
                />
              </div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div>
                <AddTransactionsFormTransactionCategoryField
                  fieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.category`}
                />
                {/* <Field 
                  name={`accountTransactions.${accountIndex}.transactions.${txIndex}.category`}
                />
                <ErrorMessage
                  name={`accountTransactions.${accountIndex}.transactions.${txIndex}.category`}
                  component="div"
                /> */}
              </div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div>
                <Field
                  name={`accountTransactions.${accountIndex}.transactions.${txIndex}.tag`}
                />
                <ErrorMessage
                  name={`accountTransactions.${accountIndex}.transactions.${txIndex}.tag`}
                  component="div"
                />
              </div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div>
                <Field
                  name={`accountTransactions.${accountIndex}.transactions.${txIndex}.amount`}
                />
                <ErrorMessage
                  name={`accountTransactions.${accountIndex}.transactions.${txIndex}.amount`}
                  component="div"
                />
              </div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div>Action buttons</div>
            </Col>
          </Row>
        );
      })}
    </>
  );
}

export default AccountTransactionsToBeImported;
