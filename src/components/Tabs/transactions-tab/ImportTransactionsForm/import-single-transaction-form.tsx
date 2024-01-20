import { FieldArray, Formik, FormikHelpers } from "formik";
import MinimalisticModal from "../../../../UI/minimalistic-modal";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../context/import-transactions-context";
import BankAccount from "../../../../model/bank-account";
import {
  AccountTransaction,
  NewTransactionsFormData,
} from "../AddTransactionsForm/add-transactions-form";
import {
  EMPTY_FORM_TRANSACTION,
  fetchPayeesCategoriesTags,
} from "../add-transactions-utils";
import { Alert, Collapse, CollapseProps, Space } from "antd";
import { Panel } from "rc-collapse";
import AccountTransactionsList from "../AddTransactionsForm/account-transaction-list";
import { useTransactionsContext } from "../../../../context/transactions-context";
import { useEffect } from "react";
import { isSpringBoot } from "../../../services/api-common";
import { useBankAccountsContext } from "../../../../context/bank-accounts-context";
import BankAccountTitle from "../../../BankAccounts/bank-account-title";

function ImportSingleTransactionForm() {
  const { state, dispatch } = useImportTransactionsContext();
  const { isLoading, saveTransactions } = useTransactionsContext();
  const { bankAccounts, selectedBankAccountId } = useBankAccountsContext();
  console.log(
    "🚀 ~ ImportSingleTransactionForm ~ selectedBankAccountId:",
    selectedBankAccountId
  );
  console.log("🚀 ~ ImportSingleTransactionForm ~ bankAccounts:", bankAccounts);

  useEffect(() => {
    fetchPayeesCategoriesTags(isSpringBoot, dispatch);
  }, []);

  const bankAccount = bankAccounts.find(
    (bankAccount) => bankAccount.id === selectedBankAccountId
  );

  const getInitialValues = () => {
    let initialForm = {} as NewTransactionsFormData;

    if (state.newTransactions && state.newTransactions.length > 0) {
      initialForm = {
        accountTransactions: state.newTransactions,
      };
    } else {
      initialForm = {
        accountTransactions: [
          {
            bankAccount,
            transactions: [EMPTY_FORM_TRANSACTION],
          },
        ],
      };
    }

    return initialForm;
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
    resetForm();
  };

  const accountTransactionSection = (values: NewTransactionsFormData) => {
    const items: CollapseProps["items"] = values.accountTransactions.map(
      (accTransactions: AccountTransaction, index: number) => ({
        key: index,
        label: (
          <BankAccountTitle
            bankAccount={accTransactions.bankAccount}
            numberOfTransactions={accTransactions.transactions.length}
          />
        ),
        children: (
          <div style={{ maxHeight: 500, overflow: "scroll" }}>
            <AccountTransactionsList
              accountIndex={index}
              transactions={accTransactions.transactions}
            />
          </div>
        ),
      })
    );

    return <Collapse items={items} defaultActiveKey={["0"]} />;
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      onSubmit={(values, handleReset) => {
        onSubmit(values, handleReset);
      }}
    >
      {({ values, handleSubmit, handleReset, isSubmitting }) => (
        <MinimalisticModal
          title={"Import transactions"}
          isModalVisible={state.isImportSingleTransactionsFormVisible}
          handleCancel={() => {
            handleReset();
            handleFormClose();
          }}
          customWidth={1500}
        >
          <Alert
            message={
              <Space>
                {"New transactions for the bank account "}{" "}
                <BankAccountTitle bankAccount={bankAccount} />
              </Space>
            }
            type="info"
            showIcon
            style={{ marginBottom: 10 }}
          />
          <FieldArray name="accountTransactions">
            {() => <>{accountTransactionSection(values)}</>}
          </FieldArray>
        </MinimalisticModal>
      )}
    </Formik>
  );
}

export default ImportSingleTransactionForm;
