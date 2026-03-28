import { Col, Row } from "antd";
import { Form, Formik, FormikHelpers } from "formik";
import { FormEvent, ReactNode } from "react";
import MinimalisticModal from "../../../../UI/minimalistic-modal";
import { useImportTransactionsContext } from "../../../../context/import-transactions-context";
import { Category } from "../../../../model/category";
import { Description } from "../../../../model/description";
import { Tag } from "../../../../model/tag";
import { ImportTransactionsActionType } from "../../../../context/import-transactions-context-helpers/constants";
import Payee from "./model/payee";
import { AnyObjectSchema } from "yup";

export interface FormData {
  // newPayeeName: string | undefined; // have it separate for validation purposes
  name: string;
  category: Category | undefined;
  description: Description | undefined;
  descriptionName: string | undefined;
  categoryName: string | undefined;
  tagName: string | undefined;
  tag: Tag | undefined;
  amount: number | undefined;
  isSubcategory: boolean;
  payee: Payee | undefined;
  matchingString: string | undefined; // the string (memo) of the imported transaction, which is matched to Payee
}

export const emptyFormValues: FormData = {
  name: "",
  category: undefined,
  isSubcategory: false,
  description: undefined,
  tag: undefined,
  payee: undefined,
  matchingString: "",
  // newPayeeName: "",
  descriptionName: "",
  categoryName: "",
  tagName: "",
  amount: undefined,
};

interface ManageFormProps {
  validationSchema: AnyObjectSchema;
  modalTitle: string;
  isModalVisible: boolean;
  initialFormValues: FormData;
  getFormContent: (handleSubmit: {
    (e?: FormEvent<HTMLFormElement> | undefined): void;
    (): void;
  }) => ReactNode;
  handleOnSubmit: (formValues: FormData) => void;
}

const ManageForm = ({
  validationSchema,
  isModalVisible,
  initialFormValues,
  modalTitle,
  getFormContent,
  handleOnSubmit,
}: ManageFormProps) => {
  const { dispatch } = useImportTransactionsContext();

  const handleFormClose = () => {
    dispatch({
      type: ImportTransactionsActionType.MANAGE_FORM_VISIBLE,
      payload: false,
    });
  };

  const onSubmit = async (
    formValues: FormData,
    { resetForm }: FormikHelpers<FormData>
  ) => {
    handleOnSubmit(formValues);
    resetForm({ values: initialFormValues });
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialFormValues}
      onSubmit={(values, handleReset) => {
        onSubmit(values, handleReset);
      }}
      enableReinitialize={true}
    >
      {({ values, handleSubmit, handleReset, isSubmitting, errors }) => (
        <MinimalisticModal
          title={modalTitle}
          isModalVisible={isModalVisible}
          handleCancel={() => {
            handleReset();
            handleFormClose();
          }}
          customWidth={1500}
        >
          {getFormContent(handleSubmit)}
          {(() => {
            if (Object.keys(errors).length) {
              console.log("form has errors", errors);
            }
            return null;
          })()}
        </MinimalisticModal>
      )}
    </Formik>
  );
};

export default ManageForm;
