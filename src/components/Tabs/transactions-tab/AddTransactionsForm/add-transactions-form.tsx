import { Collapse, Empty } from "antd";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
} from "formik";
import { useDispatch, useSelector } from "react-redux";
import BankAccount from "../../../../model/bank-account";
import { Category } from "../../../../model/category";
import { Transaction } from "../../../../model/transaction";

import FormsModal from "../../../../UI/forms-modal";
import { getDateFromString } from "../../../../utils/date-helper";
import ImportTransactionsEmptyList from "../ImportTransactionsForm/import-transactions-empty-list";
import {
  EMPTY_FORM_TRANSACTION,
  FormTransaction,
} from "./add-transactions-utils";
import TransactionsToBeImportedTable from "./transactions-to-be-imported-table";
import { FileParserResults } from "../ImportTransactionsForm/model/file-parser-results";
import AccountTransactionsToBeImported from "./account-transactions-to-be-imported";

const { Panel } = Collapse;

export interface AccountTransaction {
  bankAccount: BankAccount | undefined;
  transactions: FormTransaction[];
}

interface NewTransactionsFormData {
  accountTransactions: AccountTransaction[];
}

interface AddTransactionsFormProps {
  transactions?: Transaction[];
  isAddTransactionsFormModalVisible: boolean;
  parsedTransactions: AccountTransaction[];
  handleAddTransactionsFormModalVisibility: () => void;
}

const AddTransactionsForm = ({
  transactions,
  isAddTransactionsFormModalVisible,
  parsedTransactions,
  handleAddTransactionsFormModalVisibility,
}: AddTransactionsFormProps) => {
  // const dispatch = useDispatch();

  // const selectedAccount = useSelector(
  //   (state: RootState) => state.bankAccounts.selectedAccount
  // );

  // const parsedTransactions = useSelector(
  //   (state: RootState) => state.transactions.importedTransactions
  // );

  const getInitialValue = () => {
    let initialForm = {} as NewTransactionsFormData;

    if (parsedTransactions && parsedTransactions.length > 0) {
      initialForm = {
        accountTransactions: parsedTransactions,
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

    // return {
    //   accountTransactions: [
    //     {
    //       bankAccount: {
    //         id: 10,
    //         bankName: "AIB",
    //         accountName: "Visa",
    //         balance: 269.13,
    //         active: true,
    //         bankLogo: "aibLogo",
    //       },
    //       transactions: [
    //         {
    //           id: -3.8600111129118986,
    //           date: "2022-09-02",
    //           description: "PAYPAL *ZOOPLUS SE",
    //           amount: -50.66,
    //         },
    //       ],
    //     },
    //     {
    //       bankAccount: {
    //         id: 9,
    //         bankName: "AIB",
    //         accountName: "Visa",
    //         balance: 25369.13,
    //         active: true,
    //         bankLogo: "aibLogo",
    //       },
    //       transactions: [
    //         {
    //           id: -84.77295312958823,
    //           date: "2022-09-02",
    //           description: "AMZNMktplace",
    //           amount: -32.97,
    //         },
    //       ],
    //     },
    //   ],
    // };
  };

  const handleFormClose = () => {
    handleAddTransactionsFormModalVisibility();
    // dispatch(transactionsActions.clearImportedTransactions());
    // dispatch(transactionsActions.closeImportTransactionsTableFormModal());
    // dispatch(fetchAccountTransactions(selectedAccount?.id));
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

  // if button is not visible - then we are importing transactions from files, rather than adding them manually
  // const isAddTransactionButtonVisible = useSelector(
  //   (state: RootState) => state.transactions.isAddTransactionButtonVisible
  // );

  const areThereAnyTransactionsToImport =
    parsedTransactions && parsedTransactions.length === 0;

  return (
    <Formik
      initialValues={getInitialValue()}
      onSubmit={(values) => {
      console.log("🚀 ~ file: add-transactions-form.tsx:167 ~ values:", values)
      }}
    >
      {({ values, handleSubmit, handleReset, isSubmitting }) => (
        <FormsModal
          title={`Add new Transactions`}
          isModalVisible={isAddTransactionsFormModalVisible}
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
