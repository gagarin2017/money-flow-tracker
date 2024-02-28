import BankAccount from "../../model/bank-account";
import { Category } from "../../model/category";
import { Description } from "../../model/description";
import { Tag } from "../../model/tag";
import { Transaction } from "../../model/transaction";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getDateFromStringWFormatter,
} from "../date-helper";

import { prettyfyJson } from "./file-parser-12";
import { DATE_COLUMN_INDEX, DESC_COLUMN_INDEX } from "./parser-utils";
import { HEADER_ROW, HEADER_ROW_V1 } from "./parser-utils.test";

const debit_tx_01 = [
  "some value",
  "03/08/2022",
  "some value",
  "999.00",
  "",
  "",
  "some value",
];

const credit_tx_01 = [
  "some value",
  "25/07/2022",
  "some value",
  "",
  "1000.01",
  "",
  "some value",
];

const tx_without_amounts = [
  "some value",
  "23/05/2022",
  "some value",
  "",
  "",
  "",
  "",
];

const tx_with_zero_credit_amount = [
  "some value",
  "03/08/2022",
  "some value",
  "",
  "0",
  "",
  "some value",
];

const tx_with_zero_debit_amount = [
  "some value",
  "03/08/2022",
  "some value",
  "0.00",
  "",
  "",
  "some value",
];

const debit_tx_v_1 = [
  "some value",
  "01/07/2022",
  "Some text",
  "Some text 1",
  "",
  "123.99",
  "",
  "1586",
  "txt",
  "txt",
  " 19.42",
  "txt",
];

const credit_tx_v_1 = [
  "some value",
  "25/07/2022",
  "some value",
  "some value",
  "",
  "",
  "1,234.56",
  "450.50",
  "some value",
  "some value",
  " 1,111.12",
  "some value",
];

const ACCOUNT_ID = 22;

describe("File type 1", () => {
  test("should return a debit transaction with negative amount", () => {
    // Arrange
    const inputData = [HEADER_ROW, debit_tx_01];

    // Act
    const result: Transaction[] = prettyfyJson(inputData, ACCOUNT_ID);

    // Assert

    expect(result).toBeDefined();
    expect(result.length).toBe(1);

    const expectedDebitAmount: number = +debit_tx_01[3];

    const expectedTransaction = {
      id: -1,
      bankAccount: { id: ACCOUNT_ID } as BankAccount,
      category: {} as Category,
      date: getDateFromStringWFormatter(
        debit_tx_01[DATE_COLUMN_INDEX],
        DATE_FORMAT_DD_MM_YYYY
      ),
      description: {} as Description,
      memo: debit_tx_01[DESC_COLUMN_INDEX],
      tag: {} as Tag,
      runningBalance: NaN,
      amount: -expectedDebitAmount,
    } as Transaction;

    expect(result[0]).toEqual(expectedTransaction);
  });

  test("should return a credit transaction with positive amount", () => {
    // Arrange
    const inputData = [HEADER_ROW, credit_tx_01];

    // Act
    const result: Transaction[] | undefined = prettyfyJson(
      inputData,
      ACCOUNT_ID
    );

    // Assert
    const expectedCreditAmount: number = +credit_tx_01[4];

    expect(result).toBeDefined();
    expect(result.length).toBe(1);

    const expectedTransaction = {
      id: -1,
      bankAccount: { id: ACCOUNT_ID } as BankAccount,
      date: getDateFromStringWFormatter(
        credit_tx_01[DATE_COLUMN_INDEX],
        DATE_FORMAT_DD_MM_YYYY
      ),
      category: {} as Category,
      description: {} as Description,
      memo: credit_tx_01[DESC_COLUMN_INDEX],
      tag: {} as Tag,
      runningBalance: NaN,
      amount: expectedCreditAmount,
    } as Transaction;

    expect(result[0]).toEqual(expectedTransaction);
  });

  test("should exclude the transaction without amounts from the result array", () => {
    // Arrange
    const inputData = [HEADER_ROW, credit_tx_01, tx_without_amounts];

    // Act
    const result: Transaction[] | undefined = prettyfyJson(
      inputData,
      ACCOUNT_ID
    );

    // Assert
    const expectedCreditAmount: number = +credit_tx_01[4];

    expect(result).toBeDefined();
    expect(result.length).toBe(1);

    const expectedTransaction = {
      id: -1,
      bankAccount: { id: ACCOUNT_ID } as BankAccount,
      date: getDateFromStringWFormatter(
        credit_tx_01[DATE_COLUMN_INDEX],
        DATE_FORMAT_DD_MM_YYYY
      ),
      category: {} as Category,
      description: {} as Description,
      memo: credit_tx_01[DESC_COLUMN_INDEX],
      tag: {} as Tag,
      runningBalance: NaN,
      amount: expectedCreditAmount,
    } as Transaction;

    expect(result[0]).toEqual(expectedTransaction);
  });

  test("should exclude a credit transaction with 0 amount from the result array", () => {
    // Arrange
    const inputData = [HEADER_ROW, credit_tx_01, tx_with_zero_credit_amount];

    // Act
    const result: Transaction[] | undefined = prettyfyJson(
      inputData,
      ACCOUNT_ID
    );

    // Assert
    const expectedCreditAmount: number = +credit_tx_01[4];

    expect(result).toBeDefined();
    expect(result.length).toBe(1);

    const expectedTransaction = {
      id: -1,
      bankAccount: { id: ACCOUNT_ID } as BankAccount,
      date: getDateFromStringWFormatter(
        credit_tx_01[DATE_COLUMN_INDEX],
        DATE_FORMAT_DD_MM_YYYY
      ),
      category: {} as Category,
      description: {} as Description,
      memo: credit_tx_01[DESC_COLUMN_INDEX],
      tag: {} as Tag,
      runningBalance: NaN,
      amount: expectedCreditAmount,
    } as Transaction;

    expect(result[0]).toEqual(expectedTransaction);
  });

  test("should exclude a debit transaction with 0 amount from the result array", () => {
    // Arrange
    const inputData = [HEADER_ROW, credit_tx_01, tx_with_zero_debit_amount];

    // Act
    const result: Transaction[] | undefined = prettyfyJson(
      inputData,
      ACCOUNT_ID
    );

    // Assert
    const expectedCreditAmount: number = +credit_tx_01[4];

    expect(result).toBeDefined();
    expect(result.length).toBe(1);

    const expectedTransaction = {
      id: -1,
      bankAccount: { id: ACCOUNT_ID } as BankAccount,
      date: getDateFromStringWFormatter(
        credit_tx_01[DATE_COLUMN_INDEX],
        DATE_FORMAT_DD_MM_YYYY
      ),
      category: {} as Category,
      description: {} as Description,
      memo: credit_tx_01[DESC_COLUMN_INDEX],
      tag: {} as Tag,
      runningBalance: NaN,
      amount: expectedCreditAmount,
    } as Transaction;

    expect(result[0]).toEqual(expectedTransaction);
  });
});

