import { Empty, message, notification } from "antd";

import { FormEvent, useState } from "react";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../context/import-transactions-context";
import { Category } from "../../../../model/category";
import { Description } from "../../../../model/description";
import { Tag } from "../../../../model/tag";
import AddNewCategoryCard from "./manage-categories/add-new-category-card";
import CategoriesList from "./manage-categories/categories-list";
import AddNewDescriptionCard from "./manage-descriptions/add-new-description-card";
import DescriptionList from "./manage-descriptions/description-list";
import ManageForm from "./manage-form";
import AddNewPayeeCard from "./manage-payees/add-new-payee-card";
import PayeeList from "./manage-payees/payee-list";
import Payee from "./model/payee";
import { DirectoryTreeProps } from "antd/es/tree";
import { useField } from "formik";
import { findCategoryById } from "../../../../utils/category-helper";

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

interface PayeeCatDescTagManagerProps {
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

const PayeeCatDescTagManager = ({
  managedProperty,
}: PayeeCatDescTagManagerProps) => {
  const { state, dispatch } = useImportTransactionsContext();

  const [api, contextHolder] = message.useMessage();

  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const getInitialValues = () => {
    let initialForm = {} as FormData;

    if (selectedCategory) {
      initialForm = {
        name: selectedCategory.name,
        isSubcategory: selectedCategory.parentCategory ? true : false,
        category: selectedCategory.parentCategory,
      } as FormData;
    } else {
      initialForm = {
        name: "",
        category: undefined,
        isSubcategory: false,
        description: undefined,
        tag: undefined,
      } as FormData;
    }

    return initialForm;
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
      id: selectedCategory?.id || Math.floor(Math.random() * 1123) + 8,
      name: formValues.name,
      subCategories: [],
      parentCategory: formValues.category,
    };

    return categoryToBeSaved;
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const onSubmit = async (formValues: FormData) => {
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
            update: selectedCategory ? true : false,
          },
        });
        // dispatch({
        //   type: ImportTransactionsActionType.ADD_NEW_PAYEE,
        //   payload: { name: managedProperty, payee: buildPayee(formValues) },
        // });
        break;
    }
    api.open({
      type: "success",
      content: "The list was updated with the new data",
    });
  };

  const getManagedPropsTable = () => {
    switch (managedProperty) {
      case ManagedProperty.PAYEE:
        return <PayeeList />;
      case ManagedProperty.CATEGORY:
        return (
          <CategoriesList
            handleCategoryEdit={handleEditCategory}
            selectedCategory={selectedCategory}
            handleCategorySelect={handleCategorySelect}
          />
        );
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
            fieldCategoryName="name"
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

  const handleCategorySelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info);

    console.log("selected id: ", keys[0]);
    console.log("state categories: ", state.categories);

    const selectedCategory: Category | undefined = findCategoryById(
      state.categories,
      +keys[0]
    );
    console.log("🚀 ~ selectedCategory:", selectedCategory);
    selectedCategory && setSelectedCategory(selectedCategory);
  };

  const theTitle = `Manage ${
    ManagedPropertiesMap.get(managedProperty)?.multipleName
  }`;

  return (
    <>
      {contextHolder}
      <ManageForm
        initialFormValues={getInitialValues()}
        isModalVisible={state.isManageFormVisible}
        modalTitle={theTitle}
        managedPropsTable={getManagedPropsTable()}
        getFormBody={getFormBody}
        handleOnSubmit={onSubmit}
      />
    </>
  );
};

export default PayeeCatDescTagManager;
