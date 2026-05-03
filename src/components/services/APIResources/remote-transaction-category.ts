import { Category } from "../../../model/category";

/**
 * @deprecated need to be removed as no serialization/deserialization should be needed. The backend should send the exact object structure as in the UI
 */
export const deserializeCategories = (categories: Category[]): Category[] => {
  return categories.map((category) => deserializeCategory(category));
};

export const deserializeCategory = (category: Category) => {
  return {
    id: category.id,
    name: category.name,
    parentCategory: category.parentCategory
      ? getParentCategory(category.parentCategory)
      : undefined,
    subCategories:
      category.subCategories && Array.isArray(category.subCategories)
        ? getSubCategories(category.subCategories)
        : [],
  } as Category;
};

const getParentCategory = (category: Category): Category | undefined => {
  return {
    ...category,
    parentCategory: category.parentCategory
      ? getParentCategory(category.parentCategory)
      : undefined,
  } as Category;
};

function getSubCategories(subCategories: Category[]): Category[] {
  return subCategories.map((category) => {
    return {
      ...category,
      subCategories:
        category.subCategories && category.subCategories.length > 0
          ? getSubCategories(category.subCategories)
          : undefined,
    } as Category;
  });
}
