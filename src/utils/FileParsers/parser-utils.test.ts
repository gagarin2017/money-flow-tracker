import {
  getBalanceAmtIndex,
  getCreditAmtIndex,
  getDebitAmtIndex,
} from "./parser-utils";

export const HEADER_ROW = [
  "Header 1",
  "Header 2",
  "Header 3",
  "Some Debit amount",
  "Perhaps Credit amt",
  "daily balance  ",
  "Header 4",
];

export const HEADER_ROW_V1 = [
  "Header 1",
  "Header 2",
  "Header 3",
  "Header 4",
  "Header 5",
  "Some Debit amount",
  "Perhaps Credit amt",
  "daily balance  ",
  "Header 9",
  "Header 10",
  "Header 11",
  "Header 12",
];

describe("file version 01", () => {
  test("should return a valid debit column index", () => {
    // Arrange
    const inputData = HEADER_ROW;

    // Act
    const result = getDebitAmtIndex(inputData);

    // Assert
    expect(result).toBe(3);
  });

  test("should return a valid credit column index", () => {
    // Arrange
    const inputData = HEADER_ROW;

    // Act
    const result = getCreditAmtIndex(inputData);

    // Assert
    expect(result).toBe(4);
  });

  test("should return a valid balance column index", () => {
    // Arrange
    const inputData = HEADER_ROW;

    // Act
    const result = getBalanceAmtIndex(inputData);

    // Assert
    expect(result).toBe(5);
  });
});

describe("file version 02", () => {
  test("should return a valid debit column index", () => {
    // Arrange
    const inputData = HEADER_ROW_V1;

    // Act
    const result = getDebitAmtIndex(inputData);

    // Assert
    expect(result).toBe(5);
  });

  test("should return a valid credit column index", () => {
    // Arrange
    const inputData = HEADER_ROW_V1;

    // Act
    const result = getCreditAmtIndex(inputData);

    // Assert
    expect(result).toBe(6);
  });

  test("should return a valid balance column index", () => {
    // Arrange
    const inputData = HEADER_ROW_V1;

    // Act
    const result = getBalanceAmtIndex(inputData);

    // Assert
    expect(result).toBe(7);
  });
});
