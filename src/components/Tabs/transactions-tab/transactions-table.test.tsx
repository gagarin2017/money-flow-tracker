import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setMatchMedia } from "../../test-helper";
import TransactionsTable from "./transactions-table";
import { Transaction } from "../../../model/transaction";

setMatchMedia();

// const inputTransactions: Transaction[] = [
//   {
//     id: 7100,
//     date: new Date(),
//     bankAccount: {
//       id: 5,
//       bankName: "KBC",
//       active: true,
//       balance: -265.46,
//       links: [
//         {
//           rel: "self",
//           href: "http://localhost:8080/api/bank-accounts/9",
//         },
//         {
//           rel: "allBankAccounts",
//           href: "http://localhost:8080/api/bank-accounts/",
//         },
//       ],
//     },
//     description: {
//       id: 3,
//       name: "",
//       links: [
//         {
//           rel: "self",
//           href: "http://localhost:8080/api/descriptions/3",
//         },
//         {
//           rel: "allDescriptions",
//           href: "http://localhost:8080/api/descriptions/",
//         },
//       ],
//     },
//     memo: "",
//     category: {
//       id: 32,
//       name: "Groceries",
//       parentCategory: {
//         id: 31,
//         name: "Food & Dining",
//         subCategories: [],
//         links: [
//           {
//             rel: "self",
//             href: "http://localhost:8080/api/categories/31",
//           },
//           {
//             rel: "allCategories",
//             href: "http://localhost:8080/api/categories/",
//           },
//         ],
//       },
//       subCategories: [],
//       links: [
//         {
//           rel: "self",
//           href: "http://localhost:8080/api/categories/32",
//         },
//         {
//           rel: "allCategories",
//           href: "http://localhost:8080/api/categories/",
//         },
//       ],
//     },
//     tag: {
//       id: 2,
//       name: "",
//       links: [
//         {
//           rel: "self",
//           href: "http://localhost:8080/api/tags/2",
//         },
//         {
//           rel: "allTags",
//           href: "http://localhost:8080/api/tags/",
//         },
//       ],
//     },
//     reconsiled: true,
//     amount: -32.28,
//     runningBalance: -178.22,
//     betweenAccountsTransaction: false,
//     created_At: "2023-10-15T18:58:17.199",
//     updated_At: "2023-10-15T19:00:13.963",
//     links: [
//       {
//         rel: "self",
//         href: "http://localhost:8080/api/transactions/7100",
//       },
//       {
//         rel: "allTransactions",
//         href: "http://localhost:8080/api/transactions/{?dateFrom,dateTo}",
//       },
//     ],
//   },
// ];

// test("the passed transactions properties are displayed on the screen", async () => {
//   // Given
//   <TransactionsTable transactions={inputTransactions} />;

//   // When
//   const bankAccountCard = screen.getByTestId("bank-account");

//   // Then
//   expect(bankAccountCard).toHaveStyle("background-color: lightBlue");
// });
