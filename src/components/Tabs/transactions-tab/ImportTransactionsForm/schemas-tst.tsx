import * as Yup from "yup";
import { Category } from "../../../../model/category";
import {
  AccountWithTransactions,
  NewTransactionsFormData,
} from "../AddTransactionsForm/add-transactions-form";
import { FormTransaction } from "../add-transactions-utils";

const BankAccountSchema = Yup.object().shape({
  id: Yup.number().required("Bank account ID is required"),
});

const TransactionsSchema = Yup.array().of(
  Yup.object().shape({
    id: Yup.string().required("ID is required"),
    name: Yup.string().test(
      "name-is-required",
      "Name is required",
      function (name) {
        const { parent, options } = this;
        const parentId = parent.id;
        const context = options.context;

        let isNameValid = false;
        if (context) {
          context.accountTransactions.forEach((account: any) => {
            if (!account.selectedTransactions.includes(parentId)) {
              isNameValid = true;
            } else {
              isNameValid = name !== undefined && name?.trim().length > 0;
            }
          });
        }

        return isNameValid;
      }
    ),
    category: Yup.mixed<Category>()
      .nullable()
      .test("is-valid-category", "Category is required", function (value) {
        const { parent, options } = this;
        const parentId = parent.id;
        const context = options.context;

        let isCategoryValid = false;
        if (context) {
          context.accountTransactions.forEach((account: any) => {
            if (!account.selectedTransactions.includes(parentId)) {
              isCategoryValid = true;
            } else {
              isCategoryValid =
                value !== undefined &&
                value?.name !== undefined &&
                value?.name?.trim().length > 0;
            }
          });
        }

        return isCategoryValid;
      }),
  })
);

export const TEST_SCHEMA = Yup.object().shape({
  accountTransactions: Yup.array()
    .of(
      Yup.object().shape({
        bankAccount: BankAccountSchema.required("Bank aacount is required"),
        transactions: TransactionsSchema.required("Need to set some users"),
        selectedTransactions: Yup.array().required("Need to select some users"),
      })
    )
    .required("Pass account transactions, nothing to process"),
});
