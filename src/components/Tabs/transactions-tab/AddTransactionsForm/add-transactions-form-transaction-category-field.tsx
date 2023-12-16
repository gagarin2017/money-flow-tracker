import { TreeSelect } from "antd";
import { useField } from "formik";
import { useImportTransactionsContext } from "../../../../context/import-transactions-context";

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

  // const treeData = [
  //   {
  //     id: 1,
  //     value: "parent 1",
  //     name: "parent 1",
  //     subCategories: [
  //       {
  //         id: 2,
  //         value: "parent 1-0",
  //         name: "parent 1-0",
  //         subCategories: [
  //           {
  //             id: 3,
  //             name: "leaf1",
  //             title: "leaf1",
  //           },
  //           {
  //             id: 4,
  //             name: "leaf2",
  //             title: "leaf2",
  //           },
  //         ],
  //       },
  //       {
  //         id: 5,
  //         name: "parent 1-1",
  //         title: "parent 1-1",
  //         subCategories: [
  //           {
  //             id: 6,
  //             name: "leaf3",
  //             title: <b style={{ color: "#08c" }}>leaf3</b>,
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];

  // const [value, setValue] = useState<string>();

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
      value={field.value}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Please select"
      allowClear
      onChange={onChange}
      treeData={state.categories}
    />
  );
};

export default AddTransactionsFormTransactionCategoryField;
