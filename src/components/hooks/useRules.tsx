// hooks/useRules.ts
import { useEffect, useState } from "react";
import {
  fetchRulesAPI,
  saveRuleAPI,
  deleteRuleAPI,
} from "../services/rule-api";
import Rule from "../Tabs/transactions-tab/AddTransactionsForm/model/rule";

type UseRulesReturn = {
  rules: Rule[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  saveRule: (rule: Rule) => Promise<Rule>;
  deleteRule: (ruleId: number) => Promise<void>;
};

export const useRules = (): UseRulesReturn => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRules = async () => {
    try {
      console.log("Fetching the rule from API");
      setLoading(true);
      const fetchedRules = await fetchRulesAPI();

      console.log("Result: ", fetchedRules._embedded?.rules);

      const result = fetchedRules._embedded?.rules || [];

      setRules(result);
    } catch (err) {
      console.log("useRules custom hook failed to pull the rules from API");
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const saveRule = async (rule: Rule): Promise<Rule> => {
    try {
      const savedRule = await saveRuleAPI(rule);
      await fetchRules(); // Refresh the list

      return savedRule;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteRule = async (ruleId: number) => {
    try {
      await deleteRuleAPI(ruleId);
      await fetchRules(); // Refresh the list
    } catch (err) {
      setError(err as Error);
    }
  };

  // useEffect(() => {
  //   fetchRules();
  // }, []);

  return {
    rules,
    loading,
    error,
    refetch: fetchRules,
    saveRule,
    deleteRule,
  };
};
