import { Input } from "antd";
import { useField } from "formik";
import { useState } from "react";

interface AddTransactionsFormTransactionMemoFieldProps {
  fieldName: string;
}

function AddTransactionsFormTransactionMemoField({
  fieldName,
}: AddTransactionsFormTransactionMemoFieldProps) {
  const [field, , helper] = useField(fieldName);

  const [memo, setMemo] = useState<string>(field.value);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    setMemo(inputValue);
  };

  const onBlur = () => {
    helper.setValue(memo);
  };

  return (
    <Input
      onChange={onChange}
      value={memo}
      placeholder="Memo"
      onBlur={onBlur}
      // maxLength={16}
    />
  );
}

export default AddTransactionsFormTransactionMemoField;
