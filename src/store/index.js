import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { bankAccountsApi } from "./apis/bank-accounts-api";

export const store = configureStore({
  reducer: {
    [bankAccountsApi.reducerPath]: bankAccountsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(bankAccountsApi.middleware);
  },
});

setupListeners(store.dispatch);

export { useFetchBankAccountsQuery } from "./apis/bank-accounts-api";
