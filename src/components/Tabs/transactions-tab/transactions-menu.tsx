import { Button } from "antd";
import ImportTransactionsForm from "./ImportTransactionsForm/import-transactions-form";
import { useState } from "react";
import AddTransactionsForm, {
  AccountTransaction,
} from "./AddTransactionsForm/add-transactions-form";
import { Transaction } from "../../../model/transaction";
import { FileParserResults } from "./ImportTransactionsForm/model/file-parser-results";
import { useBankAccountsContext } from "../../../context/bank-accounts-context";
import { transformParsedTransactions } from "./AddTransactionsForm/add-transactions-utils";

function TransactionsMenu() {
  const { bankAccounts } = useBankAccountsContext();

  const [isImportTransactionsFormVisible, setImportTransactionsFormVisible] =
    useState<boolean>(false);

  const [
    isAddTransactionsFormModalVisible,
    setAddTransactionsFormModalVisible,
  ] = useState<boolean>(false);

  const [newTransactions, setNewTransactions] = useState<AccountTransaction[]>(
    []
  );

  const handleOpenCloseOfImportTransactionsForm = () => {
    setImportTransactionsFormVisible(!isImportTransactionsFormVisible);
  };

  const populateFileTransactions = (fileParserResults: FileParserResults[]) => {
    const accountTransactions = transformParsedTransactions(
      fileParserResults,
      bankAccounts
    );

    if (!isAddTransactionsFormModalVisible && accountTransactions.length > 0) {
      setNewTransactions(accountTransactions);
      setAddTransactionsFormModalVisible(true);
    }
  };

  const handleAddTransactionsFormModalVisibility = () => {
    setAddTransactionsFormModalVisible(!isAddTransactionsFormModalVisible);
  };

  return (
    <>
      <Button onClick={handleOpenCloseOfImportTransactionsForm}>Import</Button>;
      <ImportTransactionsForm
        isImportTransactionsModalVisible={isImportTransactionsFormVisible}
        handleFormClose={handleOpenCloseOfImportTransactionsForm}
        populateFileTransactions={populateFileTransactions}
      />
      {newTransactions && newTransactions.length > 0 && (
        <AddTransactionsForm
          parsedTransactions={newTransactions}
          isAddTransactionsFormModalVisible={isAddTransactionsFormModalVisible}
          handleAddTransactionsFormModalVisibility={
            handleAddTransactionsFormModalVisibility
          }
        />
      )}
    </>
  );
}

export default TransactionsMenu;
