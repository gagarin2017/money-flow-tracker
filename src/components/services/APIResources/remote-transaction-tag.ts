import { Tag } from "../../../model/tag";
/**
 * @deprecated need to be removed as no serialization/deserialization should be needed. The backend should send the exact object structure as in the UI
 */
export const deserializeTags = (tags: Tag[]): Tag[] => {
  return tags.map((tag) => deserializeTag(tag));
};

export const deserializeTag = (tag: Tag) => {
  return {
    id: tag.id,
    name: tag.name,
  } as Tag;
};
