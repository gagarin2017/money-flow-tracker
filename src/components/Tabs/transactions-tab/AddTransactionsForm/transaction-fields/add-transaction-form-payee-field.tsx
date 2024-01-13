import { Select } from "antd";
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

  const onChange = (value: number) => {
    payeeHelper.setValue(value);

    const selectedPayee = payees.find((payee) => payee.id === value);

    if (value) {
      categoryHelper.setValue(selectedPayee?.category);
      descriptionyHelper.setValue(selectedPayee?.description);
      tagHelper.setValue(selectedPayee?.tag);
      amountHelper.setValue(selectedPayee?.amount);
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
    <Select
      showSearch
      style={{ width: 170 }}
      placeholder="Payee"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={filterOption}
      allowClear
      options={payees.map((item) => ({
        label: item.name || "<empty>",
        value: item.id,
      }))}
      value={payeeField.value?.name}
    />
  );
}

export default AddTransactionsFormPayeeField;
