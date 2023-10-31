import { Alert } from "antd";

/**
 * This component displays the informational message when there are no transactions found to be imported.
 */
const ImportTransactionsEmptyList = () => {
  return (
    <Alert
      message="Nothing to import, yo!"
      description="Good news! It looks like all the transactions are up to date and there's nothing to import"
      type="info"
      showIcon
    />
  );
};

export default ImportTransactionsEmptyList;
