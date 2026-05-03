import { Description } from "../../../model/description";
/**
 * @deprecated need to be removed as no serialization/deserialization should be needed. The backend should send the exact object structure as in the UI
 */
export const deserializeDescriptions = (
  descriptions: Description[]
): Description[] => {
  return descriptions.map((description) => deserializeDescription(description));
};

export const deserializeDescription = (description: Description) => {
  return {
    id: description.id,
    name: description.name,
  } as Description;
};
