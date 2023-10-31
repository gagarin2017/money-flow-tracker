interface TransactionsFilesInputProps {
  formikFieldName: string;
  setFieldValue: (fieldName: string, selectedFiles: File[]) => void;
  setFieldTouched: (fieldName: string) => void;
}

const TransactionsFilesInput = ({
  formikFieldName,
  setFieldValue,
  setFieldTouched,
}: TransactionsFilesInputProps) => {
  return (
    <input
      id="transactionsfiles"
      name={formikFieldName}
      type="file"
      onChange={(event) => {
        const files: FileList | null = event.target.files;
        if (files) {
          setFieldValue(formikFieldName, Array.from(files));
          setFieldTouched(formikFieldName);
        }
      }}
      multiple
    />
  );
};

export default TransactionsFilesInput;
