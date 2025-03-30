import * as Yup from "yup";
import BankAccount from "../../../../model/bank-account";
import { Category } from "../../../../model/category";
import { FormTransaction } from "../add-transactions-utils";
import { NewTransactionsFormData } from "../AddTransactionsForm/add-transactions-form";
import {
  NEW_TRANSACTIONS_FORM_DATA_SCHEMA,
  TRANSACTION_VALIDATION_SCHEMA,
} from "./validation-schemas";

const transaction_undefined: FormTransaction = {
  id: "-1",
  date: new Date(),
  payee: undefined,
  category: undefined,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: undefined,
  creditAmount: undefined,
  previouslySavedTransaction: false,
};

const transaction_invalid_category: FormTransaction = {
  id: "-1",
  date: new Date(),
  payee: undefined,
  category: {} as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: 1.23,
  creditAmount: undefined,
  previouslySavedTransaction: false,
};

const transaction_category_undefined: FormTransaction = {
  id: "-1",
  date: new Date(),
  payee: undefined,
  category: {} as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: 1.23,
  creditAmount: undefined,
  previouslySavedTransaction: false,
};

const transaction_valid_category: FormTransaction = {
  id: "-1",
  date: new Date(),
  payee: undefined,
  category: { name: "Shopping" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: undefined,
  creditAmount: 9.99,
  previouslySavedTransaction: false,
};

const transaction_blank_category_name: FormTransaction = {
  id: "-1",
  date: new Date(),
  payee: undefined,
  category: { name: "" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: undefined,
  creditAmount: 1.01,
  previouslySavedTransaction: false,
};

const transaction_undefined_amoounts: FormTransaction = {
  id: "-1",
  date: new Date(),
  payee: undefined,
  category: { name: "Shopping" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: undefined,
  creditAmount: undefined,
  previouslySavedTransaction: false,
};

const transaction_debit_ok_credit_undefined: FormTransaction = {
  id: "-1",
  date: new Date(),
  payee: undefined,
  category: { name: "Shopping" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: 4.55,
  creditAmount: undefined,
  previouslySavedTransaction: false,
};

const transaction_credit_ok_debit_undefined: FormTransaction = {
  id: "-1",
  date: new Date(),
  payee: undefined,
  category: { name: "Shopping" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: undefined,
  creditAmount: 11.23,
  previouslySavedTransaction: false,
};

const transaction_defined_credit_and_debit_amoounts: FormTransaction = {
  id: "-1",
  date: new Date(),
  payee: undefined,
  category: { name: "Shopping" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: 17.99,
  creditAmount: 11.23,
  previouslySavedTransaction: false,
};

const accountTransactions_selected_empty: NewTransactionsFormData = {
  accountTransactions: [
    {
      bankAccount: { id: 1881 } as BankAccount,
      transactions: [
        {
          id: "-1",
          date: new Date(),
          memo: "some memo",
          amount: undefined,
          creditAmount: undefined,
          debitAmount: 16.99,
          previouslySavedTransaction: true,
          category: undefined,
        },
      ],
      selectedTransactions: [],
    },
  ],
};

const accountTransactionsValid: NewTransactionsFormData = {
  accountTransactions: [
    {
      bankAccount: { id: 1881 } as BankAccount,
      transactions: [
        {
          id: "1",
          date: new Date(),
          memo: "some memo",
          amount: undefined,
          creditAmount: undefined,
          debitAmount: 16.99,
          previouslySavedTransaction: true,
          category: { id: 1, name: "category name" } as Category,
        },
        {
          id: "2",
          date: new Date(),
          memo: "some memo",
          amount: undefined,
          creditAmount: undefined,
          debitAmount: 16.99,
          previouslySavedTransaction: false,
          category: { id: 1, name: "category name" } as Category,
        },
      ],
      selectedTransactions: ["1", "2"],
    },
    {
      bankAccount: { id: 1882 } as BankAccount,
      transactions: [
        {
          id: "11",
          date: new Date(),
          memo: "some memo",
          amount: undefined,
          creditAmount: undefined,
          debitAmount: 16.99,
          previouslySavedTransaction: true,
          category: { id: 1, name: "category name" } as Category,
        },
      ],
      selectedTransactions: ["11"],
    },
  ],
};

const accountTransactions_selected_one_of_two: NewTransactionsFormData = {
  accountTransactions: [
    {
      bankAccount: { id: 1881 } as BankAccount,
      transactions: [
        {
          id: "1",
          date: new Date(),
          memo: "some memo",
          amount: undefined,
          creditAmount: undefined,
          debitAmount: 16.99,
          previouslySavedTransaction: true,
          category: undefined,
        },
        {
          id: "2",
          date: new Date(),
          memo: "some memo",
          amount: undefined,
          creditAmount: undefined,
          debitAmount: 16.99,
          previouslySavedTransaction: true,
          category: undefined,
        },
      ],
      selectedTransactions: ["2"],
    },
  ],
};

describe("Single Transaction", () => {
  describe("validate category", () => {
    test("validates missing category correctly", async () => {
      let error;

      const data = { ...transaction_undefined, creditAmount: 22.22 };

      // let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(data);

      // expect(validTransaction).toBe(false);

      try {
        await TRANSACTION_VALIDATION_SCHEMA.validate(data, {
          abortEarly: false,
        });
      } catch (err: any) {
        error = err;
      }
      expect(error).toBeDefined();

      expect(error.errors.length).toEqual(1);
      console.log("Errors: ", error.errors);
      expect(error.errors[0]).toBe("Category is required");
    });

    test("validates missing category name", async () => {
      let error;

      let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
        transaction_invalid_category
      );
      expect(validTransaction).toBe(false);

      try {
        await TRANSACTION_VALIDATION_SCHEMA.validate(
          transaction_invalid_category
        );
      } catch (err: any) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors.length).toEqual(1);
      expect(error.errors[0]).toBe("Category with 'name' is required");
    });

    test("validates blank category name", async () => {
      let error;

      let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
        transaction_blank_category_name
      );
      expect(validTransaction).toBe(false);

      try {
        await TRANSACTION_VALIDATION_SCHEMA.validate(
          transaction_blank_category_name
        );
      } catch (err: any) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors.length).toEqual(1);
      expect(error.errors[0]).toBe("Category with 'name' is required");
    });

    test("validates correct category", async () => {
      let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
        transaction_valid_category
      );
      expect(validTransaction).toBe(true);
    });

    test("validates undefined category", async () => {
      let error;

      let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
        transaction_category_undefined
      );
      expect(validTransaction).toBe(false);

      try {
        await TRANSACTION_VALIDATION_SCHEMA.validate(
          transaction_category_undefined
        );
      } catch (err: any) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors.length).toEqual(1);
      expect(error.errors[0]).toBe("Category with 'name' is required");
    });
  });

  describe("validate debit/credit amounts", () => {
    test("validates missing debit/credit amounts", async () => {
      let error;

      let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
        transaction_undefined_amoounts
      );
      expect(validTransaction).toBe(false);

      try {
        await TRANSACTION_VALIDATION_SCHEMA.validate(
          transaction_undefined_amoounts
        );
      } catch (err: any) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors[0]).toBe(
        "Either debitAmount or creditAmount is required, but not both"
      );
    });

    test("validation pass when only debit amount", async () => {
      let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
        transaction_debit_ok_credit_undefined
      );
      expect(validTransaction).toBe(true);
    });

    test("validation pass when only credit amount", async () => {
      let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
        transaction_credit_ok_debit_undefined
      );
      expect(validTransaction).toBe(true);
    });

    test("validation fails when both debit and credit amounts provided", async () => {
      let error;

      let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
        transaction_defined_credit_and_debit_amoounts
      );
      expect(validTransaction).toBe(false);

      try {
        await TRANSACTION_VALIDATION_SCHEMA.validate(
          transaction_undefined_amoounts
        );
      } catch (err: any) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors[0]).toBe(
        "Either debitAmount or creditAmount is required, but not both"
      );
    });
  });
});

