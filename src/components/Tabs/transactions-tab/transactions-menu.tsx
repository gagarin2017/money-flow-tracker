import { Button } from "antd";
import ImportTransactionsForm from "./ImportTransactionsForm/import-transactions-form";
import { useState } from "react";

function TransactionsMenu() {
  const [isImportTransactionsFormVisible, setImportTransactionsFormVisible] =
    useState<boolean>(false);

  const handleOpenCloseOfImportTransactionsForm = () => {
    setImportTransactionsFormVisible(!isImportTransactionsFormVisible);
  };

  return (
    <>
      <Button onClick={handleOpenCloseOfImportTransactionsForm}>Add</Button>;
      <ImportTransactionsForm
        isImportTransactionsModalVisible={isImportTransactionsFormVisible}
        handleFormClose={handleOpenCloseOfImportTransactionsForm}
      />
    </>
  );
}

export default TransactionsMenu;
