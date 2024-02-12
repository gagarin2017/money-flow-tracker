import { Dispatch, createContext, useContext, useReducer } from "react";
import { AccountTransaction } from "../components/Tabs/transactions-tab/AddTransactionsForm/add-transactions-form";
import Payee from "../components/Tabs/transactions-tab/AddTransactionsForm/model/payee";
import { ManagedProperty } from "../components/Tabs/transactions-tab/AddTransactionsForm/payee-cat-desc-tag-manager";
import { FileParserResults } from "../components/Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import { transformParsedTransactions } from "../components/Tabs/transactions-tab/add-transactions-utils";
import {
  saveCategoryAPI,
  updateCategoryAPI,
} from "../components/services/categories-api";
import { deleteDescriptionAPI } from "../components/services/descriptions-api";
import { deletePayeeAPI, savePayeeAPI } from "../components/services/payee-api";
import BankAccount from "../model/bank-account";
import { Category } from "../model/category";
import { Description } from "../model/description";
import Error from "../model/error";
import { Tag } from "../model/tag";
import { addCategory } from "../utils/category-helper";

export const enum ImportTransactionsActionType {
  FETCH_START = "StartFetchingData",
  ADD_ERROR = "FetchingErrors",
  IMPORT_TXS_FORM_VISIBLE = "ImportTransactionsFormVisible",
  IMPORT_SINGLE_TXS_FORM_VISIBLE = "ImportSingleTransactionsFormVisible",
  ADD_TXS_FORM_VISIBLE = "AddTransactionsFormModalVisible",
  MANAGE_FORM_VISIBLE = "ManagePayeeCatDescTagForm",
  ADD_NEW_TXS = "AddNewTransactions",
  SAVE_PAYEE = "SavePayee",
  SAVE_CATEGORY = "SaveCategory",
  SAVE_DESCRIPTION = "SaveDescription",
  SAVE_TAG = "SaveTag",
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
  isManageFormVisible: boolean;
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
      type: ImportTransactionsActionType.MANAGE_FORM_VISIBLE;
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
        update: boolean;
      };
    }
  | {
      type: ImportTransactionsActionType.SAVE_DESCRIPTION;
      payload: {
        name: ManagedProperty;
        description: Description;
      };
    }
  | {
      type: ImportTransactionsActionType.SAVE_TAG;
      payload: {
        name: ManagedProperty;
        tag: Tag;
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
    case ImportTransactionsActionType.MANAGE_FORM_VISIBLE:
      return { ...state, isManageFormVisible: action.payload };
    case ImportTransactionsActionType.SAVE_PAYEE:
      action.payload.payee && savePayee(action.payload.payee);
      return {
        ...state,
        payees: action.payload.payee
          ? [...state.payees, action.payload.payee]
          : state.payees,
      };
    case ImportTransactionsActionType.SAVE_CATEGORY:
      action.payload.category && saveCategory(action.payload);

      let updatedState = { ...state };

      const category = action.payload.category;

      const updatedCategory = [...state.categories];

      addCategory(updatedCategory, category);

      updatedState = {
        ...state,
        categories: action.payload.category
          ? updatedCategory
          : state.categories,
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
    case ImportTransactionsActionType.DELETE_CATEGORY:
      const updatedCategories = state.categories.filter(
        (category) => category.id !== action.payload
      );

      return { ...state, categories: updatedCategories };
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

const saveCategory = async (payload: {
  name: ManagedProperty;
  category: Category;
  update: boolean;
}) => {
  try {
    if (payload.update) {
      await updateCategoryAPI(payload.category);
    } else {
      await saveCategoryAPI(payload.category);
    }
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

function ImportTransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(newTransactionsReducer, {
    isImportSingleTransactionsFormVisible: false,
    isImportTransactionsFormVisible: false,
    isAddTransactionsFormModalVisible: false,
    isManageFormVisible: false,
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
