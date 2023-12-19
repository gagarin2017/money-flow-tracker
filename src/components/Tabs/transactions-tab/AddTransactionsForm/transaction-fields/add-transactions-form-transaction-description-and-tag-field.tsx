import { Select } from "antd";
import { useImportTransactionsContext } from "../../../../../context/import-transactions-context";

import { useField } from "formik";
interface AddTransactionsFormTransactionDescriptionAndTagFieldProps {
  fieldName: string;
}

const AddTransactionsFormTransactionDescriptionAndTagField = ({
  fieldName,
}: AddTransactionsFormTransactionDescriptionAndTagFieldProps) => {
  const [field, , helper] = useField(fieldName);
  const { state } = useImportTransactionsContext();

  const onChange = (value: string, option: any) => {
    helper.setValue(value);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: number }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Select
      showSearch
      style={{ width: 170 }}
      placeholder="Tag"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={filterOption}
      allowClear
      options={state.tags.map((item) => ({
        label: item.name || "<empty>",
        value: item.id,
      }))}
      value={field.value?.name}
    />
  );
};

export default AddTransactionsFormTransactionDescriptionAndTagField;
