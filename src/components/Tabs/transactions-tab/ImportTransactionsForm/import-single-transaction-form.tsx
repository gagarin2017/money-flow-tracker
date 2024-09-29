import { Alert, Space } from "antd";
import { Formik, FormikHelpers } from "formik";
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
import AccountTransaction from "../AddTransactionsForm/account-transaction";
import {
  EMPTY_FORM_TRANSACTION,
  FormTransaction,
} from "../add-transactions-utils";
import { HEADER_ROW } from "../transactions-utils";
import { TRANSACTION_VALIDATION_SCHEMA } from "./validation-schemas";

const CUSTOM_WIDTH = 1450;

function ImportSingleTransactionForm() {
  const { state, dispatch } = useImportTransactionsContext();
  const { isLoading, saveTransactions } = useTransactionsContext();
  const { bankAccounts, selectedBankAccountId, fetchBankAccounts } =
    useBankAccountsContext();

  const bankAccount = bankAccounts.find(
    (bankAccount) => bankAccount.id === selectedBankAccountId
  );

  const handleFormClose = () => {
    dispatch({
      type: ImportTransactionsActionType.IMPORT_SINGLE_TXS_FORM_VISIBLE,
      payload: false,
    });
  };

  const onSubmit = async (
    formTransaction: FormTransaction,
    { resetForm }: FormikHelpers<FormTransaction>
  ) => {
    const transactionToSave: Transaction = {
      id: -1,
      bankAccount: bankAccount,
      date:
        formTransaction.date &&
        getDateFromStringWFormatter(
          formTransaction.date,
          DATE_FORMAT_DD_MM_YYYY
        ),
      description: formTransaction.description,
      category: {
        id: formTransaction.category?.id,
        name: formTransaction.category?.name,
        subCategories: formTransaction.category?.subCategories,
      } as Category,
      memo: formTransaction.memo,
      tag: formTransaction.tag,
      debitAmount: formTransaction.debitAmount,
      creditAmount: formTransaction.creditAmount,
      amount: formTransaction.amount,
      runningBalance: 0,
    } as Transaction;

    saveTransactions([transactionToSave]);

    // refresh accounts with the latest balances
    await fetchBankAccounts();

    resetForm();
    handleFormClose();
  };

  return (
    <Formik
      initialValues={EMPTY_FORM_TRANSACTION}
      onSubmit={(
        values: FormTransaction,
        handleReset: FormikHelpers<FormTransaction>
      ) => {
        onSubmit(values, handleReset);
      }}
      validationSchema={TRANSACTION_VALIDATION_SCHEMA}
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
          <>
            <Alert
              message={
                <Space>
                  {"Add new transaction for "}
                  <BankAccountTitle bankAccount={bankAccount} />
                </Space>
              }
              type="info"
              showIcon
              style={{ marginBottom: 10 }}
            />
            {HEADER_ROW}
            <AccountTransaction
              transaction={EMPTY_FORM_TRANSACTION}
              accountIndex={bankAccount === undefined ? -21 : bankAccount.id}
              txIndex={EMPTY_FORM_TRANSACTION.id}
              isDateEditable={true}
              dateField="date"
              payeeFieldName="payee"
              categoryFieldName="category"
              descriptionFieldName="description"
              tagFieldName="tag"
              debitAmountFieldName="debitAmount"
              creditAmountFieldName="creditAmount"
              memoFieldName="memo"
            />
          </>
        </FormsModal>
      )}
    </Formik>
  );
}

export default ImportSingleTransactionForm;
