import { Transaction } from "../../model/transaction";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getDateFromStringWFormatter,
} from "../date-helper";

import { prettyfyJson } from "./file-parser-13";
import { HEADER_ROW } from "./parser-utils.test";

import { DATE_COLUMN_INDEX, DESC_COLUMN_INDEX } from "./parser-utils";

const EMPTY_ROW = ["", "", "", "", "", "", "", "", ""];

const debit_tx_01 = [
  "some text",
  "01/07/2022",
  "some text",
  "127.09 ",
  "  ",
  "some text",
  "some text",
  " 37.44 ",
  "some text",
];

const debit_tx_02 = [
  "some text",
  "07/07/2022",
  "some text",
  "22.11 ",
  "  ",
  "some text",
  "some text",
  " 5.94 ",
  "some text",
];

const credit_tx_01 = [
  "some text",
  "19/07/2022",
  "some text",
  "0.00 ",
  " 101.20 ",
  "some text",
  "some text",
  " 220.0 ",
  "some text",
];

const credit_tx_02 = [
  "some text",
  "26/07/2022",
  "some text",
  "0.00 ",
  " 1.55 ",
  "some text",
  "some text",
  " 1.35 ",
  "some text",
];

const credit_tx_03 = [
  "some text",
  "03/08/2022",
  "some text",
  "0.00 ",
  " 310,123.45 ",
  "some text",
  "some text",
  "  600.0 ",
  "some text",
];

const ACCOUNT_ID = 22;
const CREDIT_COL_INDEX = 4;

// describe("When parsing the transactions for the account 1", () => {
//   test("should return a debit transaction with negative amount", () => {
//     // Arrange
//     const inputData = [HEADER_ROW, EMPTY_ROW, debit_tx_01];

//     // Act
//     const result: Transaction[] = prettyfyJson(inputData, ACCOUNT_ID);

//     // Assert

//     expect(result).toBeDefined();
//     expect(result.length).toBe(1);

//     const expectedDebitAmount: number = +debit_tx_01[3];

//     const expectedTransaction = {
//       date: getDateFromStringWFormatter(
//         debit_tx_01[DATE_COLUMN_INDEX],
//         DATE_FORMAT_DD_MM_YYYY
//       ),
//       bankAccount: ACCOUNT_ID,
//       description: debit_tx_01[DESC_COLUMN_INDEX],
//       amount: -expectedDebitAmount,
//     } as Transaction;

//     expect(result[0]).toEqual(expectedTransaction);
//   });

//   test("should return a debit transaction with negative amount where other currency", () => {
//     // Arrange
//     const inputData = [HEADER_ROW, EMPTY_ROW, debit_tx_02];

//     // Act
//     const result: Transaction[] = prettyfyJson(inputData, ACCOUNT_ID);

//     // Assert

//     expect(result).toBeDefined();
//     expect(result.length).toBe(1);

//     const expectedDebitAmount: number = +debit_tx_02[3];

//     const expectedTransaction = {
//       date: getDateFromStringWFormatter(
//         debit_tx_02[DATE_COLUMN_INDEX],
//         DATE_FORMAT_DD_MM_YYYY
//       ),
//       account: ACCOUNT_ID,
//       description: debit_tx_02[DESC_COLUMN_INDEX],
//       amount: -expectedDebitAmount,
//     } as Transaction;

//     expect(result[0]).toEqual(expectedTransaction);
//   });

//   test("should return a credit transaction with positive amount", () => {
//     // Arrange
//     const inputData = [HEADER_ROW, EMPTY_ROW, credit_tx_01];

//     // Act
//     const result: Transaction[] | undefined = prettyfyJson(
//       inputData,
//       ACCOUNT_ID
//     );

//     // Assert
//     const expectedCreditAmount: number = +credit_tx_01[CREDIT_COL_INDEX];

//     expect(result).toBeDefined();
//     expect(result.length).toBe(1);

//     const expectedTransaction = {
//       date: getDateFromStringWFormatter(
//         credit_tx_01[DATE_COLUMN_INDEX],
//         DATE_FORMAT_DD_MM_YYYY
//       ),
//       account: ACCOUNT_ID,
//       description: credit_tx_01[DESC_COLUMN_INDEX],
//       amount: expectedCreditAmount,
//     } as Transaction;

//     expect(result[0]).toEqual(expectedTransaction);
//   });

//   test("should return a credit transaction with positive amount where other currency", () => {
//     // Arrange
//     const inputData = [HEADER_ROW, EMPTY_ROW, credit_tx_02];

//     // Act
//     const result: Transaction[] | undefined = prettyfyJson(
//       inputData,
//       ACCOUNT_ID
//     );

//     // Assert
//     const expectedCreditAmount: number = +credit_tx_02[CREDIT_COL_INDEX];

//     expect(result).toBeDefined();
//     expect(result.length).toBe(1);

//     const expectedTransaction = {
//       date: getDateFromStringWFormatter(
//         credit_tx_02[DATE_COLUMN_INDEX],
//         DATE_FORMAT_DD_MM_YYYY
//       ),
//       account: ACCOUNT_ID,
//       description: credit_tx_02[DESC_COLUMN_INDEX],
//       amount: expectedCreditAmount,
//     } as Transaction;

//     expect(result[0]).toEqual(expectedTransaction);
//   });

//   test("should return a credit transaction where amount is with comma", () => {
//     // Arrange
//     const inputData = [HEADER_ROW, EMPTY_ROW, credit_tx_03];

//     // Act
//     const result: Transaction[] | undefined = prettyfyJson(
//       inputData,
//       ACCOUNT_ID
//     );

//     // Assert
//     const expectedCreditAmount: number = +credit_tx_03[
//       CREDIT_COL_INDEX
//     ].replace(/,/g, "");

//     expect(result).toBeDefined();
//     expect(result.length).toBe(1);

//     const expectedTransaction = {
//       date: getDateFromStringWFormatter(
//         credit_tx_03[DATE_COLUMN_INDEX],
//         DATE_FORMAT_DD_MM_YYYY
//       ),
//       account: ACCOUNT_ID,
//       description: credit_tx_03[DESC_COLUMN_INDEX],
//       amount: expectedCreditAmount,
//     } as Transaction;

//     expect(result[0]).toEqual(expectedTransaction);
//   });
// });
