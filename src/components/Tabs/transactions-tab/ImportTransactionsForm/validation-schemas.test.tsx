import * as Yup from "yup";
import { TRANSACTION_VALIDATION_SCHEMA } from "./validation-schemas";
import { FormTransaction } from "../add-transactions-utils";
import { Category } from "../../../../model/category";

const transaction_undefined: FormTransaction = {
  id: -1,
  date: "the date",
  payee: undefined,
  category: undefined,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: undefined,
  creditAmount: undefined,
};

const transaction_invalid_category: FormTransaction = {
  id: -1,
  date: "the date",
  payee: undefined,
  category: {} as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: 1.23,
  creditAmount: undefined,
};

const transaction_valid_category: FormTransaction = {
  id: -1,
  date: "the date",
  payee: undefined,
  category: { name: "Shopping" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: undefined,
  creditAmount: 9.99,
};

const transaction_blank_category_name: FormTransaction = {
  id: -1,
  date: "the date",
  payee: undefined,
  category: { name: "" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: undefined,
  creditAmount: 1.01,
};

const transaction_undefined_amoounts: FormTransaction = {
  id: -1,
  date: "the date",
  payee: undefined,
  category: { name: "Shopping" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: undefined,
  creditAmount: undefined,
};

const transaction_defined_debit_amoount_only: FormTransaction = {
  id: -1,
  date: "the date",
  payee: undefined,
  category: { name: "Shopping" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: 4.55,
  creditAmount: undefined,
};

const transaction_defined_credit_amoount_only: FormTransaction = {
  id: -1,
  date: "the date",
  payee: undefined,
  category: { name: "Shopping" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: undefined,
  creditAmount: 11.23,
};

const transaction_defined_credit_and_debit_amoounts: FormTransaction = {
  id: -1,
  date: "the date",
  payee: undefined,
  category: { name: "Shopping" } as Category,
  description: undefined,
  memo: undefined,
  tag: undefined,
  amount: undefined,
  debitAmount: 17.99,
  creditAmount: 11.23,
};

describe("validate category", () => {
  test("validates missing category correctly", async () => {
    let error;

    let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
      transaction_undefined
    );
    expect(validTransaction).toBe(false);

    try {
      await TRANSACTION_VALIDATION_SCHEMA.validate(transaction_undefined);
    } catch (err: any) {
      error = err;
    }
    expect(error).toBeDefined();
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
    expect(error.errors[0]).toBe("Category with 'name' is required");
  });

  test("validates correct category", async () => {
    let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
      transaction_valid_category
    );
    expect(validTransaction).toBe(true);
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
      transaction_defined_debit_amoount_only
    );
    expect(validTransaction).toBe(true);
  });

  test("validation pass when only credit amount", async () => {
    let validTransaction = await TRANSACTION_VALIDATION_SCHEMA.isValid(
      transaction_defined_credit_amoount_only
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

// test("validates age correctly", async () => {
//   // Test with a valid age
//   let validAge = await TRANSACTION_VALIDATION_SCHEMA.isValid(
//     transaction_undefined
//   );
//   expect(validAge).toBe(true);

//   //   // Test with an invalid age
//   //   let invalidAge = await TRANSACTION_VALIDATION_SCHEMA.isValid({ age: 16 });
//   //   expect(invalidAge).toBe(false);
// });
