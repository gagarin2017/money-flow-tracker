import * as Yup from "yup";
import { Category } from "../../../../../model/category";
import {
  AccountWithTransactions,
  NewTransactionsFormData,
} from "../../AddTransactionsForm/add-transactions-form";
import { FormTransaction } from "../../add-transactions-utils";
import { Key } from "react";

export const TRANSACTION_VALIDATION_SCHEMA = Yup.object().shape({
  id: Yup.string().required("ID is required"),
  date: Yup.date().required("Date is required"),
  payee: Yup.object().optional(),
  category: Yup.mixed<Category>()
    .nullable()
    .required("Category is required")
    .test(
      "is-valid-category",
      "Category with 'name' is required",
      function (value) {
        return (
          value != null && value.name != null && value.name.trim().length !== 0
        );
      }
    ),
  description: Yup.object().optional(),
  memo: Yup.string().optional(),
  tag: Yup.object().optional(),
  amount: Yup.number().optional(),
  debitAmount: Yup.number()
    .optional()
    .test(
      "debitOrCreditRequired",
      "Either debitAmount or creditAmount is required, but not both",
      function (value) {
        const creditAmount = this.parent.creditAmount;
        return (
          (value !== undefined && creditAmount === undefined) ||
          (value === undefined && creditAmount !== undefined)
        );
      }
    ),
  creditAmount: Yup.number()
    .optional()
    .test(
      "debitOrCreditRequired",
      "Either debitAmount or creditAmount is required, but not both",
      function (value) {
        const debitAmount = this.parent.debitAmount;
        return (
          (value !== undefined && debitAmount === undefined) ||
          (value === undefined && debitAmount !== undefined)
        );
      }
    ),
  previouslySavedTransaction: Yup.boolean().required(),
});

const BankAccountSchema = Yup.object().shape({
  id: Yup.number().required("Bank account ID is required"),
});

const TransactionsSchema = Yup.array().of(
  Yup.object().shape({
    id: Yup.string().required("ID is required"),
    date: Yup.date().required("Transaction's date must be set"),
    // name: Yup.string().test(
    //   "name-is-required",
    //   "Name is required",
    //   function (name) {
    //     const { parent, options } = this;
    //     const parentId = parent.id;
    //     const context = options.context;

    //     let isNameValid = false;
    //     if (context) {
    //       context.accountTransactions.forEach((account: any) => {
    //         if (!account.selectedTransactions.includes(parentId)) {
    //           isNameValid = true;
    //         } else {
    //           isNameValid = name !== undefined && name?.trim().length > 0;
    //         }
    //       });
    //     }

    //     return isNameValid;
    //   }
    // ),
    category: Yup.mixed<Category>()
      .nullable()
      .test("is-valid-category", "Category is required", function (value) {
        const { parent, options } = this;
        const parentId = parent.id;
        const context = options.context;

        let isCategoryValid = false;
        if (context) {
          const selectedTransactionsAllAccounts: React.Key[] =
            context.accountTransactions.flatMap(
              (accTransactions: AccountWithTransactions) =>
                accTransactions.selectedTransactions
            );

          if (!selectedTransactionsAllAccounts.includes(parentId)) {
            isCategoryValid = true;
          } else {
            isCategoryValid =
              value !== undefined &&
              value?.name !== undefined &&
              value?.name?.trim().length > 0;
          }
        }

        return isCategoryValid;
      }),
    debitAmount: Yup.number()
      .optional()
      .test(
        "debitOrCreditRequired",
        "Either debitAmount or creditAmount is required, but not both",
        function (value) {
          const { parent, options } = this;
          const parentId = parent.id;
          const context = options.context;

          const creditAmount = this.parent.creditAmount;

          let isDebitAmountValid = false;

          if (context) {
            const selectedTransactionsAllAccounts: React.Key[] =
              context.accountTransactions.flatMap(
                (accTransactions: AccountWithTransactions) =>
                  accTransactions.selectedTransactions
              );

            if (!selectedTransactionsAllAccounts.includes(parentId)) {
              isDebitAmountValid = true;
            } else {
              isDebitAmountValid =
                (value !== undefined && creditAmount === undefined) ||
                (value === undefined && creditAmount !== undefined);
            }
          }

          return isDebitAmountValid;
        }
      ),
    creditAmount: Yup.number()
      .optional()
      .test(
        "debitOrCreditRequired",
        "Either debitAmount or creditAmount is required, but not both",
        function (value) {
          const { parent, options } = this;
          const parentId = parent.id;
          const context = options.context;

          const debitAmount = this.parent.debitAmount;
          let isCreditAmountValid = false;
          if (context) {
            const selectedTransactionsAllAccounts: React.Key[] =
              context.accountTransactions.flatMap(
                (accTransactions: AccountWithTransactions) =>
                  accTransactions.selectedTransactions
              );

            if (!selectedTransactionsAllAccounts.includes(parentId)) {
              isCreditAmountValid = true;
            } else {
              isCreditAmountValid =
                (value !== undefined && debitAmount === undefined) ||
                (value === undefined && debitAmount !== undefined);
            }
          }

          return isCreditAmountValid;
        }
      ),
  })
);

const ACCOUNTS_WITH_TRANSACTIONS_SCHEMA = Yup.object().shape({
  bankAccount: BankAccountSchema.required("Bank aacount is required"),
  transactions: TransactionsSchema.required("Need to set some users"),
  selectedTransactions: Yup.array()
    .min(1, "Select transaction to be saved")
    .required("Need to select some users"),
});

export const NEW_TRANSACTIONS_FORM_DATA_SCHEMA = Yup.object().shape({
  accountTransactions: Yup.array()
    .of(ACCOUNTS_WITH_TRANSACTIONS_SCHEMA)
    .required("Account transactions are required"),
});
