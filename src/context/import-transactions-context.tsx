import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import useFilteredTransactions from "../components/hooks/useFilteredTransactions";
import { ImportTransactionsActionType } from "./import-transactions-context-helpers/constants";
import {
  handleFormsVisibility,
  handleNewTransactionsImport,
  handleSetErrors,
  handleSetLoading,
  handleTransactionsElements,
} from "./import-transactions-context-helpers/reducer-helpers";
import {
  ImportTransactionsAction,
  ImportTransactionsState,
} from "./import-transactions-context-helpers/types";
import { FormTransaction } from "../components/Tabs/transactions-tab/add-transactions-utils";

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
  // Make sure the reducer function is using the state = initialState fallback:
  // Without state = initialState, React passes undefined on first render and state.rules becomes undefined
  state: ImportTransactionsState = initialState,
  action: ImportTransactionsAction
): ImportTransactionsState => {
  switch (action.type) {
    case ImportTransactionsActionType.SET_LOADING:
      return handleSetLoading(state, action);

    // Error handling
    case ImportTransactionsActionType.ADD_API_ERROR:
    case ImportTransactionsActionType.ADD_PARSING_ERRORS:
    case ImportTransactionsActionType.SET_DATA_FETCH_ERROR:
      return handleSetErrors(state, action);

    // Hadnling the New transactions to be imported
    case ImportTransactionsActionType.SET_TRANSACTIONS_BANK_ACC_PAIRS:
    case ImportTransactionsActionType.ADD_FILTERED_TRANSACTIONS:
    case ImportTransactionsActionType.SET_EDITED_TRANSACTION:
      return handleNewTransactionsImport(state, action);

    // Forms management
    case ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE:
    case ImportTransactionsActionType.IMPORT_SINGLE_TXS_FORM_VISIBLE:
    case ImportTransactionsActionType.EDIT_TXS_FORM_VISIBLE:
    case ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE:
    case ImportTransactionsActionType.MANAGE_FORM_VISIBLE:
      return handleFormsVisibility(state, action);

    // Transaction's elements
    case ImportTransactionsActionType.SAVE_PAYEE:
    case ImportTransactionsActionType.SAVE_RULE:
    case ImportTransactionsActionType.SAVE_CATEGORY:
    case ImportTransactionsActionType.SAVE_DESCRIPTION:
    case ImportTransactionsActionType.SAVE_TAG:
    case ImportTransactionsActionType.DELETE_PAYEE:
    case ImportTransactionsActionType.DELETE_RULE:
    case ImportTransactionsActionType.DELETE_CATEGORY:
    case ImportTransactionsActionType.DELETE_DESCRIPTION:
    case ImportTransactionsActionType.DELETE_TAG:
    case ImportTransactionsActionType.SET_CATEGORIES:
    case ImportTransactionsActionType.SET_DESCRIPTIONS:
    case ImportTransactionsActionType.SET_TAGS:
    case ImportTransactionsActionType.SET_PAYEES:
    case ImportTransactionsActionType.SET_RULES:
      return handleTransactionsElements(state, action);

    default:
      return state;
  }
};

const initialState: ImportTransactionsState = {
  isImportTransactionsFormVisible: false,
  isImportSingleTransactionsFormVisible: false,
  isEditTransactionsFormVisible: false,
  isAddTransactionsFormModalVisible: false,
  isManageFormVisible: false,

  transactionsFileBankAccountPairs: [],
  filteredTansactions: [],
  isLoading: false,
  errors: [],
  error: null,
  fileParsingErrors: [],
  editedTransaction: undefined,

  categories: [],
  tags: [],
  descriptions: [],
  payees: [],
  rules: [],
  fileParserResults: [],
  activeBankAccounts: [],
};

function ImportTransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(newTransactionsReducer, initialState);

  const { tableTransactions, isLoading, error, parsingErrors } =
    useFilteredTransactions(state.transactionsFileBankAccountPairs);

  useEffect(() => {
    dispatch({
      type: ImportTransactionsActionType.SET_LOADING,
      payload: isLoading,
    });

    if (tableTransactions) {
      dispatch({
        type: ImportTransactionsActionType.ADD_FILTERED_TRANSACTIONS,
        payload: tableTransactions,
      });
    }
    if (error) {
      dispatch({
        type: ImportTransactionsActionType.SET_DATA_FETCH_ERROR,
        payload: error,
      });
    }
    if (parsingErrors) {
      dispatch({
        type: ImportTransactionsActionType.ADD_PARSING_ERRORS,
        payload: parsingErrors,
      });
    }
  }, [tableTransactions, error, isLoading, parsingErrors]);

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
