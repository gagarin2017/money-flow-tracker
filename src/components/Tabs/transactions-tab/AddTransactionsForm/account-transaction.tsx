import { Col, Row } from "antd";
import { ROW_WIDTH } from "./account-transaction-list";
import { FormTransaction } from "./add-transactions-utils";
import AddTransactionsFormAmountField from "./transaction-fields/add-transaction-form-amount-field";
import AddTransactionsFormDescriptionField from "./transaction-fields/add-transaction-form-description-field";
import AddTransactionsFormPayeeField from "./transaction-fields/add-transaction-form-payee-field";
import AddTransactionsFormTransactionCategoryField from "./transaction-fields/add-transaction-form-category-field";
import AddTransactionsFormTransactionDescriptionAndTagField from "./transaction-fields/add-transaction-form-description-tag-field";

interface AccountTransactionsToBeImportedProps {
  transaction: FormTransaction;
  accountIndex: number;
  txIndex: number;
}

function AccountTransactionToBeImported({
  accountIndex,
  txIndex,
  transaction,
}: AccountTransactionsToBeImportedProps) {
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
        <AddTransactionsFormPayeeField
          payeeFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.payee`}
          categoryFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.category`}
          tagFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.tag`}
        />
      </Col>
      <Col className="gutter-row" span={3}>
        <AddTransactionsFormDescriptionField
          fieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.description`}
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
        />
      </Col>
      <Col className="gutter-row" span={3}>
        <AddTransactionsFormAmountField
          fieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.amount`}
        />
      </Col>
      <Col className="gutter-row" span={3}>
        <div>Action buttons</div>
      </Col>
    </Row>
  );
}

export default AccountTransactionToBeImported;
