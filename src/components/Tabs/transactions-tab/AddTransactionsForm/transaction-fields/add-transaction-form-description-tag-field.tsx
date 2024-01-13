import { Select } from "antd";
import { useImportTransactionsContext } from "../../../../../context/import-transactions-context";

import { useField } from "formik";
interface AddTransactionsFormTransactionDescriptionAndTagFieldProps {
  fieldName: string;
  isTagField: boolean;
}

const AddTransactionsFormTransactionDescriptionAndTagField = ({
  fieldName,
  isTagField,
}: AddTransactionsFormTransactionDescriptionAndTagFieldProps) => {
  const [field, , helper] = useField(fieldName);

  const { state } = useImportTransactionsContext();

  const { descriptions, tags } = state;

  const onChange = (value: number, option: any) => {
    if (isTagField) {
      const selectedTag = tags.find((tag) => tag.id === value);
      helper.setValue(selectedTag);
    } else {
      const selectedDescription = descriptions.find(
        (desc) => desc.id === value
      );
      helper.setValue(selectedDescription);
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: number }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  let options: any = [];
  let placeHolder = "";

  if (isTagField) {
    placeHolder = "Tag";
    options = tags.map((item) => ({
      label: item.name || "<empty>",
      value: item.id,
    }));
  } else {
    placeHolder = "Description";
    options = descriptions.map((item) => ({
      label: item.name || "<empty>",
      value: item.id,
    }));
  }

  return (
    <Select
      showSearch
      style={{ width: 170 }}
      placeholder={placeHolder}
      optionFilterProp="children"
      onChange={onChange}
      filterOption={filterOption}
      allowClear
      options={options}
      value={field.value?.name}
    />
  );
};

export default AddTransactionsFormTransactionDescriptionAndTagField;
