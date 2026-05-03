import { Category } from "../../../model/category";
import { Description } from "../../../model/description";
import { Tag } from "../../../model/tag";
import { Transaction } from "../../../model/transaction";
import { ParsingStatus } from "../../../utils/TxFilesReader";
import { FileParserResults } from "../../Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import {
  deserializeFilteredTransactions,
  serializeFileTransactions,
} from "./transaction-resource";

describe("transaction import filter resource", () => {
  test("serializes parsed file transactions using the filter API request shape", () => {
    const parsedTransaction = {
      id: -1,
      date: new Date("2025-03-15"),
      bankAccount: { id: 42 },
      category: {} as Category,
      description: {} as Description,
      tag: {} as Tag,
      memo: "Card payment",
      debitAmount: 12.34,
      runningBalance: 100,
    } as Transaction;

    const result = serializeFileTransactions({
      status: ParsingStatus.FINISHED,
      accountId: 42,
      buildTransactionsForRequest: [parsedTransaction],
    } as FileParserResults);

    expect(result).toEqual({
      bankAccountId: 42,
      fileTransactions: [
        {
          ...parsedTransaction,
          date: "2025-03-15",
        },
      ],
    });
  });

  test("keeps existing filtered transactions populated and excludes them from selected imports", () => {
    const existingCategory = {
      id: 32,
      name: "Groceries",
      parentCategory: {
        id: 31,
        name: "Food & Dining",
        subCategories: [],
      },
      subCategories: [],
    } as Category;
    const existingDescription = {
      id: 3,
      name: "Existing supermarket payment",
    } as Description;
    const existingTag = { id: 2, name: "weekly shop" } as Tag;

    const [accountTransactions] = deserializeFilteredTransactions([
      {
        bankAccountId: 42,
        fileTransactions: [
          {
            id: 7100,
            date: "2025-03-14",
            category: existingCategory,
            description: existingDescription,
            tag: existingTag,
            memo: "matched existing row",
            debitAmount: 12.34,
            creditAmount: null,
            amount: -12.34,
            previouslySavedTransaction: true,
          },
          {
            id: -1,
            date: "2025-03-15",
            category: {} as Category,
            description: {} as Description,
            tag: {} as Tag,
            memo: "brand new row",
            debitAmount: null,
            creditAmount: 25,
            amount: 25,
            previouslySavedTransaction: false,
          },
        ] as unknown as Transaction[],
      },
    ]);

    expect(accountTransactions.bankAccount?.id).toBe(42);
    expect(accountTransactions.transactions).toHaveLength(2);

    const [existingTransaction, newTransaction] =
      accountTransactions.transactions;

    expect(existingTransaction.previouslySavedTransaction).toBe(true);
    expect(existingTransaction.category).toEqual(existingCategory);
    expect(existingTransaction.description).toEqual(existingDescription);
    expect(existingTransaction.tag).toEqual(existingTag);
    expect(existingTransaction.debitAmount).toBe(12.34);
    expect(existingTransaction.creditAmount).toBeUndefined();

    expect(newTransaction.previouslySavedTransaction).toBe(false);
    expect(newTransaction.debitAmount).toBeUndefined();
    expect(newTransaction.creditAmount).toBe(25);

    expect(accountTransactions.selectedTransactions).toEqual([
      newTransaction.id,
    ]);
    expect(accountTransactions.selectedTransactions).not.toContain(
      existingTransaction.id
    );
  });
});
