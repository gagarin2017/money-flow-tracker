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

  const getInitialValue = () => {
    let initialForm = {} as NewTransactionsFormData;

    console.log(
      "add-transactions-form --> state.filteredTansactions: ",
      state.filteredTansactions
    );

    if (state.filteredTansactions && state.filteredTansactions.length > 0) {
      const result = state.filteredTansactions.map((filteredTransaction) => {
        const account = bankAccounts.find(
          (acc) => acc.id === filteredTransaction.bankAccount?.id
        );
        return {
          bankAccount: account,
          transactions: filteredTransaction.transactions,
          selectedTransactions: filteredTransaction.transactions.map(
            (tx) => tx.id
          ),
        } as AccountWithTransactions;
      });

      initialForm = {
        accountTransactions: result,
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

    // const transactionsToSave: Transaction[] = [];

    // formValues.accountTransactions.forEach((formData) => {
    //   formData.transactions.forEach((tx) => {
    //     transactionsToSave.push({
    //       id: -1,
    //       bankAccount: formData.bankAccount,
    //       date: tx.date && getDateFromString(tx.date),
    //       description: { id: tx.description?.id, name: "" } as Description,
    //       category: { id: tx.category?.id } as Category,
    //       memo: tx.memo,
    //       tag: tx.tag,
    //       debitAmount: tx.debitAmount,
    //       creditAmount: tx.creditAmount,
    //       runningBalance: null,
    //     } as Transaction);
    //   });
    // });

    // saveTransactions(transactionsToSave);

    // // refresh accounts with the latest balances
    // await fetchBankAccounts();

    resetForm();
    handleFormClose();
  };

  const isNewTransactionsListEmpty =
    state.filteredTansactions && state.filteredTansactions.length === 0;

  const accountTransactionSection = (
    formikProps: FormikProps<NewTransactionsFormData>
  ) => {
    const items: CollapseProps["items"] =
      formikProps.values.accountTransactions.map(
        (accTransactions: AccountWithTransactions, index: number) => ({
          key: index,
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
        // validateOnChange={false} // Do not validate on change
        // validationSchema={ACC_TRXS_VALID_SCHEMA}
        // validateOnMount={true}
      >
        {(formikProps) => (
          <FormsModal
            title={`Add new Transactions`}
            isModalVisible={state.isAddTransactionsFormModalVisible}
            handleOk={formikProps.handleSubmit}
            handleCancel={() => {
              formikProps.handleReset();
              handleFormClose();
            }}
            customWidth={1500}
            isLoading={formikProps.isSubmitting}
          >
            <Form>
              {isNewTransactionsListEmpty ? (
                <ImportTransactionsEmptyList />
              ) : (
                accountTransactionSection(formikProps)
              )}
            </Form>
          </FormsModal>
        )}
      </Formik>
      {state.editedTransaction && <EditTransactionForm />}
    </>
  );
};

export default AddTransactionsForm;
