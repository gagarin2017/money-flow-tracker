import { Category } from "../../model/category";
import { Description } from "../../model/description";
import { Tag } from "../../model/tag";
import { Transaction } from "../../model/transaction";
import {
  getDateFromStringWFormatter,
  DATE_FORMAT_DD_MM_YYYY,
} from "../date-helper";
import {
  DATE_COLUMN_INDEX,
  getDescriptionIndex,
  getPaidOutAmtIndex,
  getPaidInAmtIndex,
} from "./parser-utils";

/**
 * TODO: Need to have only one parser for all kind of files (accounts)
 *
 * @param uglyJsonArray
 * @param accountId
 * @returns
 */
export const prettyfyJson = (uglyJsonArray: any, accountId: number) => {
  const resultTransactions: Transaction[] = [];

  const headers = uglyJsonArray[0];

  const DEBIT_AMT_COLUMN_INDEX = getPaidOutAmtIndex(headers);
  const CREDIT_AMT_COLUMN_INDEX = getPaidInAmtIndex(headers);
  const DESC_COLUMN_INDEX = getDescriptionIndex(headers);

  // Removing headers
  uglyJsonArray.splice(0, 1);

  const inputArray = uglyJsonArray.map((row: string[]) => {
    return row.map((el) => el.trim());
  });

  inputArray.forEach((row: String) => {
    let txDateString: string = row[DATE_COLUMN_INDEX];
    let txDate;

    if (txDateString && txDateString !== "") {
      txDate = getDateFromStringWFormatter(
        row[DATE_COLUMN_INDEX],
        DATE_FORMAT_DD_MM_YYYY
      );
    }

    let debitAmount;
    let creditAmount;

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
      creditAmount = parseFloat(row[CREDIT_AMT_COLUMN_INDEX].replace(/,/g, ""));
    }
    if (txDate)
      resultTransactions.push({
        id: -1,
        date: txDate,
        bankAccount: { id: accountId },
        category: {} as Category,
        memo: row[DESC_COLUMN_INDEX],
        description: {} as Description,
        tag: {} as Tag,
        runningBalance: 0,
        debitAmount,
        creditAmount,
      } as Transaction);
  });

  return resultTransactions;
};
