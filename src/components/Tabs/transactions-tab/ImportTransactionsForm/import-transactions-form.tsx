import { Alert, Col, notification, Row, Spin } from "antd";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import { useBankAccountsContext } from "../../../../context/bank-accounts-context";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../context/import-transactions-context";
import FormsModal from "../../../../UI/forms-modal";
import {
  ParsingStatus,
  readAndParseTxFiles,
} from "../../../../utils/TxFilesReader";
import { FileParserResults } from "./model/file-parser-results";
import { TransactionsFileBankAccount } from "./model/transactions-file-bank-account";
import TransactionsFilesBankAccountList from "./transactions-files-bank-account-list";
import TransactionsFilesInput from "./transactions-files-input";

type TransactionsFilesFormData = {
  selectedFiles: any[];
  transactionsFileBankAccountField: TransactionsFileBankAccount[];
};

const ImportTransactionsForm = () => {
  const { bankAccounts } = useBankAccountsContext();
  const { state, dispatch } = useImportTransactionsContext();

  const onFormClose = () => {
    dispatch({
      type: ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE,
      payload: false,
    });
  };

  const processTransactionFiles = async (
    transactions: TransactionsFileBankAccount[]
  ) => {
    let promises: Promise<FileParserResults>[] = transactions.map(
      async (fileAccountPair) => {
        try {
          const parsingResult: FileParserResults = await readAndParseTxFiles(
            fileAccountPair
          );
          return parsingResult;
        } catch (error: any) {
          return error;
        }
      }
    );

    return Promise.all(promises);
  };

  const onSubmit = async (
    formValues: TransactionsFilesFormData,
    { resetForm }: FormikHelpers<TransactionsFilesFormData>
  ) => {
    let closePopup: boolean = false;

    const parsedTransactions: FileParserResults[] =
      await processTransactionFiles(
        formValues.transactionsFileBankAccountField
      );

    parsedTransactions
      .filter((result) => result.status === ParsingStatus.ERROR)
      .forEach((error) => {
        notification["error"]({
          message: `Transactions from file "${error.fileName}" could not be imported into account [${error.accountId}]. Check the account name and try again.`,
          description: error.parsingErrors,
          duration: 0,
        });
      });

    const parserResults = parsedTransactions.filter(
      (result) => result.status === ParsingStatus.FINISHED
    );

    if (parserResults.length > 0) {
      dispatch({
        type: ImportTransactionsActionType.ADD_NEW_TXS,
        payload: { bankAccounts, parserResults },
      });
      closePopup = true;
    }

    if (closePopup) {
      resetForm();
      onFormClose();
    }
  };

  return (
    <Formik
      initialValues={
        {
          selectedFiles: [],
          transactionsFileBankAccountField: [],
        } as TransactionsFilesFormData
      }
      onSubmit={onSubmit}
    >
      {({
        handleSubmit,
        handleReset,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
      }) => {
        return (
          <FormsModal
            title={`Import Transactions from files`}
            isModalVisible={state.isImportTransactionsFormVisible}
            handleOk={handleSubmit}
            handleCancel={() => {
              handleReset();
              onFormClose();
            }}
            customWidth={520}
            isLoading={isSubmitting}
            okText="Next"
          >
            <Form>
              <Row>
                <Col span={24}>
                  <Alert
                    message="Please select file(-s) to start importing"
                    type="info"
                    showIcon
                    style={{ marginBottom: 10 }}
                  />
                  <TransactionsFilesInput
                    formikFieldName="selectedFiles"
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                  />
                  <ErrorMessage name="selectedFiles" />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <TransactionsFilesBankAccountList formikFieldName="transactionsFileBankAccountField" />
                </Col>
              </Row>
              {isSubmitting && (
                <Spin style={{ position: "fixed", top: "50%", left: "50%" }} />
              )}
            </Form>
          </FormsModal>
        );
      }}
    </Formik>
  );
};

export default ImportTransactionsForm;
