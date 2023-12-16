import { Button } from "antd";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../context/import-transactions-context";
import AddTransactionsForm from "./AddTransactionsForm/add-transactions-form";
import ImportTransactionsForm from "./ImportTransactionsForm/import-transactions-form";

function TransactionsMenu() {
  const { state, dispatch } = useImportTransactionsContext();

  const handleOpenCloseOfImportTransactionsForm = () => {
    dispatch({
      type: ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE,
      payload: !state.isImportTransactionsFormVisible,
    });
  };

  return (
    <>
      <Button onClick={handleOpenCloseOfImportTransactionsForm}>Import</Button>
      <ImportTransactionsForm />
      {state.newTransactions && state.newTransactions.length > 0 && (
        <AddTransactionsForm />
      )}
    </>
  );
}

export default TransactionsMenu;
