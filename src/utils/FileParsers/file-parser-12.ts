import { Category } from "../../model/category";
import { Description } from "../../model/description";
import { Tag } from "../../model/tag";
import { Transaction } from "../../model/transaction";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getDateFromStringWFormatter,
} from "../date-helper";
import {
  DATE_COLUMN_INDEX,
  getBalanceAmtIndex,
  getCreditAmtIndex,
  getDebitAmtIndex,
  getDescriptionIndex,
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
  const DESC_COLUMN_INDEX = getDescriptionIndex(headerRow);

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

      let debitAmount: number | undefined = undefined;
      let creditAmount: number | undefined = undefined;

      // does the row have any amount
      if (
        row[DEBIT_AMT_COLUMN_INDEX] &&
        row[DEBIT_AMT_COLUMN_INDEX] !== null &&
        +row[DEBIT_AMT_COLUMN_INDEX] !== 0
      ) {
        // debit amount
        debitAmount = parseFloat(row[DEBIT_AMT_COLUMN_INDEX].replace(/,/g, ""));
      }

      if (
        row[CREDIT_AMT_COLUMN_INDEX] &&
        row[CREDIT_AMT_COLUMN_INDEX] !== null &&
        +row[CREDIT_AMT_COLUMN_INDEX] !== 0
      ) {
        // credit amount
        creditAmount = parseFloat(
          row[CREDIT_AMT_COLUMN_INDEX].replace(/,/g, "")
        );
      }

      if (debitAmount || creditAmount) {
        transactions.push({
          id: -1,
          date: txDate,
          bankAccount: { id: accountId },
          category: {} as Category,
          memo: row[DESC_COLUMN_INDEX],
          description: {} as Description,
          tag: {} as Tag,
          runningBalance: parseFloat(
            row[BALANCE_COLUMN_INDEX].replace(/,/g, "")
          ),
          debitAmount,
          creditAmount,
        } as Transaction);
      }
    }
  });

  return transactions;
};
