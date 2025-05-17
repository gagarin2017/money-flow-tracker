import Rule from "../Tabs/transactions-tab/AddTransactionsForm/model/rule";
import { BASE_URL, RULES_NODE } from "./api-common";
import { Method } from "./api-methods";

export const fetchRulesAPI = async () => {
  const url = BASE_URL.concat("/").concat(RULES_NODE).concat("/");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Rule API - fetchRulesAPI: Fetching of data failed");
  }

  return await response.json();
};

export const saveRuleAPI = async (rule: Rule): Promise<Rule> => {
  const url = BASE_URL.concat("/").concat(RULES_NODE).concat("/");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rule),
  });

  if (!response.ok) {
    throw new Error("Saving Rule.. Network response was not ok");
  }

  return await response.json();
};

export const deleteRuleAPI = async (ruleId: number) => {
  const url: string = BASE_URL.concat("/")
    .concat(RULES_NODE)
    .concat("/")
    .concat(ruleId.toString());

  const response = await fetch(url, {
    method: Method.DELETE,
  });

  if (!response.ok) {
    throw new Error("Rule API: Deleting of data failed");
  }
};
