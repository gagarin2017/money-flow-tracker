import moment from "moment";
import { ImportTransactionsActionType } from "../../../context/import-transactions-context";
import BankAccount from "../../../model/bank-account";
import { Category } from "../../../model/category";
import { Description } from "../../../model/description";
import Error from "../../../model/error";
import { Tag } from "../../../model/tag";
import { Transaction } from "../../../model/transaction";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getStringFromDate,
  getStringFromDateWFormatter,
} from "../../../utils/date-helper";
import { fetchCategoriesAPI } from "../../services/categories-api";
import { fetchDescriptionsAPI } from "../../services/descriptions-api";
import { fetchPayeesAPI } from "../../services/payee-api";
import { fetchTagsAPI } from "../../services/tags-api";
import { AccountWithTransactions } from "./AddTransactionsForm/add-transactions-form";
import Payee from "./AddTransactionsForm/model/payee";
import { FileParserResults } from "./ImportTransactionsForm/model/file-parser-results";
import { NotificationInstance } from "antd/es/notification/interface";

export interface FormTransaction {
  id: number;
  date: string | undefined;
  payee?: Payee;
  category: Category | undefined;
  description?: Description;
  memo?: string;
  tag?: Tag;
  amount?: number | undefined;
  debitAmount?: number | undefined;
  creditAmount?: number | undefined;
}

export const EMPTY_FORM_TRANSACTION = {
  id: Math.random() * moment().toISOString().length,
  date: getStringFromDateWFormatter(moment().toDate(), DATE_FORMAT_DD_MM_YYYY),
  payee: undefined,
  category: undefined,
  description: undefined,
  memo: "",
  tag: undefined,
  debitAmount: undefined,
  creditAmount: undefined,
} as FormTransaction;

export const transformParsedTransactions = (
  parsedResults: FileParserResults[],
  activeAccounts: BankAccount[]
): AccountWithTransactions[] => {
  const result: AccountWithTransactions[] = [];

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
      } as AccountWithTransactions;

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
        memo: txToImport.description.name || txToImport.memo,
        debitAmount: txToImport.debitAmount,
        creditAmount: txToImport.creditAmount,
        category: undefined,
      } as FormTransaction;
    }
  );
  return result;
}

export const fetchPayeesCategoriesTags = async (
  isSpringBoot: boolean,
  dispatch: ({}: any) => void,
  api: NotificationInstance
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
      ? payeesResponse._embedded?.payees
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
    api.error({
      message: `Error occurred while fetching properties`,
      description: `${error}`,
      duration: 0,
    });
    // dispatch({
    //   type: ImportTransactionsActionType.ADD_ERROR,
    //   payload: {
    //     description: error,
    //     message: error,
    //     type: "error",
    //   } as Error,
    // });
  }
};
