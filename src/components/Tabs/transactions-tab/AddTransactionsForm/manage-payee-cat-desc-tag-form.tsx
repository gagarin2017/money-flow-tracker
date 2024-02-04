import { Col, Empty, Row } from "antd";
import { Form, Formik, FormikHelpers } from "formik";

import MinimalisticModal from "../../../../UI/minimalistic-modal";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../context/import-transactions-context";
import { Category } from "../../../../model/category";
import Payee from "./model/payee";
import AddNewPayeeCard from "./manage-payees/add-new-payee-card";
import PayeeList from "./manage-payees/payee-list";
import { Description } from "../../../../model/description";
import { Tag } from "../../../../model/tag";
import { FormEvent } from "react";
import DescriptionList from "./manage-descriptions/description-list";
import CategoriesList from "./manage-categories/categories-list";
import AddNewCategoryCard from "./manage-categories/add-new-category-card";
import AddNewDescriptionCard from "./manage-descriptions/add-new-description-card";

export enum ManagedProperty {
  PAYEE = "Payee",
  CATEGORY = "Category",
  DESC = "Description",
  TAG = "Tag",
}

export const ManagedPropertiesMap = new Map<
  ManagedProperty,
  { name: string; multipleName: string }
>([
  [
    ManagedProperty.PAYEE,
    {
      name: ManagedProperty.PAYEE,
      multipleName: `${ManagedProperty.PAYEE}s`,
    },
  ],
  [
    ManagedProperty.CATEGORY,
    {
      name: ManagedProperty.CATEGORY,
      multipleName: "Categories",
    },
  ],
  [
    ManagedProperty.DESC,
    {
      name: ManagedProperty.DESC,
      multipleName: `${ManagedProperty.DESC}s`,
    },
  ],
  [
    ManagedProperty.TAG,
    {
      name: ManagedProperty.TAG,
      multipleName: `${ManagedProperty.TAG}s`,
    },
  ],
]);

interface ManagePayeeCatDescTagFormProps {
  managedProperty: ManagedProperty;
}

interface FormData {
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

const ManagePayeeCatDescTagForm = ({
  managedProperty,
}: ManagePayeeCatDescTagFormProps) => {
  const { state, dispatch } = useImportTransactionsContext();

  const getInitialValues = () => {
    let initialForm = {
      name: "",
      category: undefined,
      isSubcategory: false,
      description: undefined,
      tag: undefined,
    } as FormData;
    return initialForm;
  };

  const handleFormClose = () => {
    dispatch({
      type: ImportTransactionsActionType.MANAGE_PAYEE_CAT_DESC_TAG_FORM_VISIBLE,
      payload: false,
    });
  };

  const buildPayee = (formValues: FormData) => {
    const payeeToBeSaved: Payee = {
      id:
        formValues.category?.id ||
        1122.3 * (formValues.tag?.id || Math.random()),
      name: formValues.name,
      category: {
        id: formValues.category?.id || 0,
        name: formValues.category?.name || "",
        subCategories: formValues.category?.subCategories || [],
      } as Category,
      description: {
        id: formValues.description?.id || 0,
        name: formValues.description?.name || "",
      },
      tag: { id: formValues.tag?.id || 0, name: formValues.tag?.name || "" },
      amount: formValues.amount,
    };

    return payeeToBeSaved;
  };

  const buildCategory = (formValues: FormData) => {
    const categoryToBeSaved: Category = {
      id: -1122.3 * Math.random(),
      name: formValues.name,
      subCategories: [],
      parentCategory: formValues.category,
    };

    return categoryToBeSaved;
  };

  const onSubmit = async (
    formValues: FormData,
    { resetForm }: FormikHelpers<FormData>
  ) => {
    switch (managedProperty) {
      case ManagedProperty.PAYEE:
        dispatch({
          type: ImportTransactionsActionType.SAVE_PAYEE,
          payload: { name: managedProperty, payee: buildPayee(formValues) },
        });
        break;
      case ManagedProperty.CATEGORY:
        console.log("Saving category: ", formValues);
        dispatch({
          type: ImportTransactionsActionType.SAVE_CATEGORY,
          payload: {
            name: managedProperty,
            category: buildCategory(formValues),
          },
        });
        // dispatch({
        //   type: ImportTransactionsActionType.ADD_NEW_PAYEE,
        //   payload: { name: managedProperty, payee: buildPayee(formValues) },
        // });
        break;
    }

    resetForm();
  };

  const getManagedPropsTable = () => {
    switch (managedProperty) {
      case ManagedProperty.PAYEE:
        return <PayeeList />;
      case ManagedProperty.CATEGORY:
        return <CategoriesList />;
      case ManagedProperty.DESC:
        return <DescriptionList />;
      case ManagedProperty.TAG:
        return <DescriptionList isTag />;
      default:
        <Empty />;
    }
  };

  const getFormBody = (handleSubmit: {
    (e?: FormEvent<HTMLFormElement> | undefined): void;
    (): void;
  }) => {
    switch (managedProperty) {
      case ManagedProperty.PAYEE:
        return (
          <AddNewPayeeCard
            fieldPayeeName="name"
            fieldCategory="category"
            fieldDescription="description"
            fieldTag="tag"
            fieldAmount="amount"
            handleAddPayeeBtnClick={handleSubmit}
          />
        );
      case ManagedProperty.CATEGORY:
        return (
          <AddNewCategoryCard
            name="name"
            isSubcategoryFieldName="isSubcategory"
            subCategoryOfFieldName="category"
            handleAddCategoryBtnClick={handleSubmit}
          />
        );
      case ManagedProperty.DESC:
        return (
          <AddNewDescriptionCard
            name="name"
            handleAddDescriptionBtnClick={handleSubmit}
          />
        );
      case ManagedProperty.TAG:
        return (
          <AddNewDescriptionCard
            name="name"
            handleAddDescriptionBtnClick={handleSubmit}
            isTag
          />
        );
    }
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
          title={`Manage ${
            ManagedPropertiesMap.get(managedProperty)?.multipleName
          }`}
          isModalVisible={state.isManagePayeeCatDescTagFormVisible}
          handleCancel={() => {
            handleReset();
            handleFormClose();
          }}
          customWidth={1500}
        >
          <Row gutter={[2, 4]} justify={"center"}>
            <Col span={20}>{getManagedPropsTable()}</Col>
            <Col span={4}>
              <Form>{getFormBody(handleSubmit)}</Form>
            </Col>
          </Row>
        </MinimalisticModal>
      )}
    </Formik>
  );
};

export default ManagePayeeCatDescTagForm;
