import { List } from "antd";
import BankAccountsAutocomplete from "./bank-accounts-autocomplete";

interface TransactionsFileBankAccountPairProps {
  file: any;
  formikArrayHelper: any;
}

const TransactionsFileBankAccountPair = ({
  file,
  formikArrayHelper,
}: TransactionsFileBankAccountPairProps) => {
  return (
    <List.Item>
      <span>{`File "${file.name}"`}</span>
      <BankAccountsAutocomplete
        file={file}
        formikArrayHelper={formikArrayHelper}
      />
    </List.Item>
  );
};

export default TransactionsFileBankAccountPair;
