import { Empty, message } from "antd";
import { DirectoryTreeProps } from "antd/es/tree";
import { FormEvent, useState } from "react";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../context/import-transactions-context";
import { Category } from "../../../../model/category";
import { Description } from "../../../../model/description";
import { Tag } from "../../../../model/tag";
import { findCategoryById } from "../../../../utils/category-helper";
import {
  saveCategoryAPI,
  updateCategoryAPI,
} from "../../../services/categories-api";
import { saveDescriptionsAPI as saveDescriptionAPI } from "../../../services/descriptions-api";
import { saveTagAPI } from "../../../services/tags-api";
import AddNewCategoryCard from "./manage-categories/add-new-category-card";
import CategoriesList from "./manage-categories/categories-list";
import AddNewDescriptionCard from "./manage-descriptions/add-new-description-card";
import DescriptionList from "./manage-descriptions/description-list";
import ManageForm, { FormData } from "./manage-form";
import AddNewPayeeCard from "./manage-payees/add-new-payee-card";
import PayeeList from "./manage-payees/payee-list";
import Payee from "./model/payee";

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

const PayeeCatDescTagManager = ({
  managedProperty,
}: PayeeCatDescTagManagerProps) => {
  const { state, dispatch } = useImportTransactionsContext();

  const [api, contextHolder] = message.useMessage();

  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const handleShowAllCategoriesClick = () => {
    setSelectedCategory(undefined);
  };

  const getCategoriesToDisplay = () => {
    let categoriesToDisplay: Category[] = [];

    if (selectedCategory) {
      categoriesToDisplay.push(selectedCategory);
    } else {
      categoriesToDisplay = [...state.categories]
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .filter((cat) => cat.name);
    }

    return categoriesToDisplay;
  };

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
      id: generateRandomId(),
      name: formValues.payeeName,
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

  const buildTagDescription = (formValues: FormData) => {
    const itemToBeSaved: Description | Tag = {
      id: generateRandomId(),
      name: formValues.name,
    };

    return itemToBeSaved;
  };

  const buildCategory = (formValues: FormData) => {
    const categoryToBeSaved: Category = {
      id: selectedCategory?.id || generateRandomId(),
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
        const categoryToBeSaved = buildCategory(formValues);

        let savedCategory: Category | undefined = undefined;

        try {
          if (selectedCategory ? true : false) {
            savedCategory = await updateCategoryAPI(categoryToBeSaved);
          } else {
            savedCategory = await saveCategoryAPI(categoryToBeSaved);
          }
          if (savedCategory) {
            dispatch({
              type: ImportTransactionsActionType.SAVE_CATEGORY,
              payload: {
                name: managedProperty,
                category: savedCategory,
              },
            });
          }
        } catch (error) {
          console.error("Error on saving category:", error);
        }

        break;
      case ManagedProperty.DESC:
        const descToBeSaved = buildTagDescription(formValues);

        try {
          const desc = await saveDescriptionAPI(descToBeSaved);
          dispatch({
            type: ImportTransactionsActionType.SAVE_DESCRIPTION,
            payload: {
              name: managedProperty,
              description: desc,
            },
          });
        } catch (error) {
          console.error("Error on saving description:", error);
        }

        break;
      case ManagedProperty.TAG:
        const tagToBeSaved = buildTagDescription(formValues);

        try {
          const tag = await saveTagAPI(tagToBeSaved);
          dispatch({
            type: ImportTransactionsActionType.SAVE_TAG,
            payload: {
              name: managedProperty,
              tag: tag,
            },
          });
        } catch (error) {
          console.error("Error on saving tag:", error);
        }

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
            categories={getCategoriesToDisplay()}
            handleCategorySelect={handleCategorySelect}
            handleShowAllCategoriesClick={handleShowAllCategoriesClick}
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
            fieldPayeeName="payeeName"
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
    const selectedCategory: Category | undefined = findCategoryById(
      state.categories,
      +keys[0]
    );
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

function generateRandomId(): number {
  return Math.floor(Math.random() * 11) * -8;
}
