import React, { useState } from "react";
import { Modal, Button, Alert, Col, Row } from "antd";
import { Formik, Field, Form, FormikHelpers, ErrorMessage } from "formik";
import { TransactionsFileBankAccountPair } from "./components/Tabs/transactions-tab/import-transactions/ImportTransactionsForm/model/transactions-file-bank-account";
import TransactionsFilesBankAccountList from "./components/Tabs/transactions-tab/import-transactions/ImportTransactionsForm/transactions-files-bank-account-list";
import TransactionsFilesInput from "./components/Tabs/transactions-tab/import-transactions/ImportTransactionsForm/transactions-files-input";

type TransactionsFilesFormData = {
  selectedFiles: any[];
  transactionsFileBankAccountField: TransactionsFileBankAccountPair[];
};

const App: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    values: TransactionsFilesFormData,
    { setSubmitting, resetForm }: FormikHelpers<TransactionsFilesFormData>
  ) => {
    setLoading(true);
    setSubmitting(true);
    console.log("Submitting...");
    setTimeout(() => {
      console.log("Submitted values:", values);
      setSubmitting(false);
      setLoading(false);
      console.log("Form closed");
      resetForm();
      setIsModalVisible(false);
    }, 5000); // Wait for 5 seconds
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setLoading(false);
  };

  return (
    <div className="App">
      <Button type="primary" onClick={showModal}>
        Open Form
      </Button>
      <Formik<TransactionsFilesFormData>
        initialValues={{
          selectedFiles: [],
          transactionsFileBankAccountField: [],
        }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, setFieldTouched, handleSubmit, isSubmitting }) => (
          <Modal
            title="Submit the Form"
            open={isModalVisible}
            onOk={() => handleSubmit()}
            onCancel={handleCancel}
            confirmLoading={isSubmitting || loading}
            afterClose={() => setLoading(false)} // Ensure loading is reset after closing
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
          </Modal>
        )}
      </Formik>
    </div>
  );
};

export default App;
