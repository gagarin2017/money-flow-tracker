import { Input } from "antd";
import { useField } from "formik";
import { useState } from "react";

interface AddTransactionsFormDescriptionFieldProps {
  fieldName: string;
}

function AddTransactionsFormDescriptionField({
  fieldName,
}: AddTransactionsFormDescriptionFieldProps) {
  const [field, , helper] = useField(fieldName);

  const [description, setDerscription] = useState<string>(field.value);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    setDerscription(inputValue);
  };

  const onBlur = () => {
    helper.setValue(description);
  };

  return (
    <Input
      onChange={onChange}
      value={description}
      placeholder="Description"
      onBlur={onBlur}
      // maxLength={16}
    />
  );
}

export default AddTransactionsFormDescriptionField;
