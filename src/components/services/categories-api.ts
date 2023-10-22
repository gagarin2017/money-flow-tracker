import { BASE_URL, CATEGORIES_NODE } from "./api-common";

export const fetchCategoriesAPI = async () => {
  const url = BASE_URL.concat("/").concat(CATEGORIES_NODE).concat("/");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Categories API - fetchCategoriesAPI: Fetching of data failed"
    );
  }

  const fetchedData = response.json();

  return await fetchedData;
};
