import { Button, Card, Checkbox, CheckboxProps, Space } from "antd";
import { Field, useField } from "formik";
import { ManagedProperty } from "../manage-payee-cat-desc-tag-form";
import AddTransactionsFormTransactionCategoryField from "../transaction-fields/add-transaction-form-category-field";

interface AddNewCategoryCardProps {
  subCategoryOfFieldName: string;
  name: string;
  isSubcategoryFieldName: string;
  handleAddCategoryBtnClick: () => void;
}

function AddNewCategoryCard({
  name,
  subCategoryOfFieldName,
  isSubcategoryFieldName,
  handleAddCategoryBtnClick,
}: AddNewCategoryCardProps) {
  const [isSubcategoryField, , isSubcategoryFieldHelper] = useField(
    isSubcategoryFieldName
  );

  const onChange: CheckboxProps["onChange"] = (e) => {
    // console.log(`checked = ${e.target.checked}`);
    isSubcategoryFieldHelper.setValue(e.target.checked);
  };

  return (
    <Card title="Add new Category">
      <Space direction="vertical">
        <label htmlFor={name}>{`${ManagedProperty.CATEGORY} Name`}</label>
        <Field
          id={name}
          name={name}
          placeholder={`${ManagedProperty.CATEGORY} Name`}
        />

        <Checkbox
          onChange={onChange}
          style={{ marginTop: 10, marginBottom: 10 }}
          checked={isSubcategoryField.value}
        >
          is subcategroy Of
        </Checkbox>
        <AddTransactionsFormTransactionCategoryField
          fieldName={subCategoryOfFieldName}
        />

        <Button
          size="small"
          type="primary"
          style={{ marginTop: 10, float: "right" }}
          onClick={() => handleAddCategoryBtnClick()}
        >
          Add {ManagedProperty.CATEGORY}
        </Button>
      </Space>
    </Card>
  );
}

export default AddNewCategoryCard;
