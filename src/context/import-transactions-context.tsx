import { Dispatch, createContext, useContext, useReducer } from "react";
import { AccountTransaction } from "../components/Tabs/transactions-tab/AddTransactionsForm/add-transactions-form";
import { transformParsedTransactions } from "../components/Tabs/transactions-tab/AddTransactionsForm/add-transactions-utils";
import { FileParserResults } from "../components/Tabs/transactions-tab/ImportTransactionsForm/model/file-parser-results";
import BankAccount from "../model/bank-account";
import { Category } from "../model/category";
import Error from "../model/error";

export const enum ImportTransactionsActionType {
  FETCH_START = "StartFetchingData",
  ADD_ERROR = "FetchingErrors",
  IMPORT_TXS_FORM_VISIBLE = "ImportTransactionsFormVisible",
  ADD_TXS_FORM_VISIBLE = "AddTransactionsFormModalVisible",
  ADD_NEW_TXS = "AddNewTransactions",
  SET_CATEGORIES = "GetCategories",
}

// Define the state type
export interface ImportTransactionsState {
  isImportTransactionsFormVisible: boolean;
  isAddTransactionsFormModalVisible: boolean;
  newTransactions: AccountTransaction[];
  isLoading: boolean;
  errors: Error[];
  categories: Category[];
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
      type: ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.SET_CATEGORIES;
      payload: Category[];
    }
  | {
      type: ImportTransactionsActionType.ADD_NEW_TXS;
      payload: {
        bankAccounts: BankAccount[];
        parserResults: FileParserResults[];
      };
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
      return { ...state, isLoading: true };
    case ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE:
      return { ...state, isImportTransactionsFormVisible: action.payload };
    case ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE:
      return { ...state, isAddTransactionsFormModalVisible: action.payload };
    case ImportTransactionsActionType.SET_CATEGORIES:
      return { ...state, isLoading: false, categories: action.payload };
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

function ImportTransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(newTransactionsReducer, {
    isImportTransactionsFormVisible: false,
    isAddTransactionsFormModalVisible: false,
    newTransactions: [],
    categories: [],
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
