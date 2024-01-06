import Payee from "../Tabs/transactions-tab/AddTransactionsForm/model/payee";
import { BASE_URL, PAYEES_NODE } from "./api-common";
import { Method } from "./api-methods";

export const fetchPayeesAPI = async () => {
  const url = BASE_URL.concat("/").concat(PAYEES_NODE).concat("/");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Payees API - fetchPayeesAPI: Fetching of data failed");
  }

  return await response.json();
};

export const savePayeeAPI = async (payee: Payee): Promise<Payee> => {
  const url = BASE_URL.concat("/").concat(PAYEES_NODE).concat("/");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payee),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
};

export const deletePayeeAPI = async (payeeId: number) => {
  const transactionsUrl: string = BASE_URL.concat("/")
    .concat(PAYEES_NODE)
    .concat("/")
    .concat(payeeId.toString());

  const response = await fetch(transactionsUrl, {
    method: Method.DELETE,
  });

  if (!response.ok) {
    throw new Error("Payee API: Deleting of data failed");
  }
};
