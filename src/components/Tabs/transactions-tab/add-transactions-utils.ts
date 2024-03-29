import { DataSourceItemType } from "antd/lib/auto-complete";
import moment from "moment";
import { ImportTransactionsActionType } from "../../../context/import-transactions-context";
import BankAccount from "../../../model/bank-account";
import { Description } from "../../../model/description";
import Error from "../../../model/error";
import { Tag } from "../../../model/tag";
import { Transaction } from "../../../model/transaction";
import { getStringFromDate } from "../../../utils/date-helper";
import { fetchCategoriesAPI } from "../../services/categories-api";
import { fetchTagsAPI } from "../../services/tags-api";
import { AccountTransaction } from "./AddTransactionsForm/add-transactions-form";
import { FileParserResults } from "./ImportTransactionsForm/model/file-parser-results";
import { fetchPayeesAPI } from "../../services/payee-api";
import { fetchDescriptionsAPI } from "../../services/descriptions-api";
import { Category } from "../../../model/category";
import Payee from "./AddTransactionsForm/model/payee";

export interface FormTransaction {
  id: number | undefined;
  date: string;
  payee?: Payee;
  category?: Category;
  description?: Description;
  memo?: string;
  tag?: Tag;
  amount: number | undefined;
}

export const EMPTY_FORM_TRANSACTION = {
  id: Math.random() * moment().toISOString().length,
  date: moment().toISOString(),
  payee: undefined,
  category: undefined,
  description: undefined,
  memo: "",
  tag: undefined,
  amount: undefined,
} as FormTransaction;

export const transformParsedTransactions = (
  parsedResults: FileParserResults[],
  activeAccounts: BankAccount[]
): AccountTransaction[] => {
  const result: AccountTransaction[] = [];

  parsedResults.forEach((parserResults: FileParserResults) => {
    const account = activeAccounts.find(
      (acc) => acc.id === parserResults.accountId
    );
    if (account) {
      const tableTransactions = {
        bankAccount: account,
        transactions: transformTransactionsToTableTransactions(
          parserResults.buildTransactionsForRequest
        ),
      } as AccountTransaction;

      result.push(tableTransactions);
    }
  });

  return result;
};

/**
 * Return the transaction as an editable table row in the Add transaction form
 *
 * @param buildTransactionsForRequest
 */
function transformTransactionsToTableTransactions(
  transactionsToBeImported: Transaction[]
): FormTransaction[] {
  const result: FormTransaction[] = transactionsToBeImported.map(
    (txToImport: Transaction) => {
      const date = getStringFromDate(txToImport.date);
      return {
        id: -date.length * Math.random() * 1234,
        date: date,
        memo: txToImport.description.name,
        amount: txToImport.amount,
      } as FormTransaction;
    }
  );
  return result;
}

export const fetchPayeesCategoriesTags = async (
  isSpringBoot: boolean,
  dispatch: ({}: any) => void
) => {
  try {
    dispatch({ type: ImportTransactionsActionType.FETCH_START });

    const categoriesResponse = await fetchCategoriesAPI();
    const descriptionsResponse = await fetchDescriptionsAPI();
    const tagsResponse = await fetchTagsAPI();
    const payeesResponse = await fetchPayeesAPI();

    // TODO: Dev ONLY!
    // Fix it when in production
    const categories = isSpringBoot
      ? categoriesResponse._embedded.categories
      : categoriesResponse;

    // TODO: Dev ONLY!
    // Fix it when in production
    const descriptions = isSpringBoot
      ? descriptionsResponse._embedded.descriptions
      : descriptionsResponse;

    // TODO: Dev ONLY!
    // Fix it when in production
    const tags = isSpringBoot ? tagsResponse._embedded.tags : tagsResponse;

    // TODO: Dev ONLY!
    // Fix it when in production
    const payees = isSpringBoot
      ? payeesResponse._embedded.payees
      : payeesResponse;

    dispatch({
      type: ImportTransactionsActionType.SET_CATEGORIES,
      payload: categories,
    });

    dispatch({
      type: ImportTransactionsActionType.SET_DESCRIPTIONS,
      payload: descriptions,
    });
    dispatch({
      type: ImportTransactionsActionType.SET_TAGS,
      payload: tags,
    });
    dispatch({
      type: ImportTransactionsActionType.SET_PAYEES,
      payload: payees,
    });
  } catch (error) {
    dispatch({
      type: ImportTransactionsActionType.ADD_ERROR,
      payload: {
        description: error,
        message: error,
        type: "error",
      } as Error,
    });
  }
};
