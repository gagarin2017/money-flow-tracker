import { Col, Row } from "antd";
import { Field } from "formik";
import { ROW_WIDTH } from "./account-transactions-to-be-imported-list";
import AddTransactionsFormTransactionCategoryField from "./add-transactions-form-transaction-category-field";
import { FormTransaction } from "./add-transactions-utils";
import AddTransactionsFormDescriptionField from "./transaction-fields/add-transactions-form-description-field";
import AddTransactionsFormPayeeField from "./transaction-fields/add-transactions-form-payee-field";
import AddTransactionsFormTransactionDescriptionAndTagField from "./transaction-fields/add-transactions-form-transaction-description-and-tag-field";

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
        <Field
          name={`accountTransactions.${accountIndex}.transactions.${txIndex}.amount`}
        />
      </Col>
      <Col className="gutter-row" span={3}>
        <div>Action buttons</div>
      </Col>
    </Row>
  );
}

export default AccountTransactionToBeImported;
