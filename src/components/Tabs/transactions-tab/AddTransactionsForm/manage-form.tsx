import { Col, Row } from "antd";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { FormEvent, ReactNode } from "react";
import MinimalisticModal from "../../../../UI/minimalistic-modal";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../context/import-transactions-context";
import { Category } from "../../../../model/category";
import { Description } from "../../../../model/description";
import { Tag } from "../../../../model/tag";

export const NEW_PROP_VALID_SCHEMA = Yup.object().shape({
  payeeName: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .test(
      "Checking payee's name",
      "Payee's name is required",
      (payeeName, ctx) => {
        const theName = ctx.parent.name;

        let result = true;

        if (theName) {
          // if there's a name input then ignore this validation as the user is on Add New Category/Description/Tag widget
          result = true;
        } else if (!payeeName) {
          // the user is on Add New Payee widget, hence fail this validation as payee name is required
          result = false;
        }

        return result;
      }
    ),
  name: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .test("checking prop's name", "The name is required", (propsName, ctx) => {
      const payeeName = ctx.parent.payeeName;

      let result = true;

      if (payeeName) {
        // if there's a payee name selected then ignore this validation as the user is on Add new payee widget
        result = true;
      } else if (!propsName) {
        // the user is on Add New Category/Description/Tag widget, hence name is required
        result = false;
      }

      return result;
    }),
  isSubcategory: Yup.boolean().test(
    "check if isSubcategory needs to be selected",
    '"is Subcategory Of" is Required',
    (isSubcategoryValue, ctx) => {
      const theName = ctx.parent.name;
      const category = ctx.parent.category;

      let result = true;

      if (theName && JSON.stringify(category) !== "{}" && !isSubcategoryValue) {
        result = false;
      }

      return result;
    }
  ),
  category: Yup.object()
    .shape({
      name: Yup.string(),
    })
    .test("isSubcategory", "Category is required", (value, ctx) => {
      const isSubcategorySelected = ctx.parent.isSubcategory;
      const payeeName = ctx.parent.payeeName;

      let result = true;

      if (payeeName && JSON.stringify(value) === "{}") {
        result = false;
      } else if (
        isSubcategorySelected &&
        (!value || JSON.stringify(value) === "{}")
      ) {
        result = false;
      }
      return result;
    }),
});

export interface FormData {
  payeeName: string; // have it separate for validation purposes
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
      validationSchema={NEW_PROP_VALID_SCHEMA}
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
