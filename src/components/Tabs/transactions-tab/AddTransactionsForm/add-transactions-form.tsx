import { Collapse, CollapseProps } from "antd";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import FormsModal from "../../../../UI/forms-modal";
import { useBankAccountsContext } from "../../../../context/bank-accounts-context";
import { useImportTransactionsContext } from "../../../../context/import-transactions-context";
import { ImportTransactionsActionType } from "../../../../context/import-transactions-context-helpers/constants";
import { useTransactionsContext } from "../../../../context/transactions-context";
import BankAccount from "../../../../model/bank-account";
import ImportTransactionsEmptyList from "../ImportTransactionsForm/import-transactions-empty-list";
import {
  EMPTY_FORM_TRANSACTION,
  FormTransaction,
} from "../add-transactions-utils";
import ImportAccountTransactionsList from "./import-account-transactions-list";
import BankAccountTitle from "../../../BankAccounts/bank-account-title";
import EditTransactionForm from "../ImportTransactionsForm/edit-transaction-form";
import { Category } from "../../../../model/category";
import { Description } from "../../../../model/description";
import { Transaction } from "../../../../model/transaction";
import { getDateFromString } from "../../../../utils/date-helper";
import { NEW_TRANSACTIONS_FORM_DATA_SCHEMA } from "../ImportTransactionsForm/validation-schemas";

export interface AccountWithTransactions {
  bankAccount: BankAccount | undefined;
  transactions: FormTransaction[];
  selectedTransactions: React.Key[];
}

export interface NewTransactionsFormData {
  accountTransactions: AccountWithTransactions[];
}

const AddTransactionsForm = () => {
  const { state, dispatch } = useImportTransactionsContext();
  const { saveTransactions } = useTransactionsContext();
  const { fetchBankAccounts, bankAccounts } = useBankAccountsContext();

  const filteredTransactions: AccountWithTransactions[] =
    state.filteredTansactions;

  const getInitialValue = () => {
    let initialForm = {} as NewTransactionsFormData;

    if (filteredTransactions && filteredTransactions.length > 0) {
      initialForm = {
        accountTransactions: filteredTransactions.map((accountTransactions) => {
          // Filter out previously saved transactions
          const filteredTransactions = accountTransactions.transactions.filter(
            (tx) => !tx.previouslySavedTransaction
          );

          return {
            bankAccount: bankAccounts.find(
              (acc) => acc.id === accountTransactions.bankAccount?.id
            ),
            transactions: accountTransactions.transactions,
            selectedTransactions: filteredTransactions.map((tx) => tx.id),
          };
        }),
      };
    } else {
      initialForm = {
        accountTransactions: [
          {
            bankAccount: { id: 1, bankName: "empty bank acc" } as BankAccount,
            transactions: [EMPTY_FORM_TRANSACTION],
            selectedTransactions: [],
          },
        ],
      };
    }

    return initialForm;
  };

  const handleFormClose = () => {
    dispatch({
      type: ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE,
      payload: false,
    });
  };

  const onSubmit = async (
    formValues: NewTransactionsFormData,
    { resetForm }: FormikHelpers<NewTransactionsFormData>
  ) => {
    console.log("poop transactions from the form:", formValues);

    const transactionsToSave: Transaction[] = [];

    formValues.accountTransactions.forEach((formAccountTransactions) => {
      formAccountTransactions.transactions.forEach((formTransaction) => {
        if (
          formAccountTransactions.selectedTransactions.includes(
            formTransaction.id
          )
        ) {
          transactionsToSave.push({
            id: -1,
            bankAccount: formAccountTransactions.bankAccount,
            date: formTransaction.date,
            description: {
              id: formTransaction.description?.id,
              name: "",
            } as Description,
            category: { id: formTransaction.category?.id } as Category,
            memo: formTransaction.memo,
            tag: formTransaction.tag,
            debitAmount: formTransaction.debitAmount,
            creditAmount: formTransaction.creditAmount,
            runningBalance: null,
          } as Transaction);
        }
      });
    });

    saveTransactions(transactionsToSave);

    // refresh accounts with the latest balances
    await fetchBankAccounts();

    resetForm();
    handleFormClose();
  };

  const isNewTransactionsListEmpty =
    filteredTransactions && filteredTransactions.length === 0;

  const accountTransactionSection = (
    formikProps: FormikProps<NewTransactionsFormData>
  ) => {
    const items: CollapseProps["items"] =
      formikProps.values.accountTransactions.map(
        (
          accTransactions: AccountWithTransactions,
          bankAccountIndex: number
        ) => ({
          key: bankAccountIndex,
          label: (
            <BankAccountTitle
              bankAccount={accTransactions.bankAccount}
              numberOfTransactions={accTransactions.transactions.length}
            />
          ),
          children: (
            <>
              {accTransactions.transactions.length > 0 &&
              accTransactions.bankAccount?.id ? (
                <ImportAccountTransactionsList
                  formikProps={formikProps}
                  bankAccountId={accTransactions.bankAccount.id}
                  bankAccountIndex={bankAccountIndex}
                />
              ) : (
                // <AccountTransactionsList
                //   accountIndex={index}
                //   transactions={accTransactions.transactions}
                //   errors={errors}
                //   touched={touched}
                // />
                <ImportTransactionsEmptyList />
              )}
            </>
          ),
        })
      );

    return <Collapse items={items} defaultActiveKey={["0"]} />;
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={getInitialValue()}
        onSubmit={(values, handleReset) => {
          onSubmit(values, handleReset);
        }}
        validateOnChange={false}
        validationSchema={NEW_TRANSACTIONS_FORM_DATA_SCHEMA}
        validateOnMount={false}
      >
        {(formikProps) => (
          <FormsModal
            title={`Importing Transactions`}
            isModalVisible={state.isAddTransactionsFormModalVisible}
            handleOk={formikProps.handleSubmit}
            handleCancel={() => {
              formikProps.handleReset();
              handleFormClose();
            }}
            customWidth={1500}
            isLoading={formikProps.isSubmitting}
          >
            <>
              {Object.keys(formikProps.errors).length > 0 && (
                <>
                  {console.log("Form ahs errors: ", formikProps.errors)}
                  <h2>Fix the errors, before submitting</h2>
                </>
              )}
              <Form>
                {isNewTransactionsListEmpty ? (
                  <ImportTransactionsEmptyList />
                ) : (
                  accountTransactionSection(formikProps)
                )}
              </Form>
            </>
          </FormsModal>
        )}
      </Formik>
      {state.editedTransaction && <EditTransactionForm />}
    </>
  );
};

export default AddTransactionsForm;
