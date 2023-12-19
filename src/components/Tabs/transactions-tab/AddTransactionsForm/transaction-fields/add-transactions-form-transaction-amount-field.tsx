import { useField } from "formik";
// import CurrencyInput from "react-currency-input-field";

interface AddTransactionsFormTransactionAmountFieldProps {
  fieldName: string;
}

const AddTransactionsFormTransactionAmountField = ({
  fieldName,
}: AddTransactionsFormTransactionAmountFieldProps) => {
  const [field, , helper] = useField(fieldName);

  return (
    // <CurrencyInput
    //   style={{ borderColor: "lightgrey", borderLeftColor: "lightgrey" }}
    //   name={fieldName}
    //   id="input-example"
    //   fixedDecimalLength={2}
    //   value={field.value}
    //   // onValueChange={amountInputHandler}
    //   intlConfig={{ locale: "en-IE", currency: "EUR" }}
    //   required={true}
    // />
    <div></div>
  );
};

export default AddTransactionsFormTransactionAmountField;
