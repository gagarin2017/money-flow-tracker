import { AutoComplete } from "antd";
import { useBankAccountsContext } from "../../../../context/bank-accounts-context";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/money-flow-tracker-store";

interface BankAccountsAutocompleteProps {
  file: any;
  formikArrayHelper: any;
}
/*
 * the autocomplete input field for the Import transactions form.
 * Contains list of ACTIVE bank accounts
 */
const BankAccountsAutocomplete = ({
  file,
  formikArrayHelper,
}: BankAccountsAutocompleteProps) => {
  const { bankAccounts } = useBankAccountsContext();

  const onSelect = (value: string, option: any) => {
    formikArrayHelper.push({
      file: file,
      bankAccountId: option.accountid,
    });
  };

  const bankAccountOptions = bankAccounts.map((account) => {
    const bankAccountName = `${account.bankName}-${account.accountName}`;
    return { value: bankAccountName, accountid: account.id };
  });

  return (
    <AutoComplete
      style={{ width: 160 }}
      options={bankAccountOptions}
      placeholder="Bank Name"
      onSelect={onSelect}
      filterOption={(inputValue, option) => {
        return (
          option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        );
      }}
    />
  );
};

export default BankAccountsAutocomplete;
