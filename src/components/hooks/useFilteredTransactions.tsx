import { useEffect, useState } from "react";
import { ParsingStatus, readAndParseTxFiles } from "../../utils/TxFilesReader";
import { filterTransactionsAPI } from "../services/transactions-api";
import { FileParserResults } from "../Tabs/transactions-tab/import-transactions/ImportTransactionsForm/model/file-parser-results";
import { ParsingError } from "../Tabs/transactions-tab/import-transactions/ImportTransactionsForm/model/parsing-error";
import { TransactionsFileBankAccountPair } from "../Tabs/transactions-tab/import-transactions/ImportTransactionsForm/model/transactions-file-bank-account";

/**
 * Custom hook to query the transactions which about to be added.
 * Accepts transactions form the bank files, parses them, then populates the errors and parsing results to the API request.
 * After the new transactions are returned from the backend, those are set in the context to become available in the UI form addNewTransactions.
 *
 * @param transactionsFileBankAccountPairs
 * @returns
 */
const useFilteredTransactions = (
  transactionsFileBankAccountPairs: TransactionsFileBankAccountPair[]
) => {
  const [tableTransactions, setTableTransactions] = useState<any[] | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parsingErrors, setParsingErrors] = useState<ParsingError[]>([]);

  useEffect(() => {
    const filterTransactions = async () => {
      try {
        setIsLoading(true);
        setParsingErrors([]);
        setTableTransactions([]);

        const parsedTransactions: FileParserResults[] =
          await processTransactionFiles(transactionsFileBankAccountPairs);

        const errorList: ParsingError[] = [];
        parsedTransactions
          .filter((result) => result.status === ParsingStatus.ERROR)
          .forEach((error) => {
            errorList.push({
              message: `Transactions from file "${error.fileName}" could not be imported into account [${error.accountId}]. Check the account name and try again.`,
              description: error.parsingErrors,
              duration: 0,
            });
          });

        if (errorList.length > 0) {
          setParsingErrors(errorList);
        }

        const parserResults = parsedTransactions.filter(
          (result) => result.status === ParsingStatus.FINISHED
        );

        if (parserResults && parserResults.length > 0) {
          const filteredTransactions = await filterTransactionsAPI(
            parserResults
          );

          setTableTransactions(filteredTransactions);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    filterTransactions();
  }, [transactionsFileBankAccountPairs]);

  return { tableTransactions, error, parsingErrors, isLoading };
};

const processTransactionFiles = async (
  transactions: TransactionsFileBankAccountPair[]
) => {
  let promises: Promise<FileParserResults>[] = transactions.map(
    async (fileAccountPair) => {
      try {
        const parsingResult: FileParserResults = await readAndParseTxFiles(
          fileAccountPair
        );
        return parsingResult;
      } catch (error: any) {
        return error;
      }
    }
  );

  return Promise.all(promises);
};

export default useFilteredTransactions;
