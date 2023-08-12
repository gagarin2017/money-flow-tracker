import { Col, Row, Space } from "antd";
import { ErrorMessage, Form, Formik, FormikHelpers, Field } from "formik";
import FormsModal from "../../../UI/forms-modal";
import BankAccount from "../../../model/bank-account";
import LogoSelect from "./logo-select";

interface EditBankAccountFormProps {
  bankAccount: BankAccount;
  isVisible: boolean;
  handleFormClose: () => void;
}

function EditBankAccountForm({
  bankAccount,
  isVisible,
  handleFormClose,
}: EditBankAccountFormProps) {
  const onSubmit = async (
    formValues: BankAccount,
    { resetForm }: FormikHelpers<BankAccount>
  ) => {
    const bankAccountToSave: BankAccount = { ...bankAccount };

    bankAccountToSave.accountName = formValues.accountName;
    bankAccountToSave.bankLogo = formValues.bankLogo;
    // addBankAccount(bankAccountToSave);

    resetForm();
    handleFormClose();
  };

  return (
    <Formik initialValues={bankAccount} onSubmit={onSubmit}>
      {({
        handleSubmit,
        handleReset,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
      }) => {
        return (
          <FormsModal
            title={`${bankAccount.bankName} '${bankAccount.accountName}' account`}
            isModalVisible={isVisible}
            handleOk={handleSubmit}
            handleCancel={() => {
              handleReset();
              handleFormClose();
            }}
            customWidth={520}
            isLoading={isSubmitting}
            okText="Ok"
          >
            <Form>
              <Row style={{ marginBottom: 15 }}>
                <Col span={12}>
                  <Space direction="vertical">
                    <label htmlFor="accountName">Account name</label>
                    <Field
                      type="accountName"
                      name="accountName"
                      style={{ height: 25 }}
                    />
                    <ErrorMessage name="accountName" component="div" />
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical">
                    <label htmlFor="bankLogo">Bank</label>
                    <LogoSelect
                      formikFieldName="bankLogo"
                      setFieldValue={setFieldValue}
                      setFieldTouched={setFieldTouched}
                      defaultLogo={bankAccount.bankLogo}
                    />
                  </Space>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4>Account Balance: {bankAccount.balance}</h4>
                </Col>
              </Row>
            </Form>
          </FormsModal>
        );
      }}
    </Formik>
  );
}

export default EditBankAccountForm;
