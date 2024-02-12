import { Description } from "../../model/description";
import { BASE_URL, DESCRIPTIONS_NODE } from "./api-common";
import { Method } from "./api-methods";

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

export const saveDescriptionsAPI = async (description: Description) => {
  const url = BASE_URL.concat("/").concat(DESCRIPTIONS_NODE).concat("/");

  const response = await fetch(url, {
    method: Method.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(description),
  });

  if (!response.ok) {
    throw new Error(
      "Descriptions API - fetchDescriptionsAPI: Fetching of data failed"
    );
  }

  return await response.json();
};

export const deleteDescriptionAPI = async (descriptionId: number) => {
  const url: string = BASE_URL.concat("/")
    .concat(DESCRIPTIONS_NODE)
    .concat("/")
    .concat(descriptionId.toString());

  const response = await fetch(url, {
    method: Method.DELETE,
  });

  if (!response.ok) {
    throw new Error("Descriptions API: Deleting of data failed");
  }
};
