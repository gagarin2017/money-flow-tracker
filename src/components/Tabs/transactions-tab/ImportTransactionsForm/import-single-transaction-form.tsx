import { Alert, Space } from "antd";
import {
  FieldArray,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikTouched,
} from "formik";
import { useEffect } from "react";
import FormsModal from "../../../../UI/forms-modal";
import { useBankAccountsContext } from "../../../../context/bank-accounts-context";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../context/import-transactions-context";
import { useTransactionsContext } from "../../../../context/transactions-context";
import { Category } from "../../../../model/category";
import { Transaction } from "../../../../model/transaction";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getDateFromStringWFormatter,
} from "../../../../utils/date-helper";
import BankAccountTitle from "../../../BankAccounts/bank-account-title";
import { isSpringBoot } from "../../../services/api-common";
import AccountTransactionsList from "../AddTransactionsForm/account-transaction-list";
import {
  ACC_TRXS_VALID_SCHEMA,
  AccountTransaction,
  NewTransactionsFormData,
} from "../AddTransactionsForm/add-transactions-form";
import {
  EMPTY_FORM_TRANSACTION,
  fetchPayeesCategoriesTags,
} from "../add-transactions-utils";

const CUSTOM_WIDTH = 1450;

function ImportSingleTransactionForm() {
  const { state, dispatch } = useImportTransactionsContext();
  const { isLoading, saveTransactions } = useTransactionsContext();
  const { bankAccounts, selectedBankAccountId, fetchBankAccounts } =
    useBankAccountsContext();

  // useEffect(() => {
  //   fetchPayeesCategoriesTags(isSpringBoot, dispatch);
  // }, []);

  const bankAccount = bankAccounts.find(
    (bankAccount) => bankAccount.id === selectedBankAccountId
  );

  const getInitialValues = () => {
    return {
      accountTransactions: [
        {
          bankAccount,
          transactions: [EMPTY_FORM_TRANSACTION],
        },
      ],
    };
  };

  const handleFormClose = () => {
    dispatch({
      type: ImportTransactionsActionType.IMPORT_SINGLE_TXS_FORM_VISIBLE,
      payload: false,
    });
  };

  const onSubmit = async (
    formValues: NewTransactionsFormData,
    { resetForm }: FormikHelpers<NewTransactionsFormData>
  ) => {
    const transactionsToSave: Transaction[] = [];

    formValues.accountTransactions.forEach((formData) => {
      formData.transactions.forEach((tx) => {
        transactionsToSave.push({
          id: -1,
          bankAccount: formData.bankAccount,
          date:
            tx.date &&
            getDateFromStringWFormatter(tx.date, DATE_FORMAT_DD_MM_YYYY),
          description: tx.description,
          category: {
            id: tx.category?.id,
            name: tx.category?.name,
            subCategories: tx.category?.subCategories,
          } as Category,
          memo: tx.memo,
          tag: tx.tag,
          debitAmount: tx.debitAmount,
          creditAmount: tx.creditAmount,
          amount: tx.amount,
          runningBalance: 0,
        } as Transaction);
      });
    });

    saveTransactions(transactionsToSave);

    // refresh accounts with the latest balances
    await fetchBankAccounts();

    resetForm();
    handleFormClose();
  };

  const accountTransactionSection = (
    values: NewTransactionsFormData,
    errors: FormikErrors<NewTransactionsFormData>,
    touched: FormikTouched<NewTransactionsFormData>
  ) => {
    return values.accountTransactions.map(
      (accTransactions: AccountTransaction, index: number) => (
        <AccountTransactionsList
          key={index}
          accountIndex={index}
          transactions={accTransactions.transactions}
          isDateEditable
          errors={errors}
          touched={touched}
        />
      )
    );
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      onSubmit={(
        values: NewTransactionsFormData,
        handleReset: FormikHelpers<NewTransactionsFormData>
      ) => {
        onSubmit(values, handleReset);
      }}
      validationSchema={ACC_TRXS_VALID_SCHEMA}
      validateOnMount={true}
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        handleReset,
        isSubmitting,
      }) => (
        <FormsModal
          title={"Import transactions"}
          isModalVisible={state.isImportSingleTransactionsFormVisible}
          handleCancel={() => {
            handleReset();
            handleFormClose();
          }}
          customWidth={CUSTOM_WIDTH}
          handleOk={handleSubmit}
          isLoading={isLoading}
        >
          <Alert
            message={
              <Space>
                {"New transactions for "}
                <BankAccountTitle bankAccount={bankAccount} />
              </Space>
            }
            type="info"
            showIcon
            style={{ marginBottom: 10 }}
          />
          <FieldArray name="accountTransactions">
            {() => <>{accountTransactionSection(values, errors, touched)}</>}
          </FieldArray>
        </FormsModal>
      )}
    </Formik>
  );
}

export default ImportSingleTransactionForm;
