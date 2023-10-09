import "../../../index.css";
import { Col, Row, Space } from "antd";
import { ErrorMessage, Form, Formik, FormikHelpers, Field } from "formik";
import FormsModal from "../../../UI/forms-modal";
import BankAccount from "../../../model/bank-account";
import LogoSelect from "./logo-select";
import { getAmountAsFormatedString } from "../../../utils/currency-helper";
import { useBankAccountsContext } from "../../../context/bank-accounts-context";
import { bankLogoMap } from "../../../UI/logo-map";
import * as Yup from "yup";

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
  const { editBankAccount } = useBankAccountsContext();

  const onSubmit = async (
    formValues: BankAccount,
    { resetForm }: FormikHelpers<BankAccount>
  ) => {
    console.log("form submit");
    if (
      bankAccount.accountName !== formValues.accountName ||
      bankAccount.bankLogo !== formValues.bankLogo
    ) {
      const bankAccountToSave: BankAccount = { ...bankAccount };

      bankAccountToSave.accountName = formValues.accountName;
      bankAccountToSave.bankLogo = formValues.bankLogo;
      bankAccountToSave.bankName =
        bankLogoMap.get(formValues.bankLogo)?.name || "Bank";

      console.log("bank acc to  be saved: ", bankAccountToSave);

      editBankAccount(bankAccountToSave);
    }
    resetForm();
    handleFormClose();
  };

  const editBankAccSchema = Yup.object().shape({
    accountName: Yup.string()
      .min(2, "it is too short")
      .max(50, "it is too long")
      .required("Required"),
  });

  return (
    <Formik
      initialValues={bankAccount}
      onSubmit={onSubmit}
      validationSchema={editBankAccSchema}
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
                    <Field name="accountName" style={{ height: 25 }} />
                    <ErrorMessage
                      className="form-field-error"
                      name="accountName"
                      component="div"
                    />
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
                  <h4>
                    {`Account Balance: ${getAmountAsFormatedString(
                      bankAccount.balance
                    )}`}
                  </h4>
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
