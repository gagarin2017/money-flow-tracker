import { Transaction } from "../../model/transaction";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getDateFromStringWFormatter,
} from "../date-helper";
import {
  getDateIndex,
  getDescriptionIndex,
  getPaidInAmtIndex,
  getPaidOutAmtIndex,
  isValidDate,
} from "./parser-utils";

/**
 * TODO: Need to have only one parser for all kind of files (accounts)
 *
 * @param uglyJsonArray
 * @param accountId
 * @returns
 */
export const prettyfyJson = (
  uglyJsonArray: any,
  accountId: number,
  errors: string[]
) => {
  const resultTransactions: Transaction[] = [];

  const headers = uglyJsonArray[0];

  const DATE_COLUMN_INDEX = 2; // hardcoding the value as Column doesnt have date in the title
  const DEBIT_AMT_COLUMN_INDEX = getPaidOutAmtIndex(headers);
  const CREDIT_AMT_COLUMN_INDEX = getPaidInAmtIndex(headers);
  const DESC_COLUMN_INDEX = getDescriptionIndex(headers);

  // Removing headers
  uglyJsonArray.splice(0, 1);

  const inputArray = uglyJsonArray.map((row: string[]) => {
    return row.map((el) => el.trim());
  });

  inputArray.forEach((row: String) => {
    let debitAmount: number | undefined = undefined;
    let creditAmount: number | undefined = undefined;

    const txDate = getDateFromStringWFormatter(
      row[DATE_COLUMN_INDEX],
      DATE_FORMAT_DD_MM_YYYY
    );

    if (!isValidDate(txDate)) {
      errors.push(
        "The file date value could not be parsed properly: [" +
          row[DATE_COLUMN_INDEX] +
          "]. Error: [" +
          txDate +
          "]"
      );
    }

    if (errors.length === 0) {
      // debit amount
      if (
        row[DEBIT_AMT_COLUMN_INDEX] &&
        row[DEBIT_AMT_COLUMN_INDEX] !== null &&
        +row[DEBIT_AMT_COLUMN_INDEX] !== 0
      ) {
        debitAmount = parseFloat(row[DEBIT_AMT_COLUMN_INDEX].replace(/,/g, ""));
      }

      // credit amount
      if (
        row[CREDIT_AMT_COLUMN_INDEX] &&
        row[CREDIT_AMT_COLUMN_INDEX] !== null &&
        +row[CREDIT_AMT_COLUMN_INDEX] !== 0
      ) {
        creditAmount = parseFloat(
          row[CREDIT_AMT_COLUMN_INDEX].replace(/,/g, "")
        );
      }
    }

    if (errors.length === 0 && (debitAmount || creditAmount)) {
      resultTransactions.push({
        id: -1,
        date: txDate,
        bankAccount: { id: accountId },
        memo: row[DESC_COLUMN_INDEX],
        debitAmount,
        creditAmount,
      } as Transaction);
    }
  });

  return resultTransactions;
};
