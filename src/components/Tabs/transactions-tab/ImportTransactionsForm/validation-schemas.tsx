import * as Yup from "yup";
import { Category } from "../../../../model/category";

export const TRANSACTION_VALIDATION_SCHEMA = Yup.object().shape({
  id: Yup.number().required("ID is required"),
  date: Yup.string().nullable().required("Date is required"),
  payee: Yup.object().nullable(),
  category: Yup.mixed<Category>()
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
  description: Yup.object().nullable(),
  memo: Yup.string().nullable(),
  tag: Yup.object().nullable(),
  amount: Yup.number().nullable(),
  debitAmount: Yup.number()
    .nullable()
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
    .nullable()
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
});

export const ACC_TRXS_VALID_SCHEMA = Yup.object().shape({
  accountTransactions: Yup.array().of(
    Yup.object().shape({
      transactions: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().required("ID is required"),
          date: Yup.string().nullable().required("Date is required"),
          payee: Yup.object().nullable(),
          category: Yup.mixed<Category>()
            .required("Category is required")
            .test(
              "is-valid-category",
              "Category with 'name' is required",
              function (value) {
                return (
                  value != null &&
                  value.name != null &&
                  value.name.trim().length !== 0
                );
              }
            ),
          description: Yup.object().nullable(),
          memo: Yup.string().nullable(),
          tag: Yup.object().nullable(),
          amount: Yup.number().nullable(),
          debitAmount: Yup.number()
            .nullable()
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
            .nullable()
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
        })
      ),
    })
  ),
});
