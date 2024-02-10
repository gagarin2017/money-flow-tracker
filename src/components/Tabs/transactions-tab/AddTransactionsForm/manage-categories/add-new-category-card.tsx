import { Button, Card, Checkbox, CheckboxProps, Input, Space } from "antd";
import { useField } from "formik";
import { ManagedProperty } from "../payee-cat-desc-tag-manager";
import AddTransactionsFormTransactionCategoryField from "../transaction-fields/add-transaction-form-category-field";

interface AddNewCategoryCardProps {
  subCategoryOfFieldName: string;
  fieldCategoryName: string;
  isSubcategoryFieldName: string;
  handleAddCategoryBtnClick: () => void;
}

function AddNewCategoryCard({
  fieldCategoryName,
  subCategoryOfFieldName,
  isSubcategoryFieldName,
  handleAddCategoryBtnClick: handleSaveCategoryBtnClick,
}: AddNewCategoryCardProps) {
  const [isSubcategoryField, , isSubcategoryFieldHelper] = useField(
    isSubcategoryFieldName
  );

  const [categoryName] = useField(fieldCategoryName);

  const onChange: CheckboxProps["onChange"] = (e) => {
    isSubcategoryFieldHelper.setValue(e.target.checked);
  };

  return (
    <Card title="Add new Category">
      <Space direction="vertical">
        <Input
          {...categoryName}
          placeholder={`Enter ${ManagedProperty.CATEGORY} name`}
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
          onClick={() => handleSaveCategoryBtnClick()}
        >
          Save {ManagedProperty.CATEGORY}
        </Button>
      </Space>
    </Card>
  );
}

export default AddNewCategoryCard;
