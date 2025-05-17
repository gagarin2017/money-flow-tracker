import { Card, List } from "antd";
import { FieldArray, useField, useFormikContext } from "formik";
import TransactionsFileBankAccountPair from "./transactions-file-bank-account-pair";

interface TransactionsFilesBankAccountListProps {
  formikFieldName: string;
}
/**
 * Select the associated bank account for the each selected file.
 * 
 * For example, Imported 2 files: 1.csv for bankAccA and 2.csv for bankAccB.
 * Hence, we are going to build a pair as follows: <1.csv, bankAccA>, <2.csv, bankAccB>
 *  
 * @param param0
 * @returns 
 */
const TransactionsFilesBankAccountList = ({
  formikFieldName,
}: TransactionsFilesBankAccountListProps) => {
  const {
    values: { selectedFiles },
  } = useFormikContext<{
    selectedFiles: any[];
  }>();

  const [, meta] = useField(formikFieldName);

  return (
    <>
      {selectedFiles.length > 0 && (
        <Card
          title="Select associated bank accounts for each file"
          style={{ marginTop: 10 }}
        >
          <FieldArray
            name="transactionsFileBankAccountField"
            render={(arrayHelpers) => {
              return (
                <>
                  {selectedFiles.map((file, index) => (
                    <div key={index}>
                      <List>
                        <TransactionsFileBankAccountPair
                          file={file}
                          formikArrayHelper={arrayHelpers}
                        />
                      </List>
                    </div>
                  ))}
                </>
              );
            }}
          />
          {!!meta.touched && !!meta.error && <div>{meta.error}</div>}
        </Card>
      )}
    </>
  );
};

export default TransactionsFilesBankAccountList;
