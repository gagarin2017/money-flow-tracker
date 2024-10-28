import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { AccountWithTransactions } from "../components/Tabs/transactions-tab/AddTransactionsForm/add-transactions-form";
import Payee from "../components/Tabs/transactions-tab/AddTransactionsForm/model/payee";
import { ManagedProperty } from "../components/Tabs/transactions-tab/AddTransactionsForm/payee-cat-desc-tag-manager";
import { FileParserResults } from "../components/Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import { TransactionsFileBankAccountPair } from "../components/Tabs/transactions-tab/ImportTransactionsForm/model/transactions-file-bank-account";
import useFilteredTransactions from "../components/hooks/useFilteredTransactions";
import { deletePayeeAPI, savePayeeAPI } from "../components/services/payee-api";
import BankAccount from "../model/bank-account";
import { Category } from "../model/category";
import { Description } from "../model/description";
import { Tag } from "../model/tag";
import {
  addCategoryToList,
  deepDeleteCategoryFromList,
} from "../utils/category-helper";

export const enum ImportTransactionsActionType {
  SET_LOADING = "SetLoading",
  SET_TRANSACTIONS_BANK_ACC_PAIRS = "SetTransactionsBankAccountPairs",
  ADD_ERROR = "FetchingErrors",
  IMPORT_TXS_FORM_VISIBLE = "ImportTransactionsFormVisible",
  IMPORT_SINGLE_TXS_FORM_VISIBLE = "ImportSingleTransactionsFormVisible",
  ADD_TXS_FORM_VISIBLE = "AddTransactionsFormModalVisible",
  MANAGE_FORM_VISIBLE = "ManagePayeeCatDescTagForm",
  ADD_FILTERED_TRANSACTIONS = "AddFilteredTransactions",
  SET_DATA_FETCH_ERRROR = "SetDataFetchError",
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
  transactionsFileBankAccountPairs: TransactionsFileBankAccountPair[];
  filteredTansactions: AccountWithTransactions[];
  isLoading: boolean;
  errors: Error[];
  error: any | null; // fetch data error
  categories: Category[];
  tags: Tag[];
  descriptions: Description[];
  payees: Payee[];
  fileParserResults: FileParserResults[];
  activeBankAccounts: BankAccount[];
}

// Define the action type
type ImportTransactionsAction =
  | {
      type: ImportTransactionsActionType.SET_LOADING;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.SET_TRANSACTIONS_BANK_ACC_PAIRS;
      payload: TransactionsFileBankAccountPair[];
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
      type: ImportTransactionsActionType.ADD_FILTERED_TRANSACTIONS;
      payload: AccountWithTransactions[];
    }
  | {
      type: ImportTransactionsActionType.SET_DATA_FETCH_ERRROR;
      payload: any | null;
    }
  //--------------------------------
  // Manage form and its children
  //--------------------------------
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
    case ImportTransactionsActionType.SET_LOADING: {
      console.log("SET_LOADING current state: isLoading: ", state.isLoading);

      const newState = { ...state, isLoading: action.payload };
      console.log(
        "SET_LOADING current state setting isLoading to true. isLoading: " +
          newState.isLoading
      );
      return newState;
    }
    case ImportTransactionsActionType.SET_TRANSACTIONS_BANK_ACC_PAIRS: {
      return {
        ...state,
        transactionsFileBankAccountPairs: action.payload,
      };
    }
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
    case ImportTransactionsActionType.ADD_ERROR:
      return {
        ...state,
        // isLoading: false,
        errors: [...state.errors, action.payload],
      };
    case ImportTransactionsActionType.ADD_FILTERED_TRANSACTIONS:
      return {
        ...state,
        filteredTansactions: action.payload,
      };
    case ImportTransactionsActionType.SET_DATA_FETCH_ERRROR:
      return { ...state, error: action.payload };
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

const deletePayee = async (payeeId: number) => {
  try {
    await deletePayeeAPI(payeeId);
  } catch (error) {
    console.error("Error on deleting payee:", error);
  }
};

const initialState = {
  isImportTransactionsFormVisible: false,
  isImportSingleTransactionsFormVisible: false,
  isAddTransactionsFormModalVisible: false,
  isManageFormVisible: false,

  transactionsFileBankAccountPairs: [],
  newTransactions: [],
  filteredTansactions: [],
  isLoading: false,
  errors: [],
  error: null,

  categories: [],
  tags: [],
  descriptions: [],
  payees: [],
  fileParserResults: [],
  activeBankAccounts: [],
};

function ImportTransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(newTransactionsReducer, initialState);

  const { tableTransactions, isLoading, error } = useFilteredTransactions(
    state.transactionsFileBankAccountPairs
  );

  useEffect(() => {
    console.log("State data:", tableTransactions); // Additional log
    console.log("State error:", error); // Additional log
    console.log("State loading:", isLoading); // Additional log

    dispatch({
      type: ImportTransactionsActionType.SET_LOADING,
      payload: isLoading,
    });

    if (tableTransactions) {
      console.log("Dispatching ADD_NEW_TXS with data:", tableTransactions);
      dispatch({
        type: ImportTransactionsActionType.ADD_FILTERED_TRANSACTIONS,
        payload: tableTransactions,
      });
    }
    if (error) {
      console.log("Error occurred: ", error);
      dispatch({
        type: ImportTransactionsActionType.SET_DATA_FETCH_ERRROR,
        payload: error,
      });
    }
  }, [tableTransactions, error, isLoading]);

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
