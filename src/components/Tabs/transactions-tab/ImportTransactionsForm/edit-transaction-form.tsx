import { Alert, Space } from "antd";
import { Formik, FormikHelpers } from "formik";
import FormsModal from "../../../../UI/forms-modal";
import { useBankAccountsContext } from "../../../../context/bank-accounts-context";
import { useImportTransactionsContext } from "../../../../context/import-transactions-context";
import { ImportTransactionsActionType } from "../../../../context/import-transactions-context-helpers/constants";
import BankAccountTitle from "../../../BankAccounts/bank-account-title";
import AccountTransaction from "../AddTransactionsForm/account-transaction";
import { AccountWithTransactions } from "../AddTransactionsForm/add-transactions-form";
import {
  EMPTY_FORM_TRANSACTION,
  FormTransaction,
} from "../add-transactions-utils";
import { HEADER_ROW } from "../transactions-utils";
import _ from "lodash";

const CUSTOM_WIDTH = 1450;

function EditTransactionForm() {
  const { state, dispatch } = useImportTransactionsContext();
  const { bankAccounts } = useBankAccountsContext();

  const transaction = state.editedTransaction;

  const bankAccount = bankAccounts.find(
    (bankAccount) => bankAccount.id === transaction?.bankAccountId
  );

  const handleFormClose = () => {
    dispatch({
      type: ImportTransactionsActionType.EDIT_TXS_FORM_VISIBLE,
      payload: false,
    });
  };

  const onSubmit = async (
    formTransaction: FormTransaction,
    { resetForm }: FormikHelpers<FormTransaction>
  ) => {
    console.log("Saving form: ", formTransaction);

    handleEditedTransaction(formTransaction);

    resetForm();
    handleFormClose();
  };

  const handleEditedTransaction = (updatedTransaction: FormTransaction) => {
    const updatedAccountTransactions =
      updatedTransaction.bankAccountId &&
      updateFormTransactionInSpecificAccount(
        state.filteredTansactions,
        updatedTransaction,
        updatedTransaction.bankAccountId
      );

    console.log("Saving to xontext: ", updatedAccountTransactions);

    if (updatedAccountTransactions) {
      dispatch({
        type: ImportTransactionsActionType.ADD_FILTERED_TRANSACTIONS,
        payload: updatedAccountTransactions,
      });
    }
  };

  function updateFormTransactionInSpecificAccount(
    accountTransactions: AccountWithTransactions[],
    updatedTransaction: Partial<FormTransaction> & { id: string },
    targetBankAccountId: number
  ): AccountWithTransactions[] {
    return accountTransactions.map((account) => {
      if (
        account.bankAccount &&
        account.bankAccount.id === targetBankAccountId
      ) {
        const updatedTransactions = account.transactions.map((transaction) => {
          if (transaction.id === updatedTransaction.id) {
            // Check if debitAmount or creditAmount has been updated and is undefined
            if (updatedTransaction.debitAmount === undefined) {
              transaction = _.omit(transaction, ["debitAmount"]);
            }

            if (updatedTransaction.creditAmount === undefined) {
              // Remove the property from the transaction object, since it's not defined
              transaction = _.omit(transaction, ["creditAmount"]);
            }
            return {
              ...transaction,
              ...updatedTransaction,
            };
          }
          return transaction;
        });

        return {
          ...account,
          transactions: updatedTransactions,
        };
      }
      return account;
    });
  }

  function getInitialValues(): FormTransaction {
    let initialTransaction: FormTransaction = EMPTY_FORM_TRANSACTION;

    if (transaction) {
      initialTransaction = {
        id: transaction.id,
        bankAccountId: transaction.bankAccountId,
        date: transaction.date,
        payee: transaction.payee,
        category: transaction.category,
        description: transaction.description,
        memo: transaction.memo,
        tag: transaction.tag,
        debitAmount: transaction.debitAmount,
        creditAmount: transaction.creditAmount,
      };
    }

    console.log("Initial value: ", initialTransaction);
    return initialTransaction;
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={getInitialValues()}
      onSubmit={(
        values: FormTransaction,
        handleReset: FormikHelpers<FormTransaction>
      ) => {
        onSubmit(values, handleReset);
      }}
      // validationSchema={TRANSACTION_VALIDATION_SCHEMA}
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
          title={"Edit transactions"}
          isModalVisible={state.isEditTransactionsFormVisible}
          handleCancel={() => {
            handleReset();
            handleFormClose();
          }}
          customWidth={CUSTOM_WIDTH}
          handleOk={handleSubmit}
          isLoading={false}
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
              transaction={values}
              accountIndex={bankAccount === undefined ? -21 : bankAccount.id}
              txIndex={values.id}
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

export default EditTransactionForm;
