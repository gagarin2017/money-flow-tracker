import { InputNumber } from "antd";
import { useField } from "formik";
import { useState } from "react";

interface AddTransactionsFormAmountFieldProps {
  fieldName: string;
}

function AddTransactionsFormAmountField({
  fieldName,
}: AddTransactionsFormAmountFieldProps) {
  const [field, , helper] = useField(fieldName);

  const [amount, setAmount] = useState<number | undefined>(field.value);

  const onChange = (value: number | null) => {
    if (value) {
      setAmount(value);
      helper.setValue(value);
    } else {
      setAmount(undefined);
      helper.setValue(undefined);
    }
  };

  const onBlur = () => {
    if (amount && amount !== 0 && amount !== field.value) {
      const formattedValue = (amount / 100).toFixed(2);
      const withZeros = formattedValue.includes(".")
        ? formattedValue
        : formattedValue + ".00";
      helper.setValue(withZeros);
    }
    helper.setTouched(true);
  };

  return (
    // <InputNumber onChange={onChange} onBlur={onBlur} value={field.value} />
    <InputNumber onChange={onChange} value={field.value} />
  );
}

export default AddTransactionsFormAmountField;
