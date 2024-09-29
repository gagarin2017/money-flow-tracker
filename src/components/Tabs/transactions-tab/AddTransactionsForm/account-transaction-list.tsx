import AccountTransaction from "./account-transaction";
import { FormTransaction } from "../add-transactions-utils";
import { FormikErrors, FormikTouched } from "formik";
import { NewTransactionsFormData } from "./add-transactions-form";
import { HEADER_ROW } from "../transactions-utils";

interface AccountTransactionsListProps {
  transactions: FormTransaction[];
  accountIndex: number;
  isDateEditable?: boolean;
  errors: FormikErrors<NewTransactionsFormData>;
  touched: FormikTouched<NewTransactionsFormData>;
}

function AccountTransactionsList({
  accountIndex,
  transactions,
  isDateEditable,
  errors,
  touched,
}: AccountTransactionsListProps) {
  return (
    <>
      {HEADER_ROW}
      {transactions.map((transaction, txIndex) => {
        return (
          <AccountTransaction
            key={`accountTransaction${txIndex}${accountIndex + txIndex}`}
            transaction={transaction}
            accountIndex={accountIndex}
            txIndex={txIndex}
            isDateEditable={isDateEditable}
            dateField={`accountTransactions.${accountIndex}.transactions.${txIndex}.date`}
            payeeFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.payee`}
            categoryFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.category`}
            descriptionFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.description`}
            tagFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.tag`}
            debitAmountFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.debitAmount`}
            creditAmountFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.creditAmount`}
            memoFieldName={`accountTransactions.${accountIndex}.transactions.${txIndex}.memo`}
          />
        );
      })}
    </>
  );
}

export default AccountTransactionsList;