describe("File type 2", () => {
  test("should return a debit transaction with negative amount", () => {
    // Arrange
    const inputData = [HEADER_ROW_V1, debit_tx_v_1];

    // Act
    const result: Transaction[] = prettyfyJson(inputData, ACCOUNT_ID);

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(1);

    const expectedDebitAmount: number = +debit_tx_v_1[5];

    const expectedTransaction = {
      id: -1,
      bankAccount: { id: ACCOUNT_ID } as BankAccount,
      date: getDateFromStringWFormatter(
        debit_tx_v_1[DATE_COLUMN_INDEX],
        DATE_FORMAT_DD_MM_YYYY
      ),
      category: {} as Category,
      description: {} as Description,
      memo: debit_tx_v_1[DESC_COLUMN_INDEX],
      tag: {} as Tag,
      runningBalance: +debit_tx_v_1[7],
      amount: -expectedDebitAmount,
    } as Transaction;

    expect(result[0]).toEqual(expectedTransaction);
  });

  test("should return a credit transaction with positive amount", () => {
    // Arrange
    const inputData = [HEADER_ROW_V1, credit_tx_v_1];

    // Act
    const result: Transaction[] = prettyfyJson(inputData, ACCOUNT_ID);

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(1);

    const expectedCreditAmount: number = +credit_tx_v_1[6].replace(/,/g, "");

    const expectedTransaction = {
      id: -1,
      bankAccount: { id: ACCOUNT_ID } as BankAccount,
      date: getDateFromStringWFormatter(
        credit_tx_v_1[DATE_COLUMN_INDEX],
        DATE_FORMAT_DD_MM_YYYY
      ),
      category: {} as Category,
      description: {} as Description,
      memo: credit_tx_v_1[DESC_COLUMN_INDEX],
      tag: {} as Tag,
      runningBalance: +credit_tx_v_1[7],
      amount: expectedCreditAmount,
    } as Transaction;

    expect(result[0]).toEqual(expectedTransaction);
  });
});
