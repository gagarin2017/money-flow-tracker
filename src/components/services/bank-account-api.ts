import { BASE_URL } from "./api-common";
import BankAccount from "../../model/bank-account";

export const fetchBankAccountsAPI = async () => {
  const url = BASE_URL.concat("/")
    .concat("bank-accounts")
    .concat("/")
    .concat("active");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Bank Accounts API - fetchBankAccountsAPI: Fetching of data failed"
    );
  }

  return await response.json();
};

export const editBankAccountsAPI = async (account: BankAccount) => {
  const response = await fetch(
    BASE_URL.concat("/")
      .concat("bank-accounts")
      .concat("/")
      .concat(account.id.toString()),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
};

export const fetchActiveBankAccountsAPI = async () => {
  const url = BASE_URL.concat("/")
    .concat("bank-accounts")
    .concat("/")
    .concat("active");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Bank Accounts API - fetchActiveBankAccountsAPI: Fetching of data failed"
    );
  }

  return await response.json();
};
