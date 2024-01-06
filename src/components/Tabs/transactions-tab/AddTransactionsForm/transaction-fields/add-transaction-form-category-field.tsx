import { TreeSelect } from "antd";
import { useField } from "formik";
import { useImportTransactionsContext } from "../../../../../context/import-transactions-context";
import { findCategoryById } from "../../../../../utils/category-helper";

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

  const { categories } = state;

  const [field, , helper] = useField(fieldName);

  const onChange = (id: number) => {
    const category = findCategoryById(categories, id);
    helper.setValue(category);
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
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Category"
      allowClear
      onChange={onChange}
      treeData={categories}
      value={field.value?.name}
    />
  );
};

export default AddTransactionsFormTransactionCategoryField;
