import { BASE_URL, TAGS_NODE } from "./api-common";

export const fetchTagsAPI = async () => {
  const url = BASE_URL.concat("/").concat(TAGS_NODE).concat("/");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Tags API - fetchTagsAPI: Fetching of data failed");
  }

  const fetchedData = response.json();

  return await fetchedData;
};
