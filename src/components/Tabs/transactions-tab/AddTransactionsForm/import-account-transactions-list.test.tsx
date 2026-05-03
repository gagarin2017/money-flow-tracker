import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Formik } from "formik";
import BankAccount from "../../../../model/bank-account";
import { Category } from "../../../../model/category";
import { Description } from "../../../../model/description";
import { Tag } from "../../../../model/tag";
import { setMatchMedia } from "../../../test-helper";
import { FormTransaction } from "../add-transactions-utils";
import ImportAccountTransactionsList from "./import-account-transactions-list";
import { NewTransactionsFormData } from "./add-transactions-form";

jest.mock("../../../../context/import-transactions-context", () => ({
  useImportTransactionsContext: () => ({
    state: {},
    dispatch: jest.fn(),
  }),
}));

setMatchMedia();

const existingTransaction = {
  id: "existing-row",
  date: new Date("2025-03-14"),
  category: {
    id: 32,
    name: "Groceries",
    parentCategory: {
      id: 31,
      name: "Food & Dining",
      subCategories: [],
    },
    subCategories: [],
  } as Category,
  description: {
    id: 3,
    name: "Existing supermarket payment",
  } as Description,
  memo: "matched existing row",
  tag: { id: 2, name: "weekly shop" } as Tag,
  debitAmount: 12.34,
  creditAmount: undefined,
  previouslySavedTransaction: true,
} as FormTransaction;

const newTransaction = {
  id: "new-row",
  date: new Date("2025-03-15"),
  category: { id: 40, name: "Income", subCategories: [] } as Category,
  description: { id: 4, name: "New transfer" } as Description,
  memo: "brand new row",
  tag: { id: 5, name: "bonus" } as Tag,
  debitAmount: undefined,
  creditAmount: 25,
  previouslySavedTransaction: false,
} as FormTransaction;

test("displays existing filtered transactions as populated and disabled while new rows stay selected", () => {
  const initialValues: NewTransactionsFormData = {
    accountTransactions: [
      {
        bankAccount: { id: 42 } as BankAccount,
        transactions: [existingTransaction, newTransaction],
        selectedTransactions: [newTransaction.id],
      },
    ],
  };

  render(
    <Formik initialValues={initialValues} onSubmit={jest.fn()}>
      {(formikProps) => (
        <ImportAccountTransactionsList
          formikProps={formikProps}
          bankAccountId={42}
          bankAccountIndex={0}
        />
      )}
    </Formik>
  );

  expect(screen.getByText("Food & Dining : Groceries")).toBeInTheDocument();
  expect(screen.getByText("Existing supermarket payment")).toBeInTheDocument();
  expect(screen.getByText("weekly shop")).toBeInTheDocument();
  expect(screen.getByText("saved")).toBeInTheDocument();

  const rowCheckboxes = screen.getAllByRole("checkbox").slice(1);

  expect(rowCheckboxes[0]).toBeDisabled();
  expect(rowCheckboxes[1]).not.toBeDisabled();
  expect(rowCheckboxes[1]).toBeChecked();
});
