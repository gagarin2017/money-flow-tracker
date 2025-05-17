import { Alert, Col, notification, Row } from "antd";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import TransactionsFilesBankAccountList from "./transactions-files-bank-account-list";
import TransactionsFilesInput from "./transactions-files-input";
import { TransactionsFileBankAccountPair } from "./model/transactions-file-bank-account";
import { ParsingError } from "./model/parsing-error";
import { useImportTransactionsContext } from "../../../../../context/import-transactions-context";
import { ImportTransactionsActionType } from "../../../../../context/import-transactions-context-helpers/constants";
import FormsModal from "../../../../../UI/forms-modal";

interface TransactionsFilesFormData {
  selectedFiles: any[];
  transactionsFileBankAccountField: TransactionsFileBankAccountPair[];
}

const ImportTransactionsForm = () => {
  const { state, dispatch } = useImportTransactionsContext();
  const [resetFormFn, setResetFormFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (!state.isLoading && resetFormFn) {
      resetFormFn();
      dispatch({
        type: ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE,
        payload: false,
      });
      dispatch({
        type: ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE,
        payload: true,
      });

      if (state.fileParsingErrors.length > 0) {
        showParsingErrors(state.fileParsingErrors);
      }
    }
  }, [dispatch, resetFormFn, state.fileParsingErrors, state.isLoading]);

  function showParsingErrors(fileParsingErrors: ParsingError[]) {
    // Notification with the errors

    fileParsingErrors.forEach((error) => {
      notification["error"]({
        message: error.description,
        description: "Parsing error occurred",
        duration: 0,
      });
    });
  }

  const onFormClose = () => {
    dispatch({
      type: ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE,
      payload: false,
    });
  };

  const handleSubmit = async (
    values: TransactionsFilesFormData,
    { setSubmitting, resetForm }: FormikHelpers<TransactionsFilesFormData>
  ) => {
    setResetFormFn(() => resetForm);
    dispatch({ type: ImportTransactionsActionType.SET_LOADING, payload: true });
    setSubmitting(true);

    dispatch({
      type: ImportTransactionsActionType.SET_TRANSACTIONS_BANK_ACC_PAIRS,
      payload: values.transactionsFileBankAccountField,
    });
  };

  return (
    <Formik
      initialValues={
        {
          selectedFiles: [],
          transactionsFileBankAccountField: [],
        } as TransactionsFilesFormData
      }
      onSubmit={handleSubmit}
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
            isLoading={isSubmitting || state.isLoading}
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
            </Form>
          </FormsModal>
        );
      }}
    </Formik>
  );
};

export default ImportTransactionsForm;
