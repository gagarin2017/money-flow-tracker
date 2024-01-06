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

export const enum ImportTransactionsActionType {
  FETCH_START = "StartFetchingData",
  ADD_ERROR = "FetchingErrors",
  IMPORT_TXS_FORM_VISIBLE = "ImportTransactionsFormVisible",
  ADD_TXS_FORM_VISIBLE = "AddTransactionsFormModalVisible",
  MANAGE_PAYEE_MODAL_VISIBLE = "ManagePayeesModalVisible",
  ADD_NEW_TXS = "AddNewTransactions",
  ADD_NEW_PAYEE = "AddNewPayee",
  DELETE_PAYEE = "DeletePayee",
  SET_CATEGORIES = "SetCategories",
  SET_DESCRIPTIONS = "SetDescriptions",
  SET_TAGS = "SetTags",
  SET_PAYEES = "SetPayees",
}

// Define the state type
export interface ImportTransactionsState {
  isImportTransactionsFormVisible: boolean;
  isAddTransactionsFormModalVisible: boolean;
  isManagePayeesModalVisible: boolean;
  newTransactions: AccountTransaction[];
  // newPayee: Payee;
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
      type: ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.MANAGE_PAYEE_MODAL_VISIBLE;
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
      type: ImportTransactionsActionType.ADD_NEW_PAYEE;
      payload: Payee;
    }
  | {
      type: ImportTransactionsActionType.DELETE_PAYEE;
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
    case ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE:
      return { ...state, isAddTransactionsFormModalVisible: action.payload };
    case ImportTransactionsActionType.MANAGE_PAYEE_MODAL_VISIBLE:
      return { ...state, isManagePayeesModalVisible: action.payload };
    case ImportTransactionsActionType.ADD_NEW_PAYEE:
      // call saver method here
      savePayee(action.payload);
      console.log("new payee added: ", action.payload);
      return { ...state, payees: [...state.payees, action.payload] };
    case ImportTransactionsActionType.DELETE_PAYEE:
      // call remove method here
      deletePayee(action.payload);
      console.log("payee deleted: ", action.payload);
      const updatedCategories = state.payees.filter(
        (payee) => payee.id !== action.payload
      );
      return { ...state, payees: updatedCategories };
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
    console.error("Error updating payee:", error);
  }
};

const deletePayee = async (payeeId: number) => {
  try {
    await deletePayeeAPI(payeeId);
  } catch (error) {
    console.error("Error updating payee:", error);
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
    isManagePayeesModalVisible: false,
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
