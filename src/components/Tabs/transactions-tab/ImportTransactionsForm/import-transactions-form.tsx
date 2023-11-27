import { Alert, Col, notification, Row, Spin } from "antd";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import FormsModal from "../../../../UI/forms-modal";
import {
  ParsingStatus,
  readAndParseTxFiles,
} from "../../../../utils/TxFilesReader";
import { FileParserResults } from "./model/file-parser-results";
import { TransactionsFileBankAccount } from "./model/transactions-file-bank-account";
import TransactionsFilesBankAccountList from "./transactions-files-bank-account-list";
import TransactionsFilesInput from "./transactions-files-input";
import { Transaction } from "../../../../model/transaction";

type TransactionsFilesFormData = {
  selectedFiles: any[];
  transactionsFileBankAccountField: TransactionsFileBankAccount[];
};

interface ImportTransactionsFormProps {
  isImportTransactionsModalVisible: boolean;
  handleFormClose: () => void;
  populateFileTransactions: (fileParserResults: FileParserResults []) => void;
}

const ImportTransactionsForm = ({
  isImportTransactionsModalVisible,
  handleFormClose,
  populateFileTransactions
}: ImportTransactionsFormProps) => {

  const onFormClose = () => {
    handleFormClose();
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

    const transactionsToBeImported = parsedTransactions.filter(
      (result) => result.status === ParsingStatus.FINISHED
    );

    if (transactionsToBeImported.length > 0) {
      
      console.log("transactionsToBeImported", transactionsToBeImported);

      populateFileTransactions(transactionsToBeImported)
      closePopup = true
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
            isModalVisible={isImportTransactionsModalVisible}
            handleOk={handleSubmit}
            handleCancel={() => {
              handleReset();
              handleFormClose();
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
