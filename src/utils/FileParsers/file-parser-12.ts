import { Transaction } from "../../model/transaction";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getDateFromStringWFormatter,
} from "../date-helper";
import {
  DATE_COLUMN_INDEX,
  DESC_COLUMN_INDEX,
  getBalanceAmtIndex,
  getCreditAmtIndex,
  getDebitAmtIndex,
} from "./parser-utils";

/**
 * TODO: Need to have only one parser for all kind of files (accounts)
 *
 * @param uglyJsonArray
 * @param accountId
 * @returns
 */
export const prettyfyJson = (uglyJsonArray: any, accountId: number) => {
  let transactions: Transaction[] = [];

  const headerRow = uglyJsonArray[0];

  const DEBIT_AMT_COLUMN_INDEX = getDebitAmtIndex(headerRow);
  const CREDIT_AMT_COLUMN_INDEX = getCreditAmtIndex(headerRow);
  const BALANCE_COLUMN_INDEX = getBalanceAmtIndex(headerRow);

  // Removing headers
  uglyJsonArray.splice(0, 1);

  const inputArray = uglyJsonArray.map((row: string[]) => {
    return row.map((el) => el.trim());
  });

  inputArray.forEach((row: any) => {
    if (row && row.length > 0 && row[0].trim()) {
      const txDate = getDateFromStringWFormatter(
        row[DATE_COLUMN_INDEX],
        DATE_FORMAT_DD_MM_YYYY
      );

      let amount: number | undefined = undefined;

      // does the row have any amount
      if (
        row[DEBIT_AMT_COLUMN_INDEX] &&
        row[DEBIT_AMT_COLUMN_INDEX] !== null &&
        +row[DEBIT_AMT_COLUMN_INDEX] !== 0
      ) {
        // debit amount
        amount = -parseFloat(row[DEBIT_AMT_COLUMN_INDEX].replace(/,/g, ""));
      }

      if (
        row[CREDIT_AMT_COLUMN_INDEX] &&
        row[CREDIT_AMT_COLUMN_INDEX] !== null &&
        +row[CREDIT_AMT_COLUMN_INDEX] !== 0
      ) {
        // credit amount
        amount = parseFloat(row[CREDIT_AMT_COLUMN_INDEX].replace(/,/g, ""));
      }

      if (amount) {
        transactions.push({
          date: txDate,
          bankAccount: accountId,
          description: row[DESC_COLUMN_INDEX],
          balance: parseFloat(row[BALANCE_COLUMN_INDEX].replace(/,/g, "")),
          amount,
        } as Transaction);
      }
    }
  });

  return transactions;
};
