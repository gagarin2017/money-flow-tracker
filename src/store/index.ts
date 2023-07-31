import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { bankAccountsApi } from "./apis/bank-accounts-api";

// Create the root reducer independently to obtain the RootState type
const rootReducer = combineReducers({
  [bankAccountsApi.reducerPath]: bankAccountsApi.reducer,
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(bankAccountsApi.middleware);
    },
    preloadedState,
  });
}

setupListeners(setupStore().dispatch);

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) => {
//     return getDefaultMiddleware().concat(bankAccountsApi.middleware);
//   },
// });

// setupListeners(store.dispatch);

export {
  useFetchBankAccountsQuery,
  useUpdateBankAccountMutation,
} from "./apis/bank-accounts-api";

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
