import { Dispatch, createContext, useContext, useReducer } from "react";
import { AccountTransaction } from "../components/Tabs/transactions-tab/AddTransactionsForm/add-transactions-form";
import { transformParsedTransactions } from "../components/Tabs/transactions-tab/add-transactions-utils";
import { FileParserResults } from "../components/Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import BankAccount from "../model/bank-account";
import { Category } from "../model/category";
import Error from "../model/error";
import { Tag } from "../model/tag";
import Payee from "../components/Tabs/transactions-tab/AddTransactionsForm/model/payee";
import { deletePayeeAPI, savePayeeAPI } from "../components/services/payee-api";
import { Description } from "../model/description";
import { ManagedProperty } from "../components/Tabs/transactions-tab/AddTransactionsForm/manage-payee-cat-desc-tag-form";
import {
  deleteCategoryAPI,
  saveCategoryAPI,
} from "../components/services/categories-api";

export const enum ImportTransactionsActionType {
  FETCH_START = "StartFetchingData",
  ADD_ERROR = "FetchingErrors",
  IMPORT_TXS_FORM_VISIBLE = "ImportTransactionsFormVisible",
  IMPORT_SINGLE_TXS_FORM_VISIBLE = "ImportSingleTransactionsFormVisible",
  ADD_TXS_FORM_VISIBLE = "AddTransactionsFormModalVisible",
  MANAGE_PAYEE_CAT_DESC_TAG_FORM_VISIBLE = "ManagePayeeCatDescTagForm",
  ADD_NEW_TXS = "AddNewTransactions",
  SAVE_PAYEE = "SavePayee",
  SAVE_CATEGORY = "SaveCategory",
  DELETE_PAYEE = "DeletePayee",
  DELETE_CATEGORY = "DeleteCategory",
  DELETE_DESCRIPTION = "DeleteDescription",
  DELETE_TAG = "DeleteTag",
  SET_CATEGORIES = "SetCategories",
  SET_DESCRIPTIONS = "SetDescriptions",
  SET_TAGS = "SetTags",
  SET_PAYEES = "SetPayees",
}

// Define the state type
export interface ImportTransactionsState {
  isImportTransactionsFormVisible: boolean;
  isImportSingleTransactionsFormVisible: boolean;
  isAddTransactionsFormModalVisible: boolean;
  isManagePayeeCatDescTagFormVisible: boolean;
  newTransactions: AccountTransaction[];
  isLoading: boolean;
  errors: Error[];
  categories: Category[];
  tags: Tag[];
  descriptions: Description[];
  payees: Payee[];
}

// Define the action type
type ImportTransactionsAction =
  | {
      type: ImportTransactionsActionType.FETCH_START;
    }
  | {
      type: ImportTransactionsActionType.ADD_ERROR;
      payload: Error;
    }
  | {
      type: ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.IMPORT_SINGLE_TXS_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.MANAGE_PAYEE_CAT_DESC_TAG_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.SET_CATEGORIES;
      payload: Category[];
    }
  | {
      type: ImportTransactionsActionType.SET_DESCRIPTIONS;
      payload: Description[];
    }
  | {
      type: ImportTransactionsActionType.SET_TAGS;
      payload: Tag[];
    }
  | {
      type: ImportTransactionsActionType.SET_PAYEES;
      payload: Payee[];
    }
  | {
      type: ImportTransactionsActionType.ADD_NEW_TXS;
      payload: {
        bankAccounts: BankAccount[];
        parserResults: FileParserResults[];
      };
    }
  | {
      type: ImportTransactionsActionType.SAVE_PAYEE;
      payload: {
        name: ManagedProperty;
        payee?: Payee;
        category?: Category;
        description?: Description;
        tag?: Tag;
      };
    }
  | {
      type: ImportTransactionsActionType.SAVE_CATEGORY;
      payload: {
        name: ManagedProperty;
        category: Category;
      };
    }
  | {
      type: ImportTransactionsActionType.DELETE_PAYEE;
      payload: number;
    }
  | {
      type: ImportTransactionsActionType.DELETE_CATEGORY;
      payload: number;
    }
  | {
      type: ImportTransactionsActionType.DELETE_DESCRIPTION;
      payload: number;
    }
  | {
      type: ImportTransactionsActionType.DELETE_TAG;
      payload: number;
    };

// Define the context type
interface ImportTransactionsContextProps {
  state: ImportTransactionsState;
  dispatch: Dispatch<ImportTransactionsAction>;
}

const ImportTransactionsContext = createContext<
  ImportTransactionsContextProps | undefined
>(undefined);

