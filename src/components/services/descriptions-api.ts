import { BASE_URL, DESCRIPTIONS_NODE } from "./api-common";

export const fetchDescriptionsAPI = async () => {
  const url = BASE_URL.concat("/").concat(DESCRIPTIONS_NODE).concat("/");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Descriptions API - fetchDescriptionsAPI: Fetching of data failed"
    );
  }

  const fetchedData = response.json();

  return await fetchedData;
};
