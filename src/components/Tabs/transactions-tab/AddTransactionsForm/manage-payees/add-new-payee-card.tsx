import { Button, Card, Col, Row, Space } from "antd";
import { Field } from "formik";
import AddTransactionsFormAmountField from "../transaction-fields/add-transaction-form-amount-field";
import AddTransactionsFormTransactionCategoryField from "../transaction-fields/add-transaction-form-category-field";
import AddTransactionsFormTransactionDescriptionAndTagField from "../transaction-fields/add-transaction-form-description-tag-field";

interface AddNewPayeeCardProps {
  fieldPayeeName: string;
  fieldCategory: string;
  fieldDescription: string;
  fieldTag: string;
  fieldAmount: string;
  handleAddPayeeBtnClick: () => void;
}

function AddNewPayeeCard({
  fieldPayeeName,
  fieldCategory,
  fieldDescription,
  fieldTag,
  fieldAmount,
  handleAddPayeeBtnClick,
}: AddNewPayeeCardProps) {
  return (
    <Card title="Add new Payee">
      <Space direction="vertical">
        <label htmlFor={fieldPayeeName}>Payee Name</label>
        <Field
          id={fieldPayeeName}
          name={fieldPayeeName}
          placeholder="Payee's Name"
        />

        <label htmlFor={fieldCategory}>Category</label>
        <AddTransactionsFormTransactionCategoryField
          fieldName={fieldCategory}
        />

        <label htmlFor={fieldDescription}>Description</label>
        <AddTransactionsFormTransactionDescriptionAndTagField
          fieldName={fieldDescription}
          isTagField={false}
        />

        <label htmlFor={fieldTag}>Tag</label>
        <AddTransactionsFormTransactionDescriptionAndTagField
          fieldName={fieldTag}
          isTagField
        />

        <label htmlFor={fieldAmount}>Amount</label>
        <AddTransactionsFormAmountField fieldName={fieldAmount} />
        <Button
          size="small"
          type="primary"
          style={{ marginTop: 10, float: "right" }}
          onClick={() => handleAddPayeeBtnClick()}
        >
          Add Payee
        </Button>
      </Space>
    </Card>
  );
}

export default AddNewPayeeCard;
