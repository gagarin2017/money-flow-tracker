import { Col, Row } from "antd";
import { FormTransaction } from "../add-transactions-utils";
import AddTransactionsFormAmountField from "./transaction-fields/add-transaction-form-amount-field";
import AddTransactionsFormTransactionCategoryField from "./transaction-fields/add-transaction-form-category-field";
import AddTransactionFormDateField from "./transaction-fields/add-transaction-form-date-field";
import AddTransactionsFormTransactionDescriptionAndTagField from "./transaction-fields/add-transaction-form-description-tag-field";
import AddTransactionsFormTransactionMemoField from "./transaction-fields/add-transaction-form-memo-field";
import AddTransactionsFormPayeeField from "./transaction-fields/add-transaction-form-payee-field";
import { ROW_WIDTH } from "../transactions-utils";
import ErrorMessage from "./transaction-fields/error-message";

interface AccountTransactionProps {
  transaction: FormTransaction;
  accountIndex: number;
  txIndex: number;
  isDateEditable?: boolean;
  dateField: string;
  payeeFieldName: string;
  categoryFieldName: string;
  descriptionFieldName: string;
  tagFieldName: string;
  debitAmountFieldName: string;
  creditAmountFieldName: string;
  memoFieldName: string;
}

function AccountTransaction({
  accountIndex,
  txIndex,
  transaction,
  isDateEditable,
  dateField,
  payeeFieldName,
  categoryFieldName,
  descriptionFieldName,
  tagFieldName,
  debitAmountFieldName,
  creditAmountFieldName,
  memoFieldName,
}: AccountTransactionProps) {
  return (
    <Row
      gutter={[2, 4]}
      justify={"center"}
      key={transaction.id}
      style={{ width: ROW_WIDTH, paddingTop: 5 }}
    >
      <Col className="gutter-row" span={2} key={`Date`}>
        {isDateEditable ? (
          <AddTransactionFormDateField fieldName={dateField} />
        ) : (
          transaction.date
        )}
      </Col>
      <Col className="gutter-row" span={3} key={`Payee`}>
        <AddTransactionsFormPayeeField
          payeeFieldName={payeeFieldName}
          categoryFieldName={categoryFieldName}
          descriptionFieldName={descriptionFieldName}
          tagFieldName={tagFieldName}
          debitAmountFieldName={debitAmountFieldName}
          creditAmountFieldName={creditAmountFieldName}
        />
      </Col>
      <Col className="gutter-row" span={3} key={`Description`}>
        <AddTransactionsFormTransactionDescriptionAndTagField
          fieldName={descriptionFieldName}
          isTagField={false}
        />
      </Col>
      <Col className="gutter-row" span={3} key={`Memo`}>
        <AddTransactionsFormTransactionMemoField fieldName={memoFieldName} />
      </Col>
      <Col className="gutter-row" span={3} key={`Category`}>
        <AddTransactionsFormTransactionCategoryField
          fieldName={categoryFieldName}
        />
        <ErrorMessage
          key={`${transaction.id}categoryError - ${txIndex} - ${Math.random()}`}
          name={categoryFieldName}
        />
      </Col>
      <Col className="gutter-row" span={3} key={`Tag`}>
        <AddTransactionsFormTransactionDescriptionAndTagField
          fieldName={tagFieldName}
          isTagField
        />
      </Col>
      <Col className="gutter-row" span={2} key={`DebitAmount`}>
        <AddTransactionsFormAmountField fieldName={debitAmountFieldName} />
        <ErrorMessage
          key={`${transaction.id}debitAmount${Math.random()}`}
          name={debitAmountFieldName}
        />
      </Col>
      <Col className="gutter-row" span={2} key={`CreditAmount`}>
        <AddTransactionsFormAmountField fieldName={creditAmountFieldName} />
        <ErrorMessage
          key={`${transaction.id}creditAmount${Math.random()}`}
          name={creditAmountFieldName}
        />
      </Col>
      <Col className="gutter-row" span={2}>
        <div>Action buttons</div>
      </Col>
    </Row>
  );
}

export default AccountTransaction;
