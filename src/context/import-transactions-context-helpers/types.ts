import { FormTransaction } from "../../components/Tabs/transactions-tab/add-transactions-utils";
import { AccountWithTransactions } from "../../components/Tabs/transactions-tab/AddTransactionsForm/add-transactions-form";
import Payee from "../../components/Tabs/transactions-tab/AddTransactionsForm/model/payee";
import Rule from "../../components/Tabs/transactions-tab/AddTransactionsForm/model/rule";
import { ManagedProperty } from "../../components/Tabs/transactions-tab/AddTransactionsForm/payee-cat-desc-tag-manager";
import { FileParserResults } from "../../components/Tabs/transactions-tab/import-transactions/ImportTransactionsForm/model/file-parser-results";
import { ParsingError } from "../../components/Tabs/transactions-tab/import-transactions/ImportTransactionsForm/model/parsing-error";
import { TransactionsFileBankAccountPair } from "../../components/Tabs/transactions-tab/import-transactions/ImportTransactionsForm/model/transactions-file-bank-account";
import BankAccount from "../../model/bank-account";
import { Category } from "../../model/category";
import { Description } from "../../model/description";
import { Tag } from "../../model/tag";
import { ImportTransactionsActionType } from "./constants";

// Define the state type
export interface ImportTransactionsState {
  isImportTransactionsFormVisible: boolean;
  isImportSingleTransactionsFormVisible: boolean;
  isEditTransactionsFormVisible: boolean;
  editedTransaction: FormTransaction | undefined;
  isAddTransactionsFormModalVisible: boolean;
  isManageFormVisible: boolean;
  transactionsFileBankAccountPairs: TransactionsFileBankAccountPair[];
  filteredTansactions: AccountWithTransactions[];
  isLoading: boolean;
  errors: Error[];
  error: any | null; // fetch data error
  fileParsingErrors: ParsingError[];
  categories: Category[];
  tags: Tag[];
  descriptions: Description[];
  payees: Payee[];
  rules: Rule[];
  fileParserResults: FileParserResults[];
  activeBankAccounts: BankAccount[];
}

// Define the action type
export type ImportTransactionsAction =
  | {
      type: ImportTransactionsActionType.SET_LOADING;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.SET_TRANSACTIONS_BANK_ACC_PAIRS;
      payload: TransactionsFileBankAccountPair[];
    }
  | {
      type: ImportTransactionsActionType.ADD_API_ERROR;
      payload: Error;
    }
  | {
      type: ImportTransactionsActionType.ADD_PARSING_ERRORS;
      payload: ParsingError[];
    }
  | {
      type: ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.IMPORT_SINGLE_TXS_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.EDIT_TXS_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.SET_EDITED_TRANSACTION;
      payload: FormTransaction | undefined;
    }
  | {
      type: ImportTransactionsActionType.ADD_TXS_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.ADD_FILTERED_TRANSACTIONS;
      payload: AccountWithTransactions[];
    }
  | {
      type: ImportTransactionsActionType.SET_DATA_FETCH_ERROR;
      payload: any | null;
    }
  //--------------------------------
  // Manage form and its children
  //--------------------------------
  | {
      type: ImportTransactionsActionType.MANAGE_FORM_VISIBLE;
      payload: boolean;
    }
  | {
      type: ImportTransactionsActionType.SET_CATEGORIES;
      payload: Category[];
    }
  | {
      type: ImportTransactionsActionType.SET_DESCRIPTIONS;
      payload: Description[];
    }
  | {
      type: ImportTransactionsActionType.SET_TAGS;
      payload: Tag[];
    }
  | {
      type: ImportTransactionsActionType.SET_PAYEES;
      payload: Payee[];
    }
  | {
      type: ImportTransactionsActionType.SAVE_PAYEE;
      payload: {
        name: ManagedProperty;
        payee?: Payee;
        category?: Category;
        description?: Description;
        tag?: Tag;
      };
    }
  | {
      type: ImportTransactionsActionType.SET_RULES;
      payload: Rule[];
    }
  | {
      type: ImportTransactionsActionType.SAVE_RULE;
      payload: {
        name: ManagedProperty;
        rule: Rule;
      };
    }
  | {
      type: ImportTransactionsActionType.SAVE_CATEGORY;
      payload: {
        name: ManagedProperty;
        category: Category;
      };
    }
  | {
      type: ImportTransactionsActionType.SAVE_DESCRIPTION;
      payload: {
        name: ManagedProperty;
        description: Description;
      };
    }
  | {
      type: ImportTransactionsActionType.SAVE_TAG;
      payload: {
        name: ManagedProperty;
        tag: Tag;
      };
    }
  | {
      type: ImportTransactionsActionType.DELETE_PAYEE;
      payload: number;
    }
  | {
      type: ImportTransactionsActionType.DELETE_RULE;
      payload: number;
    }
  | {
      type: ImportTransactionsActionType.DELETE_CATEGORY;
      payload: number;
    }
  | {
      type: ImportTransactionsActionType.DELETE_DESCRIPTION;
      payload: number;
    }
  | {
      type: ImportTransactionsActionType.DELETE_TAG;
      payload: number;
    };
