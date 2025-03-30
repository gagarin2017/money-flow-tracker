import AccountTransaction from "./account-transaction";
import {
  EMPTY_FORM_TRANSACTION,
  FormTransaction,
} from "../add-transactions-utils";
import {
  ErrorMessage,
  FormikErrors,
  FormikHelpers,
  FormikProps,
  FormikTouched,
} from "formik";
import {
  AccountWithTransactions,
  NewTransactionsFormData,
} from "./add-transactions-form";
import { HEADER_ROW } from "../transactions-utils";
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import { ColumnsType, TableRowSelection } from "antd/es/table/interface";
import { useState } from "react";
import { Transaction } from "../../../../model/transaction";
import { getCategoryAsString } from "../../../../utils/category-helper";
import { getAmountAsFormatedString } from "../../../../utils/currency-helper";
import {
  getStringFromDateWFormatter,
  DATE_FORMAT_DD_MM_YYYY,
  getDateFromString,
  convertISODateToStringWithFormatter,
  getStringFromDate,
} from "../../../../utils/date-helper";
import BankAccount from "../../../../model/bank-account";
import { useImportTransactionsContext } from "../../../../context/import-transactions-context";
import { ImportTransactionsActionType } from "../../../../context/import-transactions-context-helpers/constants";
import EditTransactionForm from "../ImportTransactionsForm/edit-transaction-form";

interface ImportAccountTransactionsListProps {
  formikProps: FormikProps<NewTransactionsFormData>;
  bankAccountId: number;
  bankAccountIndex: number;
}

function ImportAccountTransactionsList({
  formikProps,
  bankAccountId,
  bankAccountIndex,
}: ImportAccountTransactionsListProps) {
  const columns: ColumnsType<FormTransaction> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (_: any, record: FormTransaction) => {
        return getStringFromDateWFormatter(record.date, DATE_FORMAT_DD_MM_YYYY);
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_: any, record: FormTransaction, index) => {
        let errorText: string | undefined;

        // Safely access formikProps.errors.accountTransactions
        const accountErrors = formikProps.errors.accountTransactions as
          | FormikErrors<AccountWithTransactions>[]
          | undefined;

        const categoryErrorArray =
          Array.isArray(accountErrors) &&
          accountErrors[bankAccountIndex]?.transactions &&
          Array.isArray(accountErrors[bankAccountIndex].transactions)
            ? accountErrors[bankAccountIndex].transactions
            : undefined;

        if (categoryErrorArray?.[index]) {
          const categoryError = categoryErrorArray[index];

          if (
            categoryError &&
            typeof categoryError === "object" &&
            "category" in categoryError
          ) {
            errorText = (categoryError as FormikErrors<FormTransaction>)
              .category;
          }
        }

        return (
          <div>
            <div>{getCategoryAsString(record.category)}</div>
            {errorText && <div style={{ color: "red" }}>{errorText}</div>}
          </div>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_: any, record: FormTransaction) => {
        return record.description?.name || undefined;
      },
    },
    {
      title: "Memo",
      dataIndex: "memo",
      key: "memo",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (_: any, record: FormTransaction) => {
        return record.tag?.name || undefined;
      },
    },
    {
      title: "Debit",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: FormTransaction) => {
        return record.debitAmount && record.debitAmount > 0 ? (
          <span style={{ color: "red" }}>
            {getAmountAsFormatedString(record.debitAmount)}
          </span>
        ) : (
          <></>
        );
      },
    },
    {
      title: "Credit",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: FormTransaction) => {
        return record.creditAmount && record.creditAmount > 0 ? (
          <span style={{ color: "green" }}>
            {getAmountAsFormatedString(record.creditAmount)}
          </span>
        ) : (
          <></>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: FormTransaction) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleTransactionEdit(record)}
            disabled={record.previouslySavedTransaction}
          >
            Edit
          </Button>
          {record.previouslySavedTransaction && (
            <Tooltip title="This transaction has already been saved.">
              <Tag color="green">saved</Tag>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const { state, dispatch } = useImportTransactionsContext();

  function handleTransactionEdit(record: FormTransaction): void {
    record.bankAccountId = bankAccountId;

    dispatch({
      type: ImportTransactionsActionType.SET_EDITED_TRANSACTION,
      payload: record,
    });
    dispatch({
      type: ImportTransactionsActionType.EDIT_TXS_FORM_VISIBLE,
      payload: true,
    });
  }

  // Access form values from FormikProps
  const accountTransactions = formikProps.values.accountTransactions.find(
    (accTransactions) => accTransactions.bankAccount?.id === bankAccountId
  );

  const updateSelectedAccountTransactions = (
    accountIndex: number | undefined,
    newSelected: React.Key[]
  ) => {
    if (accountIndex) {
      // Ensure accountTransactions is found before updating
      if (accountTransactions) {
        // Create a copy of the accountTransactions array
        const updatedAccountTransactions =
          formikProps.values.accountTransactions.map((account) =>
            account.bankAccount?.id === bankAccountId
              ? { ...account, selectedTransactions: newSelected }
              : account
          );

        // Use setFieldValue to update accountTransactions
        formikProps.setFieldValue(
          "accountTransactions",
          updatedAccountTransactions
        );
      } else {
        console.error("AccountTransactions not found");
      }
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    updateSelectedAccountTransactions(bankAccountId, newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<FormTransaction> = {
    selectedRowKeys: accountTransactions?.selectedTransactions,
    onChange: onSelectChange,
    getCheckboxProps: (record: FormTransaction) => ({
      disabled: record.previouslySavedTransaction === true,
      name: String(record.previouslySavedTransaction),
    }),
  };

  return (
    <>
      <Table<FormTransaction>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={accountTransactions?.transactions}
        rowKey="id"
      />
    </>
  );
}

export default ImportAccountTransactionsList;
