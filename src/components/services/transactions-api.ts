import { BASE_URL } from "./api-common";

const BANK_ACCOUNT_FIELD = "bank-account";
const TRANSACTIONS_FIELD = "transactions";

export const fetchAccountTransactionsAPI = async (bankAccountId: number) => {
  const transactionsUrl: string = BASE_URL.concat("/")
    .concat(TRANSACTIONS_FIELD)
    .concat("/")
    .concat(BANK_ACCOUNT_FIELD)
    .concat(`/${bankAccountId}/`);
  const response = await fetch(transactionsUrl);

  if (!response.ok) {
    throw new Error("Transactions API: Fetching of data failed");
  }

  return await response.json();
};
