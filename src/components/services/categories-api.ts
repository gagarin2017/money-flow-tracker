import { Category } from "../../model/category";
import { BASE_URL, CATEGORIES_NODE } from "./api-common";
import { Method } from "./api-methods";

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

export const saveCategoryAPI = async (category: Category) => {
  const url: string = BASE_URL.concat("/").concat(CATEGORIES_NODE).concat("/");

  const response = await fetch(url, {
    method: Method.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Category API: Sending of data failed");
  }

  const receivedCategory = await response.json();
  return receivedCategory;
};

export const deleteCategoryAPI = async (categoryId: number) => {
  const url: string = BASE_URL.concat("/")
    .concat(CATEGORIES_NODE)
    .concat("/")
    .concat(categoryId.toString());

  const response = await fetch(url, {
    method: Method.DELETE,
  });

  if (!response.ok) {
    throw new Error("Category API: Deleting of data failed");
  }
};
