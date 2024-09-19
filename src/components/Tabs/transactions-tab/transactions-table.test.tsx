import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setMatchMedia } from "../../test-helper";
import TransactionsTable from "./transactions-table";
import { Transaction } from "../../../model/transaction";
import {
  DATE_FORMAT_DD_MM_YYYY,
  getStringFromDateWFormatter,
} from "../../../utils/date-helper";
import { getAmountAsFormatedString } from "../../../utils/currency-helper";
import BankAccount from "../../../model/bank-account";

setMatchMedia();

const currentDate = new Date();
const currentDateString = getStringFromDateWFormatter(
  currentDate,
  DATE_FORMAT_DD_MM_YYYY
);

const inputTransactions: Transaction[] = [
  {
    id: 3933,
    date: currentDate,
    bankAccount: {} as BankAccount,
    description: {
      id: 3,
      name: "Some works in the bathroom",
      _links: {
        self: {
          href: "http://localhost:8080/api/descriptions/3",
        },
        allDescriptions: {
          href: "http://localhost:8080/api/descriptions/",
        },
      },
    },
    memo: "family bathroom",
    category: {
      id: 62,
      name: "Home Improvement",
      parentCategory: {
        id: 28,
        name: "Home",
        subCategories: [],
        _links: {
          self: {
            href: "http://localhost:8080/api/categories/28",
          },
          allCategories: {
            href: "http://localhost:8080/api/categories/",
          },
        },
      },
      subCategories: [],
      _links: {
        self: {
          href: "http://localhost:8080/api/categories/62",
        },
        allCategories: {
          href: "http://localhost:8080/api/categories/",
        },
      },
    },
    tag: {
      id: 26,
      name: "family bathroom renovation",
      _links: {
        self: {
          href: "http://localhost:8080/api/tags/26",
        },
        allTags: {
          href: "http://localhost:8080/api/tags/",
        },
      },
    },
    reconsiled: true,
    amount: -1220.2,
    creditAmount: 0,
    debitAmount: -1220.2,
    runningBalance: 15641.2,
    betweenAccountsTransaction: false,
    created_At: "2023-10-15T18:58:10.672",
    updated_At: "2023-10-15T18:59:30.557",
    _links: {
      self: {
        href: "http://localhost:8080/api/transactions/1930",
      },
      allTransactions: {
        href: "http://localhost:8080/api/transactions/{?dateFrom,dateTo}",
        templated: true,
      },
    },
  },
];
const renderComponent = () => {
  render(
    <TransactionsTable
      transactions={inputTransactions}
      isLoading={false}
      handleTransactionDeletion={() => {}}
    />
  );
};

test("table titles are displayed on the screen", async () => {
  // Given
  renderComponent();

  // When
  const dateTitle = screen.getByText("Date");
  const categoryTitle = screen.getByText("Category");
  const descriptionTitle = screen.getByText("Description");
  const memoTitle = screen.getByText("Memo");
  const tagTitle = screen.getByText("Tag");
  const reconsiledTitle = screen.getByText("Reconsiled");
  const amountTitle = screen.getByText("Amount");
  const balanceTitle = screen.getByText("Balance");
  const actionTitle = screen.getByText("Action");

  // Then
  expect(dateTitle).toBeInTheDocument();
  expect(categoryTitle).toBeInTheDocument();
  expect(descriptionTitle).toBeInTheDocument();
  expect(memoTitle).toBeInTheDocument();
  expect(tagTitle).toBeInTheDocument();
  expect(reconsiledTitle).toBeInTheDocument();
  expect(amountTitle).toBeInTheDocument();
  expect(balanceTitle).toBeInTheDocument();
  expect(actionTitle).toBeInTheDocument();
});

test("the passed transactions properties are displayed on the screen", async () => {
  // Given
  renderComponent();

  // When
  const transactionDate = screen.getByText(currentDateString);
  const expectedCategory = `${inputTransactions[0].category.parentCategory?.name} : ${inputTransactions[0].category.name}`;
  let transactionCategory;
  if (inputTransactions[0].category.parentCategory?.name) {
    transactionCategory = screen.getByText(expectedCategory);
  }
  const transactionDescription = screen.getByText(
    inputTransactions[0].description.name
  );
  const transactionMemo = screen.getByText(inputTransactions[0].memo);
  const transactionTag = screen.getByText(inputTransactions[0].tag.name);
  const transactionReconsiled = screen.getByText("Yes");
  const transactionAmount = screen.getByText(
    getAmountAsFormatedString(inputTransactions[0].amount)
  );
  const transactionBalance = screen.getByText(
    getAmountAsFormatedString(inputTransactions[0].runningBalance)
  );
  const transactionActionDelete = screen.getByText("Delete");

  // Then
  expect(transactionDate).toBeInTheDocument();
  expect(transactionCategory).toBeInTheDocument();
  expect(transactionDescription).toBeInTheDocument();
  expect(transactionMemo).toBeInTheDocument();
  expect(transactionTag).toBeInTheDocument();
  expect(transactionReconsiled).toBeInTheDocument();
  expect(transactionAmount).toBeInTheDocument();
  expect(transactionBalance).toBeInTheDocument();
  expect(transactionActionDelete).toBeInTheDocument();
});