describe("validate account transactions", () => {
  test("❌ Should fail one selected (out of two) transaction as its missing category", async () => {
    // Two transactions are missing categories, but only one transaction should fail validation
    // because it is the only one that has been selected.

    await expect(
      NEW_TRANSACTIONS_FORM_DATA_SCHEMA.validate(
        accountTransactions_selected_one_of_two,
        {
          context: accountTransactions_selected_one_of_two,
          abortEarly: false, // Ensure all errors are collected
        }
      )
    ).rejects.toThrow("Category is required");
  });

  test("❌ Should fail all transactions as they are selected and missing category", async () => {
    // Two transactions are missing categories and both should fail validation
    // because both has been selected.

    let error;

    const data: NewTransactionsFormData = {
      accountTransactions: [
        {
          bankAccount: { id: 1881 } as BankAccount,
          transactions: [
            {
              id: "1",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
            {
              id: "2",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
          ],
          selectedTransactions: ["1", "2"],
        },
      ],
    };

    try {
      await NEW_TRANSACTIONS_FORM_DATA_SCHEMA.validate(data, {
        context: data,
        abortEarly: false,
      });
    } catch (err: any) {
      error = err;
    }
    expect(error).toBeDefined();

    expect(error.errors.length).toEqual(2);
    console.log("Errors: ", error.errors);
    expect(error.errors[0]).toBe("Category is required");
    expect(error.errors[1]).toBe("Category is required");
  });

  test("❌ Should fail transactions from different accounts - missing category", async () => {
    // Two transactions are missing categories and both should fail validation
    // because both has been selected.

    let error;

    const data: NewTransactionsFormData = {
      accountTransactions: [
        {
          bankAccount: { id: 1881 } as BankAccount,
          transactions: [
            {
              id: "1",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
            {
              id: "2",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
          ],
          selectedTransactions: ["1", "2"],
        },
        {
          bankAccount: { id: 1882 } as BankAccount,
          transactions: [
            {
              id: "12",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
            {
              id: "22",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
          ],
          selectedTransactions: ["12"],
        },
      ],
    };

    try {
      await NEW_TRANSACTIONS_FORM_DATA_SCHEMA.validate(data, {
        context: data,
        abortEarly: false,
      });
    } catch (err: any) {
      error = err;
    }
    expect(error).toBeDefined();

    console.log("Errors: ", error.errors);
    expect(error.errors.length).toEqual(3);
    expect(error.errors[0]).toBe("Category is required");
    expect(error.errors[1]).toBe("Category is required");
    expect(error.errors[2]).toBe("Category is required");
  });

  test("❌ Should fail transactions from different accounts - missing category and credit/debit amount", async () => {
    // Two transactions are missing categories and both should fail validation
    // because both has been selected.

    let error;

    const data: NewTransactionsFormData = {
      accountTransactions: [
        {
          bankAccount: { id: 1881 } as BankAccount,
          transactions: [
            {
              id: "1",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: undefined,
              previouslySavedTransaction: true,
              category: undefined,
            },
            {
              id: "2",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
          ],
          selectedTransactions: ["1", "2"],
        },
        {
          bankAccount: { id: 1882 } as BankAccount,
          transactions: [
            {
              id: "12",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
            {
              id: "22",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
          ],
          selectedTransactions: ["12"],
        },
      ],
    };

    try {
      await NEW_TRANSACTIONS_FORM_DATA_SCHEMA.validate(data, {
        context: data,
        abortEarly: false,
      });
    } catch (err: any) {
      error = err;
    }
    expect(error).toBeDefined();

    console.log("Errors: ", error.errors);
    expect(error.errors.length).toEqual(5);
    expect(error.errors[0]).toBe("Category is required");
    expect(error.errors[1]).toBe(
      "Either debitAmount or creditAmount is required, but not both"
    );
    expect(error.errors[2]).toBe(
      "Either debitAmount or creditAmount is required, but not both"
    );
    expect(error.errors[3]).toBe("Category is required");
    expect(error.errors[4]).toBe("Category is required");
  });

  test("❌ Should fail transactions from different accounts - as both credit and debit amounts are set", async () => {
    // Two transactions are missing categories and both should fail validation
    // because both has been selected.

    let error;

    const data: NewTransactionsFormData = {
      accountTransactions: [
        {
          bankAccount: { id: 1881 } as BankAccount,
          transactions: [
            {
              id: "1",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: 1.23,
              debitAmount: 4.56,
              previouslySavedTransaction: true,
              category: { id: 1, name: "category name" } as Category,
            },
            {
              id: "2",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: { id: 1, name: "category name" } as Category,
            },
          ],
          selectedTransactions: ["1", "2"],
        },
        {
          bankAccount: { id: 1882 } as BankAccount,
          transactions: [
            {
              id: "12",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: { id: 1, name: "category name" } as Category,
            },
            {
              // this transaction is not selected - hence should be ignored
              id: "22",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: undefined,
              previouslySavedTransaction: true,
              category: undefined,
            },
          ],
          selectedTransactions: ["12"],
        },
      ],
    };

    try {
      await NEW_TRANSACTIONS_FORM_DATA_SCHEMA.validate(data, {
        context: data,
        abortEarly: false,
      });
    } catch (err: any) {
      error = err;
    }
    expect(error).toBeDefined();

    console.log("Errors: ", error.errors);
    expect(error.errors.length).toEqual(2);
    expect(error.errors[0]).toBe(
      "Either debitAmount or creditAmount is required, but not both"
    );
    expect(error.errors[1]).toBe(
      "Either debitAmount or creditAmount is required, but not both"
    );
  });

  test("✅ Should pass when no transactions are selected (validation skipped)", async () => {
    // Given

    let error;

    const accountTransactions_nothing_selected: NewTransactionsFormData = {
      accountTransactions: [
        {
          bankAccount: { id: 1881 } as BankAccount,
          transactions: [
            {
              id: "1",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
            {
              id: "2",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
          ],
          selectedTransactions: [], // No transactions selected
        },
      ],
    };

    // When // Then
    await expect(
      NEW_TRANSACTIONS_FORM_DATA_SCHEMA.validate(
        accountTransactions_nothing_selected,
        {
          context: accountTransactions_nothing_selected,
        }
      )
    ).resolves.toBeDefined();

    // This will catch validation errors and allow us to assert on them later
    // try {
    //   await NEW_TRANSACTIONS_FORM_DATAS_SCHEMA.validate(
    //     accountTransactions_nothing_selected,
    //     {
    //       context: accountTransactions_nothing_selected,
    //       abortEarly: false, // Ensure all errors are collected
    //     }
    //   );
    // } catch (err: any) {
    //   error = err;
    // }
    // expect(error).toBeDefined();
    // expect(error.errors.length).toEqual(2);
    // expect(error.errors[0]).toBe("Category is required");
    // expect(error.errors[1]).toBe("Category is required");
  });

  test("✅ Should pass when all transactions are selected and all are valid", async () => {
    await expect(
      NEW_TRANSACTIONS_FORM_DATA_SCHEMA.validate(accountTransactionsValid, {
        context: accountTransactionsValid,
      })
    ).resolves.toBeDefined();
  });
});

describe.skip("TEST", () => {
  test("✅ Should pass", async () => {
    const data = {
      accountTransactions: [
        {
          bankAccount: { id: 1881 } as BankAccount,
          transactions: [
            {
              id: "123",
              date: new Date(),
              category: { name: "Auto" } as Category,
            },
            {
              id: "234",
              date: new Date(),
              name: undefined,
            },
          ],
          selectedTransactions: ["123"],
        },
      ],
    };

    await expect(
      NEW_TRANSACTIONS_FORM_DATA_SCHEMA.validate(data, {
        context: data,
      })
    ).resolves.toBeDefined();
  });

  test("✅ Should pass 1", async () => {
    const data = {
      accountTransactions: [
        {
          bankAccount: { id: 1881 } as BankAccount,
          transactions: [
            {
              id: "123",
              date: new Date(),
              category: { name: "Auto" } as Category,
            },
            {
              id: "234",
              date: new Date(),
            },
          ],
          selectedTransactions: ["123"],
        },
      ],
    };

    await expect(
      NEW_TRANSACTIONS_FORM_DATA_SCHEMA.validate(data, {
        context: data,
      })
    ).resolves.toBeDefined();
    // ).rejects.toThrow("Category is required");
  });

  test("❌ Should fail", async () => {
    const data: NewTransactionsFormData = {
      accountTransactions: [
        {
          bankAccount: { id: 1881 } as BankAccount,
          transactions: [
            {
              id: "1",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
            {
              id: "2",
              date: new Date(),
              memo: "some memo",
              amount: undefined,
              creditAmount: undefined,
              debitAmount: 16.99,
              previouslySavedTransaction: true,
              category: undefined,
            },
          ],
          selectedTransactions: ["2"],
        },
      ],
    };

    await expect(
      NEW_TRANSACTIONS_FORM_DATA_SCHEMA.validate(data, {
        context: data,
      })
    ).rejects.toThrow("Category is required");
  });
});
