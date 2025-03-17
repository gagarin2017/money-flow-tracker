import { useState, useEffect } from "react";
import { filterTransactionsAPI } from "./components/services/transactions-api";

interface FetchDataProps {
  activeBankAccounts: any[];
  transactionsToBeImported: any[];
}

const useFetchData = ({
  activeBankAccounts,
  transactionsToBeImported,
}: FetchDataProps) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await filterTransactionsAPI(transactionsToBeImported);
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeBankAccounts, transactionsToBeImported]);

  return { data, loading, error };
};

export default useFetchData;
