import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  Dispatch,
} from "react";
import useFilteredTransactions from "./components/hooks/useFilteredTransactions";

interface State {
  data: any | null;
  loading: boolean;
  error: Error | null;
  parserResults: any[];
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: State = {
  data: null,
  loading: false,
  error: null,
  parserResults: [],
};

const DataContext = createContext<
  { state: State; dispatch: Dispatch<Action> } | undefined
>(undefined);

const dataReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_NEW_TXS":
      return { ...state, data: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_PARSER_RESULTS":
      console.log("Setting up the parser results: ", action.payload);
      return { ...state, parserResults: action.payload };
    case "UPDATE_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const { tableTransactions, error } = useFilteredTransactions(
    state.parserResults
  );

  useEffect(() => {
    console.log("tableTransactions:", tableTransactions); // Log tableTransactions
    if (tableTransactions && tableTransactions.length > 0) {
      dispatch({ type: "ADD_NEW_TXS", payload: tableTransactions });
    }
    if (error) {
      dispatch({ type: "FETCH_ERROR", payload: error });
    }
  }, [tableTransactions, error]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
