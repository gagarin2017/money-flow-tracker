import { Select, Space } from "antd";
import { useField } from "formik";
import { useImportTransactionsContext } from "../../../../../context/import-transactions-context";

interface AddTransactionsFormPayeeFieldProps {
  payeeFieldName: string;
  categoryFieldName: string;
  descriptionFieldName: string;
  tagFieldName: string;
  amountFieldName: string;
}

function AddTransactionsFormPayeeField({
  payeeFieldName,
  categoryFieldName,
  descriptionFieldName,
  tagFieldName,
  amountFieldName,
}: AddTransactionsFormPayeeFieldProps) {
  const { state } = useImportTransactionsContext();

  const { payees } = state;

  const [payeeField, , payeeHelper] = useField(payeeFieldName);
  const [, , categoryHelper] = useField(categoryFieldName);
  const [, , descriptionyHelper] = useField(descriptionFieldName);
  const [, , tagHelper] = useField(tagFieldName);
  const [, , amountHelper] = useField(amountFieldName);

  const onClear = () => {
    categoryHelper.setValue(undefined);
    descriptionyHelper.setValue(undefined);
    tagHelper.setValue(undefined);
    amountHelper.setValue(undefined);
    payeeHelper.setTouched(true);
  };

  const onChange = (value: number) => {
    const selectedPayee = payees.find((payee) => payee.id === value);
    payeeHelper.setValue(selectedPayee);

    if (selectedPayee) {
      categoryHelper.setValue(selectedPayee?.category);
      descriptionyHelper.setValue(selectedPayee?.description);
      tagHelper.setValue(selectedPayee?.tag);
      amountHelper.setValue(selectedPayee?.amount);
      payeeHelper.setTouched(true);
    } else {
      categoryHelper.setValue(undefined);
      descriptionyHelper.setValue(undefined);
      tagHelper.setValue(undefined);
      amountHelper.setValue(undefined);
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: number }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Space direction="vertical">
      <Select
        showSearch
        style={{ width: 170 }}
        placeholder="Payee"
        optionFilterProp="children"
        onChange={onChange}
        filterOption={filterOption}
        onClear={onClear}
        allowClear
        options={payees.map((item) => ({
          label: item.name || "<empty>",
          value: item.id,
        }))}
        value={payeeField.value?.name}
      />
    </Space>
  );
}

export default AddTransactionsFormPayeeField;
