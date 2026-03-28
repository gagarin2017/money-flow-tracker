import { FormEvent, useState } from "react";
import { Empty } from "antd";
import { DirectoryTreeProps } from "antd/es/tree";
import { useImportTransactionsContext } from "../../../../context/import-transactions-context";
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
import ManageForm, { emptyFormValues, FormData } from "./manage-form";
import AddNewPayeeCard from "./manage-payees/add-new-payee-card";
import PayeeList from "./manage-payees/payee-list";
import Payee from "./model/payee";
import { ImportTransactionsActionType } from "../../../../context/import-transactions-context-helpers/constants";
import AddNewRuleCard from "./manage-rules/add-new-rule-card";
import Rule from "./model/rule";
import RuleList from "./manage-rules/rule-list";
import { useRules } from "../../../hooks/useRules";
import {
  NEW_PROP_VALID_SCHEMA,
  PAYEE_VALID_SCHEMA,
  RULE_VALID_SCHEMA,
} from "../import-transactions/validation-schemas/import-transaction-field-validation-schemas";
import ManagedPropertyComponent from "./managed-properties/managed-property-component";

export enum ManagedProperty {
  PAYEE = "Payee",
  CATEGORY = "Category",
  DESC = "Description",
  TAG = "Tag",
  RULE = "Rule",
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
  [
    ManagedProperty.RULE,
    {
      name: ManagedProperty.RULE,
      multipleName: `${ManagedProperty.RULE}s`,
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

  const { saveRule } = useRules();

  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  // if (loadingRules) return <div>Loading...</div>;
  // if (errorRules) return <div>Error: {errorRules.message}</div>;

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
      initialForm = emptyFormValues;
    }

    return initialForm;
  };

  const buildPayee = (formValues: FormData) => {
    const payeeToBeSaved: Payee = {
      id: generateRandomId(),
      name: formValues.name ?? "",
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

  const buildRule = (formValues: FormData) => {
    const ruleToBeSaved: Rule = {
      id: generateRandomId(),
      name: formValues.name ?? "n/a",
      payee: formValues.payee ?? undefined,
      matchingString: formValues.matchingString ?? "",
    };

    return ruleToBeSaved;
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
      case ManagedProperty.RULE:
        const newRule = buildRule(formValues);

        const savedRule: Rule = await saveRule(newRule);

        dispatch({
          type: ImportTransactionsActionType.SAVE_RULE,
          payload: { name: managedProperty, rule: savedRule },
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
  };

  const getManagedPropertyComponent = (handleSubmit: {
    (e?: FormEvent<HTMLFormElement> | undefined): void;
    (): void;
  }) => {
    switch (managedProperty) {
      case ManagedProperty.PAYEE: {
        const list = <PayeeList />;
        const card = (
          <AddNewPayeeCard
            fieldPayeeName="name"
            fieldCategory="category"
            fieldDescription="description"
            fieldTag="tag"
            fieldAmount="amount"
            handleAddPayeeBtnClick={handleSubmit}
          />
        );

        return (
          <ManagedPropertyComponent managedPropsTable={list} formBody={card} />
        );
      }
      case ManagedProperty.CATEGORY: {
        const list = (
          <CategoriesList
            handleCategoryEdit={handleEditCategory}
            selectedCategory={selectedCategory}
            categories={getCategoriesToDisplay()}
            handleCategorySelect={handleCategorySelect}
            handleShowAllCategoriesClick={handleShowAllCategoriesClick}
          />
        );

        const card = (
          <AddNewCategoryCard
            fieldCategoryName="name"
            isSubcategoryFieldName="isSubcategory"
            subCategoryOfFieldName="category"
            handleAddCategoryBtnClick={handleSubmit}
          />
        );

        return (
          <ManagedPropertyComponent managedPropsTable={list} formBody={card} />
        );
      }
      case ManagedProperty.DESC: {
        const list = <DescriptionList />;
        const card = (
          <AddNewDescriptionCard
            name="name"
            handleAddDescriptionBtnClick={handleSubmit}
          />
        );

        return (
          <ManagedPropertyComponent managedPropsTable={list} formBody={card} />
        );
      }
      case ManagedProperty.TAG: {
        const list = <DescriptionList isTag />;
        const card = (
          <AddNewDescriptionCard
            name="name"
            handleAddDescriptionBtnClick={handleSubmit}
            isTag
          />
        );
        return (
          <ManagedPropertyComponent managedPropsTable={list} formBody={card} />
        );
      }
      case ManagedProperty.RULE: {
        const list = <RuleList />;
        const card = (
          <AddNewRuleCard
            name="name"
            fieldMatchingString="matchingString"
            fieldPayee="payee"
            handleAddRuleBtnClick={handleSubmit}
          />
        );
        return (
          <ManagedPropertyComponent managedPropsTable={list} formBody={card} />
        );
      }
      default:
        return <Empty />;
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

  function getValidationSchema() {
    switch (managedProperty) {
      case ManagedProperty.RULE:
        return RULE_VALID_SCHEMA;
      case ManagedProperty.PAYEE:
        return PAYEE_VALID_SCHEMA;
      default:
        return NEW_PROP_VALID_SCHEMA;
    }
  }

  return (
    <ManageForm
      initialFormValues={getInitialValues()}
      isModalVisible={state.isManageFormVisible}
      modalTitle={theTitle}
      getFormContent={getManagedPropertyComponent}
      handleOnSubmit={onSubmit}
      validationSchema={getValidationSchema()}
    />
  );
};

export default PayeeCatDescTagManager;

function generateRandomId(): number {
  return Math.floor(Math.random() * 11) * -8;
}
