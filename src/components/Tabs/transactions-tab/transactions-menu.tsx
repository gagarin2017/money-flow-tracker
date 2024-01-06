import { Button } from "antd";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../context/import-transactions-context";
import AddTransactionsForm from "./AddTransactionsForm/add-transactions-form";
import ImportTransactionsForm from "./ImportTransactionsForm/import-transactions-form";
import ManagePayeesModal from "./AddTransactionsForm/manage-payees/manage-payees-modal";
import { isSpringBoot } from "../../services/api-common";
import { fetchPayeesCategoriesTags } from "./add-transactions-utils";

function TransactionsMenu() {
  const { state, dispatch } = useImportTransactionsContext();

  const handleOpenCloseOfImportTransactionsForm = () => {
    dispatch({
      type: ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE,
      payload: !state.isImportTransactionsFormVisible,
    });
  };

  const handleOpenCloseOfManagePayeesModal = () => {
    dispatch({
      type: ImportTransactionsActionType.MANAGE_PAYEE_MODAL_VISIBLE,
      payload: !state.isManagePayeesModalVisible,
    });

    fetchPayeesCategoriesTags(isSpringBoot, dispatch);
  };

  return (
    <>
      <Button onClick={handleOpenCloseOfImportTransactionsForm}>Import</Button>
      <Button onClick={handleOpenCloseOfManagePayeesModal}>
        Manage Payees
      </Button>
      <ImportTransactionsForm />
      {state.newTransactions && state.newTransactions.length > 0 && (
        <AddTransactionsForm />
      )}
      <ManagePayeesModal />
    </>
  );
}

export default TransactionsMenu;
