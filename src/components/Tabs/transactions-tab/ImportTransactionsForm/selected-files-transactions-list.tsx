import { useField, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FileParserResults } from "./model/file-parser-results";
import { TransactionsFileBankAccount } from "./model/transactions-file-bank-account";

interface SelectedFilesTransactionsListProps {
  fieldName: string;
  filesBanksAccountsField: string;
}

/**
 * @deprecated
 */
const SelectedFilesTransactionsList = ({
  fieldName,
  filesBanksAccountsField,
}: SelectedFilesTransactionsListProps) => {
  const [field, meta, helpers] = useField(filesBanksAccountsField);

  // useEffect(() => {
  //   if (field.value.length > 0) {
  //     field.value.map((fileAccountPair: TransactionsFileBankAccount) => {
  //       return readAndParseTxFiles(
  //         fileAccountPair,
  //         parsingResultsUpdateHandler
  //       );
  //     });
  //   }
  // }, [field.value]);

  const bankAccounts = [];

  const [parsingResults, setParsingResults] = useState<
    FileParserResults | undefined
  >(undefined);

  const parsingResultsUpdateHandler = (result: FileParserResults) => {
    setParsingResults(result);
  };

  console.log("parsingResults ", parsingResults);

  //   const result = parsingResults?.buildTransactionsForRequest.map(
  //     (transaction: Transaction) => (
  //       <li>
  //         {transaction.date} - {transaction.amount}
  //       </li>
  //     )
  //   );

  return (
    <ul>
      <li>hello</li>
    </ul>
  );
};

export default SelectedFilesTransactionsList;
