import { TreeSelect } from "antd";
import { useField } from "formik";
import { useImportTransactionsContext } from "../../../../../context/import-transactions-context";

interface AddTransactionsFormTransactionCategoryFieldProps {
  fieldName: string;
}
/*
 ** The Category field for Add transaction form
 */
const AddTransactionsFormTransactionCategoryField = ({
  fieldName,
}: AddTransactionsFormTransactionCategoryFieldProps) => {
  const { state } = useImportTransactionsContext();

  const [field, , helper] = useField(fieldName);

  const onChange = (newValue: string) => {
    helper.setValue(newValue);
  };

  return (
    <TreeSelect
      fieldNames={{
        value: "id",
        label: "name",
        children: "subCategories",
      }}
      treeLine={{ showLeafIcon: false }}
      treeNodeFilterProp={"name"}
      filterTreeNode
      showSearch
      style={{ width: "100%" }}
      value={field.value?.name}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Category"
      allowClear
      onChange={onChange}
      treeData={state.categories}
    />
  );
};

export default AddTransactionsFormTransactionCategoryField;
