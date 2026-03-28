import { Button } from "antd";
import React from "react";
import { DataProvider, useDataContext } from "./DataContext";
import { Category } from "./model/category";
import { Description } from "./model/description";
import { Tag } from "./model/tag";
import { ParsingStatus } from "./utils/TxFilesReader";
import { FileParserResults } from "./components/Tabs/transactions-tab/import-transactions/ImportTransactionsForm/model/file-parser-results";

const DataFetchingComponent: React.FC = () => {
  const { state, dispatch } = useDataContext();

  function handleOnFilterButtonClick(event: any): void {
    const dataToLoad: FileParserResults = {
      buildTransactionsForRequest: [
        {
          id: -1,
          date: new Date(),
          bankAccount: {
            id: 18,
            accountName: "",
            active: true,
            balance: 10,
            bankName: "",
            isSelected: true,
            bankLogo: "",
          },
          category: {} as Category,
          memo: "D/D PayPal Europe",
          description: {} as Description,
          tag: {} as Tag,
          runningBalance: 12045.84,
          debitAmount: 500,
          amount: 20,
          creditAmount: 23,
          previouslySavedTransaction: false,
        },
      ],
      status: ParsingStatus.FINISHED,
      accountId: 18,
      parsingErrors: [],
      fileName: "",
    };
    dispatch({
      type: "SET_PARSER_RESULTS",
      payload: [dataToLoad],
    });

    dispatch({ type: "UPDATE_LOADING", payload: true });
  }

  if (state.loading) {
    return <p>Loading...</p>;
  }

  if (state.error) {
    return <p>Error: {state.error.message}</p>;
  }

  return (
    <>
      <Button onClick={handleOnFilterButtonClick}>Filter</Button>
      {state.loading ? (
        <p>Loading...</p>
      ) : (
        <div>Data: {JSON.stringify(state.data)}</div>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <DataFetchingComponent />
    </DataProvider>
  );
};

export default App;
