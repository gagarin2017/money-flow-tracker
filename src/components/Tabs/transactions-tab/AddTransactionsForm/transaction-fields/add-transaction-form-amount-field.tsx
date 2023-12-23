import { Input, InputNumber } from "antd";
import { useField } from "formik";
import { useState } from "react";

interface AddTransactionsFormAmountFieldProps {
  fieldName: string;
}

function AddTransactionsFormAmountField({
  fieldName,
}: AddTransactionsFormAmountFieldProps) {
  const [field, , helper] = useField(fieldName);

  const [amount, setAmount] = useState<number>(field.value);

  const onChange = (value: number | null) => {
    if (value) {
      setAmount(value);
    }
  };

  const onBlur = () => {
    const formattedValue = (amount / 100).toFixed(2);
    const withZeros = formattedValue.includes(".")
      ? formattedValue
      : formattedValue + ".00";
    helper.setValue(withZeros);
    // console.log(
    //   "🚀 ~ file: add-transaction-form-amount-field.tsx:28 ~ onBlur ~ withZeros:",
    //   withZeros
    // );
  };

  return (
    <InputNumber onChange={onChange} onBlur={onBlur} value={field.value} />
  );
}

export default AddTransactionsFormAmountField;
