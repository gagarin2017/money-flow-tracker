import { Tag } from "../../model/tag";
import { BASE_URL, TAGS_NODE } from "./api-common";
import { Method } from "./api-methods";

export const fetchTagsAPI = async () => {
  const url = BASE_URL.concat("/").concat(TAGS_NODE).concat("/");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Tags API - fetchTagsAPI: Fetching of data failed");
  }

  const fetchedData = response.json();

  return await fetchedData;
};

export const saveTagAPI = async (tag: Tag) => {
  const url = BASE_URL.concat("/").concat(TAGS_NODE).concat("/");

  const response = await fetch(url, {
    method: Method.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tag),
  });

  if (!response.ok) {
    throw new Error("Tags API - fetchTagAPI: Fetching of data failed");
  }

  return await response.json();
};

export const deleteTagAPI = async (tagId: number) => {
  const url: string = BASE_URL.concat("/")
    .concat(TAGS_NODE)
    .concat("/")
    .concat(tagId.toString());

  const response = await fetch(url, {
    method: Method.DELETE,
  });

  if (!response.ok) {
    throw new Error("Tags API: Deleting of data failed");
  }
};
