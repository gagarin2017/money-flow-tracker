import {
  savePayeeAPI,
  deletePayeeAPI,
} from "../../components/services/payee-api";
import Payee from "../../components/Tabs/transactions-tab/AddTransactionsForm/model/payee";
import {
  addCategoryToList,
  deepDeleteCategoryFromList,
} from "../../utils/category-helper";
import { ImportTransactionsActionType } from "./constants";
import { ImportTransactionsState, ImportTransactionsAction } from "./types";

export const handleSetLoading = (
  state: ImportTransactionsState,
  action: ImportTransactionsAction
) => {
  console.log("SET_LOADING current state: isLoading: ", state.isLoading);
  console.log(
    "SET_LOADING current state setting isLoading to true. isLoading: " +
      action.payload
  );
  return { ...state, isLoading: action.payload };
};

export const handleSetErrors = (
  state: ImportTransactionsState,
  action: ImportTransactionsAction
) => {
  switch (action.type) {
    case ImportTransactionsActionType.ADD_API_ERROR:
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };
    case ImportTransactionsActionType.ADD_PARSING_ERRORS:
      return {
        ...state,
        fileParsingErrors: [...state.fileParsingErrors, ...action.payload],
      };
    case ImportTransactionsActionType.SET_DATA_FETCH_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const handleNewTransactionsImport = (
  state: ImportTransactionsState,
  action: ImportTransactionsAction
) => {
  switch (action.type) {
    case ImportTransactionsActionType.SET_TRANSACTIONS_BANK_ACC_PAIRS: {
      return {
        ...state,
        transactionsFileBankAccountPairs: action.payload,
        fileParsingErrors: [],
        filteredTansactions: [],
      };
    }
    case ImportTransactionsActionType.ADD_FILTERED_TRANSACTIONS:
      return {
        ...state,
        filteredTansactions: action.payload,
      };
    case ImportTransactionsActionType.SET_EDITED_TRANSACTION:
      return {
        ...state,
        editedTransaction: action.payload,
      };
    default:
      return state;
  }
};

export const handleFormsVisibility = (
  state: ImportTransactionsState,
  action: ImportTransactionsAction
) => {
  switch (action.type) {
    case ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE:
      return { ...state, isImportTransactionsFormVisible: action.payload };
    case ImportTransactionsActionType.IMPORT_SINGLE_TXS_FORM_VISIBLE:
      return {
        ...state,
        isImportSingleTransactionsFormVisible: action.payload,
      };
    case ImportTransactionsActionType.EDIT_TXS_FORM_VISIBLE:
      return {
        ...state,
        isEditTransactionsFormVisible: action.payload,
      };
    case ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE:
      return { ...state, isAddTransactionsFormModalVisible: action.payload };
    case ImportTransactionsActionType.MANAGE_FORM_VISIBLE:
      return { ...state, isManageFormVisible: action.payload };
    default:
      return state;
  }
};

export const handleTransactionsElements = (
  state: ImportTransactionsState,
  action: ImportTransactionsAction
) => {
  switch (action.type) {
    case ImportTransactionsActionType.SAVE_PAYEE:
      const newPayee: Payee | undefined = action.payload.payee;

      let newState = state;

      if (newPayee) {
        newState = {
          ...state,
          payees: getUpdatedPayees(state.payees, newPayee),
        };

        savePayee(newPayee);
      }

      return newState;
    case ImportTransactionsActionType.SAVE_RULE:
      console.log("Saving Rule in reducer-helper:", action.payload.rule);
      console.log("State rules: ", state.rules);

      return {
        ...state,
        rules: action.payload.rule
          ? [...state.rules, action.payload.rule]
          : state.rules,
      };
    case ImportTransactionsActionType.SAVE_CATEGORY:
      const category = action.payload.category;

      const updatedCategoryState = addCategoryToList(
        [...state.categories],
        category
      );

      const updatedState = {
        ...state,
        categories: category ? updatedCategoryState : state.categories,
      };

      return updatedState;
    case ImportTransactionsActionType.SAVE_DESCRIPTION:
      return {
        ...state,
        descriptions: action.payload.description
          ? [...state.descriptions, action.payload.description]
          : state.descriptions,
      };
    case ImportTransactionsActionType.SAVE_TAG:
      return {
        ...state,
        tags: action.payload.tag
          ? [...state.tags, action.payload.tag]
          : state.tags,
      };
    case ImportTransactionsActionType.DELETE_PAYEE:
      deletePayee(action.payload);
      const updatedPayees = state.payees.filter(
        (payee) => payee.id !== action.payload
      );
      return { ...state, payees: updatedPayees };

    case ImportTransactionsActionType.DELETE_RULE:
      // deletePayee(action.payload);
      const updatedRules = state.rules.filter(
        (rule) => rule.id !== action.payload
      );

      return { ...state, rules: updatedRules };
    case ImportTransactionsActionType.DELETE_CATEGORY: {
      const updatedCategories = deepDeleteCategoryFromList(
        [...state.categories],
        action.payload
      );

      return { ...state, categories: updatedCategories };
    }
    case ImportTransactionsActionType.DELETE_DESCRIPTION:
      const updatedDescriptions = state.descriptions.filter(
        (desc) => desc.id !== action.payload
      );
      return { ...state, descriptions: updatedDescriptions };
    case ImportTransactionsActionType.DELETE_TAG:
      const updatedTags = state.tags.filter(
        (payee) => payee.id !== action.payload
      );
      return { ...state, tags: updatedTags };
    case ImportTransactionsActionType.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case ImportTransactionsActionType.SET_DESCRIPTIONS:
      return { ...state, descriptions: action.payload };
    case ImportTransactionsActionType.SET_TAGS:
      return { ...state, tags: action.payload };
    case ImportTransactionsActionType.SET_PAYEES:
      return { ...state, payees: action.payload };
    case ImportTransactionsActionType.SET_RULES:
      return { ...state, rules: action.payload };
    default:
      return state;
  }
};

// Helper function to update payees
function getUpdatedPayees(payees: unknown, payee: Payee): Payee[] {
  if (!Array.isArray(payees)) {
    return payee ? [payee] : [];
  }

  // Append new payee if it exists and filter out undefined/null
  return [...payees, payee].filter(Boolean);
}

const savePayee = async (payee: Payee) => {
  try {
    await savePayeeAPI(payee);
  } catch (error) {
    console.error("Error on saving payee:", error);
  }
};

const deletePayee = async (payeeId: number) => {
  try {
    await deletePayeeAPI(payeeId);
  } catch (error) {
    console.error("Error on deleting payee:", error);
  }
};
