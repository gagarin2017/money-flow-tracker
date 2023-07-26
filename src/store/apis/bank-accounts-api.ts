import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import BankAccount from "../../model/bank-account";

type BankAccountResponse = BankAccount[];

// DEV ONLY!!!
const pause = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const bankAccountsApi = createApi({
  reducerPath: "albums",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3005",
    fetchFn: async (...args) => {
      // await pause(1000);
      return fetch(...args);
    },
  }),
  tagTypes: ["BankAccounts"],
  endpoints(builder) {
    return {
      updateBankAccount: builder.mutation({
        invalidatesTags: (
          result: any,
          error: any,
          bankAccount: BankAccount
        ) => {
          return [{ type: "BankAccounts", id: bankAccount.id }];
        },
        query: (bankAccount) => {
          return {
            url: `/bankAccounts/${bankAccount.id}`,
            method: "PATCH",
            body: bankAccount,
          };
        },
      }),
      fetchBankAccounts: builder.query<BankAccountResponse, void>({
        query: () => {
          return {
            url: "/bankAccounts",
            method: "GET",
          };
        },
        providesTags: (result) =>
          result ? result.map(({ id }) => ({ type: "BankAccounts", id })) : [],
      }),
    };
  },
});

export const { useFetchBankAccountsQuery, useUpdateBankAccountMutation } =
  bankAccountsApi;
export { bankAccountsApi };
