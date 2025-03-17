import { DatePicker, DatePickerProps } from "antd";
import dayjs from "dayjs";
import { useField } from "formik";
import {
  DATE_FORMAT_DD_MM_YYYY,
  DATE_FORMAT_YYYY_MM_DD,
} from "../../../../../utils/date-helper";

interface AddTransactionFormDateFieldProps {
  fieldName: string;
}

function AddTransactionFormDateField({
  fieldName,
}: AddTransactionFormDateFieldProps) {
  const [field, , helper] = useField(fieldName);

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    helper.setValue(date?.toDate());
  };

  return (
    <DatePicker
      style={{ width: 110 }}
      name={fieldName}
      defaultValue={dayjs(field.value)}
      format={DATE_FORMAT_DD_MM_YYYY}
      allowClear={false}
      onChange={onChange}
    />
  );
}

export default AddTransactionFormDateField;
