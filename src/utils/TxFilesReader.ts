import * as Papa from "papaparse";
import { FileParserResults } from "../components/Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import { TransactionsFileBankAccount } from "../components/Tabs/transactions-tab/ImportTransactionsForm/model//transactions-file-bank-account";
import { Transaction } from "../model/transaction";
import { prettyfyJson as prettyfyJson12 } from "./FileParsers/file-parser-12";
import { prettyfyJson as prettyfyJson13 } from "./FileParsers/file-parser-13";

export enum ParsingStatus {
  IN_PROGRESS = "In progress",
  ERROR = "Error",
  FINISHED = "Finished",
}

export const readAndParseTxFiles = (
  fileBankAccount: TransactionsFileBankAccount
): Promise<FileParserResults> => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileBankAccount.file, {
      complete: (results) => {
        let prettyJson: Transaction[] | undefined = undefined;
        let parsingResults: FileParserResults = {} as FileParserResults;

        const errorParsingResult = {
          parsingErrors: ["File could not be parsed. Parser doesn't exist"],
          status: ParsingStatus.ERROR,
          fileName: fileBankAccount.file.name,
          accountId: fileBankAccount.bankAccountId,
        } as FileParserResults;

        switch (+fileBankAccount.bankAccountId) {
          case 11:
            prettyJson = prettyfyJson12(
              results.data,
              fileBankAccount.bankAccountId
            );
            break;
          case 17:
            prettyJson = prettyfyJson12(
              results.data,
              fileBankAccount.bankAccountId
            );
            break;
          case 10:
            prettyJson = prettyfyJson13(
              results.data,
              fileBankAccount.bankAccountId
            );
            break;
          default:
            parsingResults = errorParsingResult;
        }

        if (prettyJson && prettyJson.length > 0) {
          parsingResults = {
            buildTransactionsForRequest: prettyJson,
            status: ParsingStatus.FINISHED,
            accountId: fileBankAccount.bankAccountId,
          } as FileParserResults;

          return resolve(parsingResults);
        } else {
          return reject(errorParsingResult);
        }
      },
      error: (error) => {
        return reject({
          parsingErrors: [error.message],
          status: ParsingStatus.ERROR,
          fileName: fileBankAccount.file.name,
          accountId: fileBankAccount.bankAccountId,
        } as FileParserResults);
      },
      skipEmptyLines: true,
    });
  });
};
