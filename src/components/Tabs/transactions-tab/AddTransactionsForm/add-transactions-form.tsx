import { Collapse } from "antd";
import { FieldArray, Form, Formik, FormikHelpers } from "formik";
import BankAccount from "../../../../model/bank-account";
import { Transaction } from "../../../../model/transaction";

import FormsModal from "../../../../UI/forms-modal";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../context/import-transactions-context";
import ImportTransactionsEmptyList from "../ImportTransactionsForm/import-transactions-empty-list";
import AccountTransactionsToBeImported from "./account-transactions-to-be-imported";
import {
  EMPTY_FORM_TRANSACTION,
  FormTransaction,
} from "./add-transactions-utils";
import { useEffect } from "react";
import { fetchCategoriesAPI } from "../../../services/categories-api";
import Error from "../../../../model/error";

const { Panel } = Collapse;

export interface AccountTransaction {
  bankAccount: BankAccount | undefined;
  transactions: FormTransaction[];
}

interface NewTransactionsFormData {
  accountTransactions: AccountTransaction[];
}

const AddTransactionsForm = () => {
  const { state, dispatch } = useImportTransactionsContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ImportTransactionsActionType.FETCH_START });

        const response = await fetchCategoriesAPI();

        dispatch({
          type: ImportTransactionsActionType.SET_CATEGORIES,
          payload: response,
        });
      } catch (error) {
        dispatch({
          type: ImportTransactionsActionType.ADD_ERROR,
          payload: {
            description: error,
            message: error,
            type: "error",
          } as Error,
        });
      }
    };

    fetchData();
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
  };

  const onSubmit = async (
    formValues: NewTransactionsFormData,
    { resetForm }: FormikHelpers<NewTransactionsFormData>
  ) => {
    const transactionsToSave: Transaction[] = [];

    // formValues.accountTransactions.forEach((formData) => {
    //   formData.transactions.forEach((tx) => {
    //     transactionsToSave.push({
    //       account: formData.bankAccount?.id,
    //       date: getDateFromString(tx.date),
    //       description: tx.description,
    //       category: { id: tx.category } as Category,
    //       memo: tx.memo,
    //       tag: tx.tag,
    //       amount: tx.amount,
    //     } as Transaction);
    //   });
    // });

    // dispatch(saveTransactions(transactionsToSave));

    resetForm();
    handleFormClose();
  };

  const areThereAnyTransactionsToImport =
    state.newTransactions && state.newTransactions.length === 0;

  return (
    <Formik
      initialValues={getInitialValue()}
      onSubmit={(values) => {
        console.log(
          "🚀 ~ file: add-transactions-form.tsx:167 ~ values:",
          values
        );
      }}
    >
      {({ values, handleSubmit, handleReset, isSubmitting }) => (
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
                {() => (
                  <Collapse accordion defaultActiveKey={["0"]}>
                    {values.accountTransactions.map(
                      (accTransactions, index) => (
                        <Panel
                          header={`${accTransactions.bankAccount?.bankName} - ${accTransactions.transactions.length} transactions`}
                          style={{ fontWeight: "bold" }}
                          key={index}
                        >
                          <div style={{ maxHeight: 500, overflow: "scroll" }}>
                            <AccountTransactionsToBeImported
                              accountIndex={index}
                              transactions={accTransactions.transactions}
                            />
                          </div>
                        </Panel>
                      )
                    )}
                  </Collapse>
                )}
              </FieldArray>
            )}

            <button type="submit">Submit</button>
          </Form>
        </FormsModal>
      )}
    </Formik>
  );
};

export default AddTransactionsForm;
