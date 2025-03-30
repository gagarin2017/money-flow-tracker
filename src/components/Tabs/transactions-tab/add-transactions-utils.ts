import { NotificationInstance } from "antd/es/notification/interface";
import moment from "moment";
import { Category } from "../../../model/category";
import { Description } from "../../../model/description";
import { Tag } from "../../../model/tag";
import { Transaction } from "../../../model/transaction";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getDateFromString,
  getStringFromDate,
  getStringFromDateWFormatter,
} from "../../../utils/date-helper";
import { fetchCategoriesAPI } from "../../services/categories-api";
import { fetchDescriptionsAPI } from "../../services/descriptions-api";
import { fetchPayeesAPI } from "../../services/payee-api";
import { fetchTagsAPI } from "../../services/tags-api";
import Payee from "./AddTransactionsForm/model/payee";
import { ImportTransactionsActionType } from "../../../context/import-transactions-context-helpers/constants";
import { v4 as uuidv4 } from "uuid";

export interface FormTransaction {
  id: string;
  bankAccountId?: number;
  date: Date;
  payee?: Payee;
  category: Category | undefined;
  description?: Description;
  memo?: string;
  tag?: Tag;
  amount?: number | undefined;
  debitAmount?: number | undefined;
  creditAmount?: number | undefined;
  previouslySavedTransaction: boolean;
}

export const EMPTY_FORM_TRANSACTION = {
  id: "EMPTY",
  // date: getStringFromDateWFormatter(moment().toDate(), DATE_FORMAT_DD_MM_YYYY),
  date: getDateFromString("2025-03-15"),
  payee: undefined,
  category: undefined,
  description: undefined,
  memo: "",
  tag: undefined,
  debitAmount: undefined,
  creditAmount: undefined,
} as FormTransaction;

export const transformRemoteTransactionsIntoFormTransactions = (
  transactions: any[]
): FormTransaction[] => {
  return transactions.map((transaction) => {
    return {
      id: uuidv4(),
      date: getDateFromString(transaction.date),
      category: transaction.category,
      memo: transaction.memo,
      creditAmount:
        transaction.creditAmount === null
          ? undefined
          : transaction.creditAmount,
      debitAmount:
        transaction.debitAmount === null ? undefined : transaction.debitAmount,
      description: transaction.description,
      tag: transaction.tag,
      amount: transaction.amount,
      payee: {} as Payee,
      previouslySavedTransaction: transaction.previouslySavedTransaction,
    };
  });
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
      return {
        id: uuidv4().toString(),
        date: txToImport.date,
        memo: txToImport.memo || txToImport.description?.name,
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
    // dispatch({ type: ImportTransactionsActionType.FETCH_START });

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