// Define the reducer function
const newTransactionsReducer = (
  state: ImportTransactionsState,
  action: ImportTransactionsAction
): ImportTransactionsState => {
  switch (action.type) {
    case ImportTransactionsActionType.FETCH_START:
      return { ...state, isLoading: true, errors: [] };
    case ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE:
      return { ...state, isImportTransactionsFormVisible: action.payload };
    case ImportTransactionsActionType.IMPORT_SINGLE_TXS_FORM_VISIBLE:
      return {
        ...state,
        isImportSingleTransactionsFormVisible: action.payload,
      };
    case ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE:
      return { ...state, isAddTransactionsFormModalVisible: action.payload };
    case ImportTransactionsActionType.MANAGE_PAYEE_CAT_DESC_TAG_FORM_VISIBLE:
      return { ...state, isManagePayeeCatDescTagFormVisible: action.payload };
    case ImportTransactionsActionType.SAVE_PAYEE:
      action.payload.payee && savePayee(action.payload.payee);
      return {
        ...state,
        payees: action.payload.payee
          ? [...state.payees, action.payload.payee]
          : [],
      };
    case ImportTransactionsActionType.SAVE_CATEGORY:
      console.log("action.payload: ", action.payload);
      action.payload.category && saveCategory(action.payload.category);
      return {
        ...state,
        categories: action.payload.category
          ? [...state.categories, action.payload.category]
          : [],
      };
    case ImportTransactionsActionType.DELETE_PAYEE:
      deletePayee(action.payload);
      const updatedPayees = state.payees.filter(
        (payee) => payee.id !== action.payload
      );
      return { ...state, payees: updatedPayees };
    case ImportTransactionsActionType.DELETE_CATEGORY:
      deleteCategory(action.payload);
      const updatedCategories = state.categories.filter(
        (category) => category.id !== action.payload
      );
      return { ...state, categories: updatedCategories };
    case ImportTransactionsActionType.DELETE_DESCRIPTION:
      deleteDescription(action.payload);
      const updatedDescriptions = state.descriptions.filter(
        (payee) => payee.id !== action.payload
      );
      return { ...state, descriptions: updatedDescriptions };
    case ImportTransactionsActionType.DELETE_TAG:
      // deletePayee(action.payload);
      const updatedTags = state.tags.filter(
        (payee) => payee.id !== action.payload
      );
      return { ...state, tags: updatedTags };
    case ImportTransactionsActionType.SET_CATEGORIES:
      return { ...state, isLoading: false, categories: action.payload };
    case ImportTransactionsActionType.SET_DESCRIPTIONS:
      return { ...state, isLoading: false, descriptions: action.payload };
    case ImportTransactionsActionType.SET_TAGS:
      return { ...state, isLoading: false, tags: action.payload };
    case ImportTransactionsActionType.SET_PAYEES:
      return { ...state, isLoading: false, payees: action.payload };
    case ImportTransactionsActionType.ADD_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: [...state.errors, action.payload],
      };
    case ImportTransactionsActionType.ADD_NEW_TXS:
      const accountTransactions = transformParsedTransactions(
        action.payload.parserResults,
        action.payload.bankAccounts
      );

      if (
        !state.isAddTransactionsFormModalVisible &&
        accountTransactions.length > 0
      ) {
        return {
          ...state,
          isAddTransactionsFormModalVisible: true,
          newTransactions: accountTransactions,
        };
      } else {
        return { ...state, newTransactions: [] };
      }
    default:
      return state;
  }
};

const savePayee = async (payee: Payee) => {
  try {
    await savePayeeAPI(payee);
  } catch (error) {
    console.error("Error on saving payee:", error);
  }
};

const saveCategory = async (category: Category) => {
  try {
    await saveCategoryAPI(category);
  } catch (error) {
    console.error("Error on saving category:", error);
  }
};

const deletePayee = async (payeeId: number) => {
  try {
    await deletePayeeAPI(payeeId);
  } catch (error) {
    console.error("Error on deleting payee:", error);
  }
};

const deleteCategory = async (categoryId: number) => {
  try {
    await deleteCategoryAPI(categoryId);
  } catch (error) {
    console.error("Error on deleting category:", error);
  }
};

const deleteDescription = async (descId: number) => {
  try {
    await deletePayeeAPI(descId);
  } catch (error) {
    console.error("Error deleting description:", error);
  }
};

function ImportTransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(newTransactionsReducer, {
    isImportSingleTransactionsFormVisible: false,
    isImportTransactionsFormVisible: false,
    isAddTransactionsFormModalVisible: false,
    isManagePayeeCatDescTagFormVisible: false,
    newTransactions: [],
    categories: [],
    descriptions: [],
    tags: [],
    payees: [],
    isLoading: false,
    errors: [],
  });

  return (
    <ImportTransactionsContext.Provider value={{ state, dispatch }}>
      {children}
    </ImportTransactionsContext.Provider>
  );
}

// Custom hook to consume the context
export const useImportTransactionsContext =
  (): ImportTransactionsContextProps => {
    const context = useContext(ImportTransactionsContext);
    if (!context) {
      throw new Error(
        "useImportTransactionsContext must be used within an ImportTransactionsProvider"
      );
    }
    return context;
  };

export { ImportTransactionsProvider };
