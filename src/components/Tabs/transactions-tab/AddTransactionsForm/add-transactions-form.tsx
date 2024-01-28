import { Collapse, CollapseProps } from "antd";
import {
  FieldArray,
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikTouched,
} from "formik";
import BankAccount from "../../../../model/bank-account";
import { Transaction } from "../../../../model/transaction";

import { useEffect } from "react";
import * as Yup from "yup";
import FormsModal from "../../../../UI/forms-modal";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../context/import-transactions-context";
import { useTransactionsContext } from "../../../../context/transactions-context";
import { Category } from "../../../../model/category";
import { Description } from "../../../../model/description";
import { getDateFromString } from "../../../../utils/date-helper";
import { isSpringBoot } from "../../../services/api-common";
import ImportTransactionsEmptyList from "../ImportTransactionsForm/import-transactions-empty-list";
import {
  EMPTY_FORM_TRANSACTION,
  FormTransaction,
  fetchPayeesCategoriesTags,
} from "../add-transactions-utils";
import AccountTransactionsList from "./account-transaction-list";
import { useBankAccountsContext } from "../../../../context/bank-accounts-context";

export interface AccountTransaction {
  bankAccount: BankAccount | undefined;
  transactions: FormTransaction[];
}

export interface NewTransactionsFormData {
  accountTransactions: AccountTransaction[];
}

export const ACC_TRXS_VALID_SCHEMA = Yup.object().shape({
  accountTransactions: Yup.array().of(
    Yup.object().shape({
      transactions: Yup.array().of(
        Yup.object().shape({
          category: Yup.object().shape({
            name: Yup.string().required(),
          }),
          amount: Yup.number().required(),
        })
      ),
    })
  ),
});

const AddTransactionsForm = () => {
  const { state, dispatch } = useImportTransactionsContext();
  const { isLoading, saveTransactions } = useTransactionsContext();
  const { fetchBankAccounts } = useBankAccountsContext();

  useEffect(() => {
    fetchPayeesCategoriesTags(isSpringBoot, dispatch);
  }, []);

  const getInitialValue = () => {
    let initialForm = {} as NewTransactionsFormData;

    if (state.newTransactions && state.newTransactions.length > 0) {
      initialForm = {
        accountTransactions: state.newTransactions,
      };
    } else {
      initialForm = {
        accountTransactions: [
          {
            bankAccount: { id: 1, bankName: "empty bank acc" } as BankAccount,
            transactions: [EMPTY_FORM_TRANSACTION],
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
    dispatch({
      type: ImportTransactionsActionType.ADD_NEW_TXS,
      payload: {
        bankAccounts: [],
        parserResults: [],
      },
    });
  };

  const onSubmit = async (
    formValues: NewTransactionsFormData,
    { resetForm }: FormikHelpers<NewTransactionsFormData>
  ) => {
    console.log(
      "🚀 ~ file: add-transactions-form.tsx:74 ~ AddTransactionsForm ~ formValues:",
      formValues
    );
    const transactionsToSave: Transaction[] = [];

    formValues.accountTransactions.forEach((formData) => {
      formData.transactions.forEach((tx) => {
        transactionsToSave.push({
          id: -1,
          bankAccount: formData.bankAccount,
          date: tx.date && getDateFromString(tx.date),
          description: { id: tx.description?.id, name: "" } as Description,
          category: { id: tx.category?.id } as Category,
          memo: tx.memo,
          tag: tx.tag,
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

  const areThereAnyTransactionsToImport =
    state.newTransactions && state.newTransactions.length === 0;

  const accountTransactionSection = (
    values: NewTransactionsFormData,
    errors: FormikErrors<NewTransactionsFormData>,
    touched: FormikTouched<NewTransactionsFormData>
  ) => {
    const items: CollapseProps["items"] = values.accountTransactions.map(
      (accTransactions: AccountTransaction, index: number) => ({
        key: index,
        label: (
          <div
            style={{ fontWeight: "bold" }}
          >{`${accTransactions.bankAccount?.bankName} - ${accTransactions.transactions.length} transactions`}</div>
        ),
        children: (
          <div style={{ maxHeight: 500, overflow: "scroll" }}>
            <AccountTransactionsList
              accountIndex={index}
              transactions={accTransactions.transactions}
              errors={errors}
              touched={touched}
            />
          </div>
        ),
      })
    );

    return <Collapse items={items} defaultActiveKey={["0"]} />;
  };

  return (
    <Formik
      initialValues={getInitialValue()}
      onSubmit={(values, handleReset) => {
        onSubmit(values, handleReset);
      }}
      validateOnChange={false} // Do not validate on change
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
          title={`Add new Transactions`}
          isModalVisible={state.isAddTransactionsFormModalVisible}
          handleOk={handleSubmit}
          handleCancel={() => {
            handleReset();
            handleFormClose();
          }}
          customWidth={1500}
          isLoading={isSubmitting}
          okText={undefined}
        >
          <Form>
            {areThereAnyTransactionsToImport ? (
              <ImportTransactionsEmptyList />
            ) : (
              <FieldArray name="accountTransactions">
                {() => accountTransactionSection(values, errors, touched)}
              </FieldArray>
            )}
          </Form>
        </FormsModal>
      )}
    </Formik>
  );
};

export default AddTransactionsForm;
