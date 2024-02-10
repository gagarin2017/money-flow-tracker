import { Col, Row } from "antd";
import { Form, Formik, FormikHelpers } from "formik";

import { FormEvent, ReactNode } from "react";
import MinimalisticModal from "../../../../UI/minimalistic-modal";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../context/import-transactions-context";
import { Category } from "../../../../model/category";
import { Description } from "../../../../model/description";
import { Tag } from "../../../../model/tag";

export interface FormData {
  name: string;
  category: Category | undefined;
  description: Description | undefined;
  descriptionName: string;
  categoryName: string;
  tagName: string;
  tag: Tag | undefined;
  amount: number;
  isSubcategory: boolean;
}

interface ManageFormProps {
  modalTitle: string;
  isModalVisible: boolean;
  initialFormValues: FormData;
  managedPropsTable?: JSX.Element;
  getFormBody: (handleSubmit: {
    (e?: FormEvent<HTMLFormElement> | undefined): void;
    (): void;
  }) => ReactNode;
  handleOnSubmit: (formValues: FormData) => void;
}

const ManageForm = ({
  isModalVisible,
  initialFormValues,
  modalTitle,
  managedPropsTable,
  getFormBody,
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
    resetForm();
  };

  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={(values, handleReset) => {
        onSubmit(values, handleReset);
      }}
      enableReinitialize
    >
      {({ values, handleSubmit, handleReset, isSubmitting }) => (
        <MinimalisticModal
          title={modalTitle}
          isModalVisible={isModalVisible}
          handleCancel={() => {
            handleReset();
            handleFormClose();
          }}
          customWidth={1500}
        >
          <Row gutter={[2, 4]} justify={"center"}>
            <Col span={20}>{managedPropsTable}</Col>
            <Col span={4}>
              <Form>{getFormBody(handleSubmit)}</Form>
            </Col>
          </Row>
        </MinimalisticModal>
      )}
    </Formik>
  );
};

export default ManageForm;
