import { Col, Row } from "antd";
import { FormTransaction } from "../add-transactions-utils";
import { ROW_WIDTH } from "./account-transaction-list";
import AddTransactionsFormAmountField from "./transaction-fields/add-transaction-form-amount-field";
import AddTransactionsFormTransactionCategoryField from "./transaction-fields/add-transaction-form-category-field";
import AddTransactionsFormTransactionDescriptionAndTagField from "./transaction-fields/add-transaction-form-description-tag-field";
import AddTransactionsFormPayeeField from "./transaction-fields/add-transaction-form-payee-field";
import AddTransactionsFormTransactionMemoField from "./transaction-fields/add-transaction-form-memo-field";

interface AccountTransactionProps {
  transaction: FormTransaction;
  accountIndex: number;
  txIndex: number;
}

function AccountTransaction({
  accountIndex,
  txIndex,
  transaction,
}: AccountTransactionProps) {
  return (
    <Row
      gutter={[2, 4]}
      justify={"center"}
      key={transaction.id}
      style={{ width: ROW_WIDTH, paddingTop: 5 }}
    >
      <Col className="gutter-row" span={2}>
        {transaction.date}
      </Col>
      <Col className="gutter-row" span={3}>
        <AddTransactionsFormPayeeField
          payeeFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.payee`}
          categoryFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.category`}
          descriptionFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.description`}
          tagFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.tag`}
          amountFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.amount`}
        />
      </Col>
      <Col className="gutter-row" span={3}>
        <AddTransactionsFormTransactionDescriptionAndTagField
          fieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.description`}
          isTagField={false}
        />
      </Col>
      <Col className="gutter-row" span={3}>
        <AddTransactionsFormTransactionMemoField
          fieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.memo`}
        />
      </Col>
      <Col className="gutter-row" span={3}>
        <AddTransactionsFormTransactionCategoryField
          fieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.category`}
        />
      </Col>
      <Col className="gutter-row" span={3}>
        <AddTransactionsFormTransactionDescriptionAndTagField
          fieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.tag`}
          isTagField
        />
      </Col>
      <Col className="gutter-row" span={2}>
        <AddTransactionsFormAmountField
          fieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.amount`}
        />
      </Col>
      <Col className="gutter-row" span={2}>
        <div>Action buttons</div>
      </Col>
    </Row>
  );
}

export default AccountTransaction;
